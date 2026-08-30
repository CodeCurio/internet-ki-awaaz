-- ============================================================================
-- INTERNET KI AWAAZ (इंटरनेट की आवाज़) — PRODUCTION DATABASE DDL MIGRATION
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. Custom Enum Types
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'editor',
  'reporter',
  'contributor'
);

CREATE TYPE post_status AS ENUM (
  'draft',
  'in_review',
  'scheduled',
  'published',
  'archived',
  'retracted'
);

CREATE TYPE post_format AS ENUM (
  'standard_article',
  'video_report',
  'photo_gallery',
  'live_blog',
  'opinion_editorial',
  'press_release'
);

CREATE TYPE ad_placement AS ENUM (
  'homepage_leaderboard',
  'homepage_sidebar',
  'article_inline',
  'article_sidebar',
  'category_header',
  'sticky_footer_mobile'
);

CREATE TYPE directory_tier AS ENUM (
  'free_listing',
  'verified',
  'featured',
  'premium_sponsor'
);

CREATE TYPE breaking_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- 3. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  full_name_hi TEXT,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  bio_hi TEXT,
  role user_role NOT NULL DEFAULT 'contributor',
  designation TEXT,
  designation_hi TEXT,
  phone_number TEXT,
  whatsapp_number TEXT,
  twitter_handle TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  reporter_beat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Extends auth.users with editorial staff metadata and RBAC role assignment.';
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- 4. Categories Table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_hi TEXT,
  icon_name TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  seo_title_hi TEXT,
  seo_description_hi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);

-- 5. Tags Table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_hi TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON public.tags(slug);
CREATE INDEX idx_tags_usage ON public.tags(usage_count DESC);

-- 6. Posts Table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_hi TEXT NOT NULL,
  title_en TEXT,
  subtitle_hi TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt_hi TEXT,
  body_hi JSONB NOT NULL DEFAULT '{}'::JSONB,
  body_html_cache TEXT,
  format post_format NOT NULL DEFAULT 'standard_article',
  status post_status NOT NULL DEFAULT 'draft',
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  editor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  featured_image_url TEXT,
  featured_image_alt_hi TEXT,
  gallery_image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  youtube_video_id TEXT,
  youtube_thumbnail_url TEXT,
  youtube_duration_seconds INTEGER,
  is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_video_first BOOLEAN NOT NULL DEFAULT FALSE,
  view_count BIGINT NOT NULL DEFAULT 0,
  reading_time_minutes INTEGER,
  seo_title_hi TEXT,
  seo_description_hi TEXT,
  canonical_url TEXT,
  json_ld_type TEXT DEFAULT 'NewsArticle',
  search_vector TSVECTOR,
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_category ON public.posts(category_id);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_posts_is_breaking ON public.posts(is_breaking) WHERE is_breaking = true;
CREATE INDEX idx_posts_search_vector ON public.posts USING GIN(search_vector);
CREATE INDEX idx_posts_title_trgm ON public.posts USING GIN(title_hi gin_trgm_ops);

-- 7. Post Tags Join Table
CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_tag ON public.post_tags(tag_id);

-- 8. Breaking News Table
CREATE TABLE public.breaking_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline_hi TEXT NOT NULL,
  linked_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  priority breaking_priority NOT NULL DEFAULT 'medium',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '6 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_breaking_active ON public.breaking_news(is_active, expires_at);

-- 9. Directory Listings Table
CREATE TABLE public.directory_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name_hi TEXT NOT NULL,
  business_name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  category_hi TEXT NOT NULL,
  description_hi TEXT,
  address_hi TEXT,
  locality TEXT,
  phone_number TEXT,
  whatsapp_number TEXT,
  cover_image_url TEXT,
  logo_url TEXT,
  tier directory_tier NOT NULL DEFAULT 'free_listing',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC(2,1) DEFAULT 0.0,
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_directory_slug ON public.directory_listings(slug);
CREATE INDEX idx_directory_tier ON public.directory_listings(tier);
CREATE INDEX idx_directory_locality ON public.directory_listings(locality);

-- 10. Advertisements Table
CREATE TABLE public.advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_name TEXT NOT NULL,
  advertiser_name TEXT NOT NULL,
  placement ad_placement NOT NULL,
  creative_image_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  alt_text_hi TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  impression_count BIGINT NOT NULL DEFAULT 0,
  click_count BIGINT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ads_placement ON public.advertisements(placement, is_active);
CREATE INDEX idx_ads_dates ON public.advertisements(start_date, end_date);

-- 11. Audit Logs Table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);

-- 12. Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directory_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 13. Helper Functions for RBAC
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'editor', 'reporter', 'contributor')
      AND is_active = true
  );
$$;

-- 14. RLS Policies: profiles
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_self_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "profiles_admin_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (public.current_user_role() = 'super_admin');

CREATE POLICY "profiles_admin_update_all"
  ON public.profiles FOR UPDATE
  USING (public.current_user_role() = 'super_admin')
  WITH CHECK (true);

CREATE POLICY "profiles_admin_delete"
  ON public.profiles FOR DELETE
  USING (public.current_user_role() = 'super_admin');

-- 15. RLS Policies: categories
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "categories_staff_read_all"
  ON public.categories FOR SELECT
  USING (public.is_staff());

CREATE POLICY "categories_editor_write"
  ON public.categories FOR INSERT
  WITH CHECK (public.current_user_role() IN ('super_admin', 'editor'));

CREATE POLICY "categories_editor_update"
  ON public.categories FOR UPDATE
  USING (public.current_user_role() IN ('super_admin', 'editor'));

CREATE POLICY "categories_admin_delete"
  ON public.categories FOR DELETE
  USING (public.current_user_role() = 'super_admin');

-- 16. RLS Policies: tags
CREATE POLICY "tags_public_read"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "tags_staff_write"
  ON public.tags FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "tags_staff_update"
  ON public.tags FOR UPDATE
  USING (public.is_staff());

CREATE POLICY "tags_editor_delete"
  ON public.tags FOR DELETE
  USING (public.current_user_role() IN ('super_admin', 'editor'));

-- 17. RLS Policies: posts
CREATE POLICY "posts_public_read_published"
  ON public.posts FOR SELECT
  USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "posts_staff_read_all"
  ON public.posts FOR SELECT
  USING (public.is_staff());

CREATE POLICY "posts_author_insert"
  ON public.posts FOR INSERT
  WITH CHECK (
    public.is_staff()
    AND author_id = auth.uid()
    AND (
      public.current_user_role() IN ('reporter', 'contributor')
      AND status IN ('draft', 'in_review')
      OR public.current_user_role() IN ('editor', 'super_admin')
    )
  );

CREATE POLICY "posts_author_update_own_draft"
  ON public.posts FOR UPDATE
  USING (
    author_id = auth.uid()
    AND status IN ('draft', 'in_review')
  )
  WITH CHECK (
    author_id = auth.uid()
    AND status IN ('draft', 'in_review')
  );

CREATE POLICY "posts_editor_update_all"
  ON public.posts FOR UPDATE
  USING (public.current_user_role() IN ('editor', 'super_admin'))
  WITH CHECK (public.current_user_role() IN ('editor', 'super_admin'));

CREATE POLICY "posts_editor_delete"
  ON public.posts FOR DELETE
  USING (public.current_user_role() IN ('editor', 'super_admin'));

-- 18. RLS Policies: post_tags
CREATE POLICY "post_tags_public_read"
  ON public.post_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id AND p.status = 'published'
    )
    OR public.is_staff()
  );

CREATE POLICY "post_tags_staff_write"
  ON public.post_tags FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "post_tags_staff_delete"
  ON public.post_tags FOR DELETE
  USING (public.is_staff());

-- 19. RLS Policies: breaking_news
CREATE POLICY "breaking_public_read"
  ON public.breaking_news FOR SELECT
  USING (is_active = true AND expires_at > NOW());

CREATE POLICY "breaking_staff_read_all"
  ON public.breaking_news FOR SELECT
  USING (public.is_staff());

CREATE POLICY "breaking_editor_write"
  ON public.breaking_news FOR INSERT
  WITH CHECK (public.current_user_role() IN ('editor', 'super_admin'));

CREATE POLICY "breaking_editor_update"
  ON public.breaking_news FOR UPDATE
  USING (public.current_user_role() IN ('editor', 'super_admin'));

CREATE POLICY "breaking_editor_delete"
  ON public.breaking_news FOR DELETE
  USING (public.current_user_role() IN ('editor', 'super_admin'));

-- 20. RLS Policies: directory_listings
CREATE POLICY "directory_public_read_approved"
  ON public.directory_listings FOR SELECT
  USING (is_approved = true);

CREATE POLICY "directory_staff_read_all"
  ON public.directory_listings FOR SELECT
  USING (public.is_staff());

CREATE POLICY "directory_authenticated_submit"
  ON public.directory_listings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND submitted_by = auth.uid() AND is_approved = false);

CREATE POLICY "directory_editor_update"
  ON public.directory_listings FOR UPDATE
  USING (public.current_user_role() IN ('editor', 'super_admin'));

CREATE POLICY "directory_editor_delete"
  ON public.directory_listings FOR DELETE
  USING (public.current_user_role() IN ('editor', 'super_admin'));

-- 21. RLS Policies: advertisements
CREATE POLICY "ads_public_read_active"
  ON public.advertisements FOR SELECT
  USING (is_active = true AND NOW() BETWEEN start_date AND end_date);

CREATE POLICY "ads_staff_read_all"
  ON public.advertisements FOR SELECT
  USING (public.is_staff());

CREATE POLICY "ads_admin_write"
  ON public.advertisements FOR INSERT
  WITH CHECK (public.current_user_role() IN ('super_admin', 'editor'));

CREATE POLICY "ads_admin_update"
  ON public.advertisements FOR UPDATE
  USING (public.current_user_role() IN ('super_admin', 'editor'));

CREATE POLICY "ads_admin_delete"
  ON public.advertisements FOR DELETE
  USING (public.current_user_role() = 'super_admin');

-- 22. RLS Policies: audit_logs
CREATE POLICY "audit_admin_read"
  ON public.audit_logs FOR SELECT
  USING (public.current_user_role() = 'super_admin');

CREATE POLICY "audit_no_direct_insert"
  ON public.audit_logs FOR INSERT
  WITH CHECK (false);

-- 23. Triggers & Stored Procedures
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_directory_updated_at
  BEFORE UPDATE ON public.directory_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Slug Generation
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  base_slug TEXT;
BEGIN
  base_slug := lower(regexp_replace(unaccent(input_text), '[^a-zA-Z0-9\u0900-\u097F]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  RETURN base_slug;
END;
$$;

CREATE OR REPLACE FUNCTION public.posts_auto_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  candidate TEXT;
  counter INTEGER := 0;
  final_slug TEXT;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    candidate := public.generate_slug(coalesce(NEW.title_en, NEW.title_hi));
    final_slug := candidate || '-' || to_char(NOW(), 'YYYYMMDD');
    WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = final_slug AND id <> NEW.id) LOOP
      counter := counter + 1;
      final_slug := candidate || '-' || to_char(NOW(), 'YYYYMMDD') || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_posts_auto_slug
  BEFORE INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.posts_auto_slug();

-- Search Vector Trigger
CREATE OR REPLACE FUNCTION public.posts_search_vector_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.title_hi, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.subtitle_hi, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.excerpt_hi, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(NEW.body_html_cache, '')), 'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_posts_search_vector
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.posts_search_vector_update();

-- View Counter Atomic Increment
CREATE OR REPLACE FUNCTION public.increment_post_view(post_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE id = post_uuid AND status = 'published';
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_view(UUID) TO anon, authenticated;

-- Tag Usage Counter
CREATE OR REPLACE FUNCTION public.sync_tag_usage_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.tags SET usage_count = greatest(usage_count - 1, 0) WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_post_tags_usage
  AFTER INSERT OR DELETE ON public.post_tags
  FOR EACH ROW EXECUTE FUNCTION public.sync_tag_usage_count();

-- Audit Log Writer Trigger
CREATE OR REPLACE FUNCTION public.write_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('UPDATE', 'INSERT') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN coalesce(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_audit_posts
  AFTER INSERT OR UPDATE OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

CREATE TRIGGER trg_audit_directory
  AFTER INSERT OR UPDATE OR DELETE ON public.directory_listings
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

CREATE TRIGGER trg_audit_advertisements
  AFTER INSERT OR UPDATE OR DELETE ON public.advertisements
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

CREATE TRIGGER trg_audit_profiles
  AFTER UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- Auto-Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, role)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    coalesce(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 6)),
    'contributor'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 24. Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('post-media', 'post-media', true),
  ('avatars', 'avatars', true),
  ('directory-media', 'directory-media', true),
  ('ad-creatives', 'ad-creatives', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "post_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');

CREATE POLICY "post_media_staff_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-media' AND public.is_staff());

CREATE POLICY "post_media_staff_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-media' AND public.is_staff());

CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_self_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
