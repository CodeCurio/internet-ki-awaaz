# MASTER ARCHITECTURAL & IMPLEMENTATION SPECIFICATION
## Internet Ki Awaaz (इंटरनेट की आवाज़) — Hyper-Local Digital News Portal & CMS

**Document Type:** AI Code-Generation Master Prompt / Engineering Blueprint
**Intended Consumers:** Antigravity, Cursor, Windsurf, Claude Code, and equivalent AI-driven code generation environments
**Version:** 1.0
**Classification:** Full-Stack Production Specification (Zero Placeholder Policy)

---

## 0. EXECUTIVE CONTEXT & OPERATING INSTRUCTIONS FOR THE AI CODE-GENERATION AGENT

You are acting as a **Principal Enterprise Software Architect**, **Lead Full-Stack Engineer**, **Database Specialist**, and **Senior DevSecOps Engineer** jointly responsible for delivering a production-grade, hyper-local digital news web portal and Content Management System (CMS) for the Indian regional media enterprise **Internet Ki Awaaz**.

This document is the single source of truth. Every section below is normative: SQL must be executed exactly as written (or intentionally extended, never truncated), every TypeScript interface must compile, and every React component must render without missing imports. Do not emit `// TODO`, `/* rest of code here */`, ellipses in code blocks, or any other elision. If a file is long, write it in full.

### 0.1 Institutional Background

| Attribute | Detail |
|---|---|
| Brand Name (EN) | Internet Ki Awaaz |
| Brand Name (HI) | इंटरनेट की आवाज़ |
| Tagline (EN) | A digital platform for news, knowledge, and public voice |
| Tagline (HI) | ख़बर, ज्ञान और जन-सरोकार का डिजिटल मंच |
| HQ / Operational Desk | Forvishganj, Pant Nagar, Forvish Ganj Chowk, Gonda – 271001, Uttar Pradesh, India |
| Core Geographic Focus | Gonda District, Kaiserganj Lok Sabha Constituency, Devipatan Division (Balrampur, Shravasti, Bahraich), wider Purvanchal region |
| YouTube Channel | @InternetKiAwaaz — 12.3K+ subscribers, 650+ investigative videos |
| Other Channels | Facebook, X (Twitter), Instagram |
| Local Directory Presence | Justdial, rated 5.0/5.0 |

### 0.2 Core Technology Mandate

- **Frontend:** Next.js 14+ (App Router, React Server Components, Server Actions), Tailwind CSS, Lucide React icon set, Shadcn/UI primitives.
- **Typography:** Bilingual native Devanagari UTF-8 (Noto Sans Devanagari, Mukta) paired with Inter for Latin numerals and UI chrome.
- **Backend & Data Layer:** Supabase — PostgreSQL 15+, Supabase Auth, Row-Level Security (RLS), Storage Buckets, Realtime channels, Edge Functions.
- **Rich Text Editor:** TipTap (ProseMirror-based) configured for Devanagari Unicode input, inline media embeds, pull-quote styles.
- **Video Layer:** YouTube Data API v3 synchronization jobs + responsive custom video player component.
- **Search & Indexing:** PostgreSQL full-text search (`tsvector`/`tsquery`) with `pg_trgm` trigram fuzzy matching + `websearch_to_tsquery`, automated Google News XML sitemap generation.

### 0.3 Non-Negotiable Engineering Principles

1. **RLS-first security** — every table that stores tenant or user-generated data must default-deny; policies are additive grants, never implicit.
2. **Bilingual-by-default** — every user-facing string field that holds editorial content must be modeled to carry Devanagari text natively (UTF-8, no transliteration layer).
3. **Mobile-first performance** — Tier-2/3 India network conditions (variable 4G, occasional 3G fallback) drive a hard budget: **initial article page payload < 1.5 MB**, LCP < 2.5s on Moto G4-class devices over a simulated 4G connection.
4. **SEO-as-infrastructure** — schema.org structured data, sitemaps, and canonical URL handling are treated as first-class backend concerns, not an afterthought bolted onto the frontend.
5. **Auditability** — every mutating admin action must be traceable through the `audit_logs` table.

---

## 1. COMPLETE SUPABASE POSTGRESQL DATABASE DDL & DATA ENGINEERING

### 1.1 Extensions

```sql
-- Enable required PostgreSQL extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";
```

### 1.2 Custom Enum Types

```sql
-- Role-based access control tiers
create type user_role as enum (
  'super_admin',
  'editor',
  'reporter',
  'contributor'
);

-- Editorial workflow states
create type post_status as enum (
  'draft',
  'in_review',
  'scheduled',
  'published',
  'archived',
  'retracted'
);

-- Content presentation format
create type post_format as enum (
  'standard_article',
  'video_report',
  'photo_gallery',
  'live_blog',
  'opinion_editorial',
  'press_release'
);

-- Advertisement placement zones
create type ad_placement as enum (
  'homepage_leaderboard',
  'homepage_sidebar',
  'article_inline',
  'article_sidebar',
  'category_header',
  'sticky_footer_mobile'
);

-- Business directory subscription tiers
create type directory_tier as enum (
  'free_listing',
  'verified',
  'featured',
  'premium_sponsor'
);

-- Breaking news severity/priority
create type breaking_priority as enum (
  'low',
  'medium',
  'high',
  'critical'
);
```

### 1.3 Table: `profiles`

Extends `auth.users` (Supabase's built-in auth table) with editorial metadata.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  full_name_hi text,
  username text unique not null,
  avatar_url text,
  bio text,
  bio_hi text,
  role user_role not null default 'contributor',
  designation text,
  designation_hi text,
  phone_number text,
  whatsapp_number text,
  twitter_handle text,
  is_active boolean not null default true,
  reporter_beat text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extends auth.users with editorial staff metadata and RBAC role assignment.';
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_username on public.profiles(username);
```

### 1.4 Table: `categories`

```sql
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name_en text not null,
  name_hi text not null,
  slug text unique not null,
  description_hi text,
  icon_name text,
  parent_id uuid references public.categories(id) on delete set null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  seo_title_hi text,
  seo_description_hi text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categories_slug on public.categories(slug);
create index idx_categories_parent on public.categories(parent_id);
```

### 1.5 Table: `tags`

```sql
create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  name_hi text not null,
  name_en text,
  slug text unique not null,
  usage_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_tags_slug on public.tags(slug);
create index idx_tags_usage on public.tags(usage_count desc);
```

### 1.6 Table: `posts`

```sql
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  title_hi text not null,
  title_en text,
  subtitle_hi text,
  slug text unique not null,
  excerpt_hi text,
  body_hi jsonb not null default '{}'::jsonb,
  body_html_cache text,
  format post_format not null default 'standard_article',
  status post_status not null default 'draft',
  category_id uuid not null references public.categories(id) on delete restrict,
  author_id uuid not null references public.profiles(id) on delete restrict,
  editor_id uuid references public.profiles(id) on delete set null,
  featured_image_url text,
  featured_image_alt_hi text,
  gallery_image_urls text[] default array[]::text[],
  youtube_video_id text,
  youtube_thumbnail_url text,
  youtube_duration_seconds integer,
  is_breaking boolean not null default false,
  is_featured boolean not null default false,
  is_video_first boolean not null default false,
  view_count bigint not null default 0,
  reading_time_minutes integer,
  seo_title_hi text,
  seo_description_hi text,
  canonical_url text,
  json_ld_type text default 'NewsArticle',
  search_vector tsvector,
  published_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_posts_slug on public.posts(slug);
create index idx_posts_status on public.posts(status);
create index idx_posts_category on public.posts(category_id);
create index idx_posts_author on public.posts(author_id);
create index idx_posts_published_at on public.posts(published_at desc);
create index idx_posts_is_breaking on public.posts(is_breaking) where is_breaking = true;
create index idx_posts_search_vector on public.posts using gin(search_vector);
create index idx_posts_title_trgm on public.posts using gin(title_hi gin_trgm_ops);
```

### 1.7 Table: `post_tags` (Join Table)

```sql
create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create index idx_post_tags_tag on public.post_tags(tag_id);
```

### 1.8 Table: `breaking_news`

```sql
create table public.breaking_news (
  id uuid primary key default uuid_generate_v4(),
  headline_hi text not null,
  linked_post_id uuid references public.posts(id) on delete cascade,
  priority breaking_priority not null default 'medium',
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete restrict,
  expires_at timestamptz not null default (now() + interval '6 hours'),
  created_at timestamptz not null default now()
);

create index idx_breaking_active on public.breaking_news(is_active, expires_at);
```

### 1.9 Table: `directory_listings`

```sql
create table public.directory_listings (
  id uuid primary key default uuid_generate_v4(),
  business_name_hi text not null,
  business_name_en text,
  slug text unique not null,
  category_hi text not null,
  description_hi text,
  address_hi text,
  locality text,
  phone_number text,
  whatsapp_number text,
  cover_image_url text,
  logo_url text,
  tier directory_tier not null default 'free_listing',
  is_verified boolean not null default false,
  rating numeric(2,1) default 0.0,
  submitted_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  is_approved boolean not null default false,
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_directory_slug on public.directory_listings(slug);
create index idx_directory_tier on public.directory_listings(tier);
create index idx_directory_locality on public.directory_listings(locality);
```

### 1.10 Table: `advertisements`

```sql
create table public.advertisements (
  id uuid primary key default uuid_generate_v4(),
  campaign_name text not null,
  advertiser_name text not null,
  placement ad_placement not null,
  creative_image_url text not null,
  target_url text not null,
  alt_text_hi text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  is_active boolean not null default true,
  impression_count bigint not null default 0,
  click_count bigint not null default 0,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index idx_ads_placement on public.advertisements(placement, is_active);
create index idx_ads_dates on public.advertisements(start_date, end_date);
```

### 1.11 Table: `audit_logs`

```sql
create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_audit_actor on public.audit_logs(actor_id);
create index idx_audit_entity on public.audit_logs(entity_type, entity_id);
create index idx_audit_created on public.audit_logs(created_at desc);
```

### 1.12 Row-Level Security: Enablement

```sql
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.breaking_news enable row level security;
alter table public.directory_listings enable row level security;
alter table public.advertisements enable row level security;
alter table public.audit_logs enable row level security;
```

### 1.13 Helper Function: Current User Role

```sql
create or replace function public.current_user_role()
returns user_role
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin', 'editor', 'reporter', 'contributor')
      and is_active = true
  );
$$;
```

### 1.14 RLS Policies: `profiles`

```sql
-- Public can view minimal profile info (bylines)
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Users can update their own profile (except role)
create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Only super_admin can insert new staff profiles directly (normally via trigger on signup)
create policy "profiles_admin_insert"
  on public.profiles for insert
  with check (public.current_user_role() = 'super_admin');

-- Only super_admin can change roles / deactivate users
create policy "profiles_admin_update_all"
  on public.profiles for update
  using (public.current_user_role() = 'super_admin')
  with check (true);

-- Only super_admin can delete profiles
create policy "profiles_admin_delete"
  on public.profiles for delete
  using (public.current_user_role() = 'super_admin');
```

### 1.15 RLS Policies: `categories`

```sql
create policy "categories_public_read"
  on public.categories for select
  using (is_active = true);

create policy "categories_staff_read_all"
  on public.categories for select
  using (public.is_staff());

create policy "categories_editor_write"
  on public.categories for insert
  with check (public.current_user_role() in ('super_admin', 'editor'));

create policy "categories_editor_update"
  on public.categories for update
  using (public.current_user_role() in ('super_admin', 'editor'));

create policy "categories_admin_delete"
  on public.categories for delete
  using (public.current_user_role() = 'super_admin');
```

### 1.16 RLS Policies: `tags`

```sql
create policy "tags_public_read"
  on public.tags for select
  using (true);

create policy "tags_staff_write"
  on public.tags for insert
  with check (public.is_staff());

create policy "tags_staff_update"
  on public.tags for update
  using (public.is_staff());

create policy "tags_editor_delete"
  on public.tags for delete
  using (public.current_user_role() in ('super_admin', 'editor'));
```

### 1.17 RLS Policies: `posts`

```sql
-- Public can only read published posts
create policy "posts_public_read_published"
  on public.posts for select
  using (status = 'published' and published_at <= now());

-- Staff can read everything (needed for drafts, review queue)
create policy "posts_staff_read_all"
  on public.posts for select
  using (public.is_staff());

-- Reporters & contributors can create drafts they author
create policy "posts_author_insert"
  on public.posts for insert
  with check (
    public.is_staff()
    and author_id = auth.uid()
    and (
      public.current_user_role() in ('reporter', 'contributor')
      and status in ('draft', 'in_review')
      or public.current_user_role() in ('editor', 'super_admin')
    )
  );

-- Authors can update their own drafts / in_review posts; editors+ can update any post
create policy "posts_author_update_own_draft"
  on public.posts for update
  using (
    author_id = auth.uid()
    and status in ('draft', 'in_review')
  )
  with check (
    author_id = auth.uid()
    and status in ('draft', 'in_review')
  );

create policy "posts_editor_update_all"
  on public.posts for update
  using (public.current_user_role() in ('editor', 'super_admin'))
  with check (public.current_user_role() in ('editor', 'super_admin'));

-- Only editor+ can delete
create policy "posts_editor_delete"
  on public.posts for delete
  using (public.current_user_role() in ('editor', 'super_admin'));
```

### 1.18 RLS Policies: `post_tags`

```sql
create policy "post_tags_public_read"
  on public.post_tags for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.status = 'published'
    )
    or public.is_staff()
  );

create policy "post_tags_staff_write"
  on public.post_tags for insert
  with check (public.is_staff());

create policy "post_tags_staff_delete"
  on public.post_tags for delete
  using (public.is_staff());
```

### 1.19 RLS Policies: `breaking_news`

```sql
create policy "breaking_public_read"
  on public.breaking_news for select
  using (is_active = true and expires_at > now());

create policy "breaking_staff_read_all"
  on public.breaking_news for select
  using (public.is_staff());

create policy "breaking_editor_write"
  on public.breaking_news for insert
  with check (public.current_user_role() in ('editor', 'super_admin'));

create policy "breaking_editor_update"
  on public.breaking_news for update
  using (public.current_user_role() in ('editor', 'super_admin'));

create policy "breaking_editor_delete"
  on public.breaking_news for delete
  using (public.current_user_role() in ('editor', 'super_admin'));
```

### 1.20 RLS Policies: `directory_listings`

```sql
create policy "directory_public_read_approved"
  on public.directory_listings for select
  using (is_approved = true);

create policy "directory_staff_read_all"
  on public.directory_listings for select
  using (public.is_staff());

-- Anyone authenticated can submit a listing for review
create policy "directory_authenticated_submit"
  on public.directory_listings for insert
  with check (auth.uid() is not null and submitted_by = auth.uid() and is_approved = false);

create policy "directory_editor_update"
  on public.directory_listings for update
  using (public.current_user_role() in ('editor', 'super_admin'));

create policy "directory_editor_delete"
  on public.directory_listings for delete
  using (public.current_user_role() in ('editor', 'super_admin'));
```

### 1.21 RLS Policies: `advertisements`

```sql
create policy "ads_public_read_active"
  on public.advertisements for select
  using (is_active = true and now() between start_date and end_date);

create policy "ads_staff_read_all"
  on public.advertisements for select
  using (public.is_staff());

create policy "ads_admin_write"
  on public.advertisements for insert
  with check (public.current_user_role() in ('super_admin', 'editor'));

create policy "ads_admin_update"
  on public.advertisements for update
  using (public.current_user_role() in ('super_admin', 'editor'));

create policy "ads_admin_delete"
  on public.advertisements for delete
  using (public.current_user_role() = 'super_admin');
```

### 1.22 RLS Policies: `audit_logs`

```sql
-- Only super_admin can read the audit trail
create policy "audit_admin_read"
  on public.audit_logs for select
  using (public.current_user_role() = 'super_admin');

-- Inserts happen only via SECURITY DEFINER trigger functions, never direct client writes
create policy "audit_no_direct_insert"
  on public.audit_logs for insert
  with check (false);
```

### 1.23 Trigger Functions: `updated_at` Maintenance

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create trigger trg_directory_updated_at
  before update on public.directory_listings
  for each row execute function public.set_updated_at();
```

### 1.24 Trigger Function: Automated Slug Generation

```sql
create or replace function public.generate_slug(input_text text)
returns text
language plpgsql
immutable
as $$
declare
  base_slug text;
begin
  base_slug := lower(regexp_replace(unaccent(input_text), '[^a-zA-Z0-9\u0900-\u097F]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  return base_slug;
end;
$$;

create or replace function public.posts_auto_slug()
returns trigger
language plpgsql
as $$
declare
  candidate text;
  counter integer := 0;
  final_slug text;
begin
  if new.slug is null or new.slug = '' then
    candidate := public.generate_slug(coalesce(new.title_en, new.title_hi));
    final_slug := candidate || '-' || to_char(now(), 'YYYYMMDD');
    while exists (select 1 from public.posts where slug = final_slug and id <> new.id) loop
      counter := counter + 1;
      final_slug := candidate || '-' || to_char(now(), 'YYYYMMDD') || '-' || counter;
    end loop;
    new.slug := final_slug;
  end if;
  return new;
end;
$$;

create trigger trg_posts_auto_slug
  before insert on public.posts
  for each row execute function public.posts_auto_slug();
```

### 1.25 Trigger Function: Full-Text Search Vector Maintenance

```sql
create or replace function public.posts_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.title_hi, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.subtitle_hi, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.excerpt_hi, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(new.body_html_cache, '')), 'D');
  return new;
end;
$$;

create trigger trg_posts_search_vector
  before insert or update on public.posts
  for each row execute function public.posts_search_vector_update();
```

> **Note on Hindi full-text search:** PostgreSQL ships no native Hindi/Devanagari text search configuration. Using the `simple` configuration (no stemming, no stopword removal) combined with the `pg_trgm` trigram index on `title_hi` gives reliable substring and fuzzy matching for Devanagari content, which in practice outperforms attempting to force an English-oriented stemmer onto Devanagari tokens.

### 1.26 Trigger Function: Post View Counter Increment (Atomic RPC)

```sql
create or replace function public.increment_post_view(post_uuid uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.posts
  set view_count = view_count + 1
  where id = post_uuid and status = 'published';
end;
$$;

grant execute on function public.increment_post_view(uuid) to anon, authenticated;
```

### 1.27 Trigger Function: Tag Usage Counter

```sql
create or replace function public.sync_tag_usage_count()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    update public.tags set usage_count = usage_count + 1 where id = new.tag_id;
  elsif (tg_op = 'DELETE') then
    update public.tags set usage_count = greatest(usage_count - 1, 0) where id = old.tag_id;
  end if;
  return null;
end;
$$;

create trigger trg_post_tags_usage
  after insert or delete on public.post_tags
  for each row execute function public.sync_tag_usage_count();
```

### 1.28 Trigger Function: Audit Log Writer

```sql
create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, old_values, new_values)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('UPDATE', 'INSERT') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

create trigger trg_audit_posts
  after insert or update or delete on public.posts
  for each row execute function public.write_audit_log();

create trigger trg_audit_directory
  after insert or update or delete on public.directory_listings
  for each row execute function public.write_audit_log();

create trigger trg_audit_advertisements
  after insert or update or delete on public.advertisements
  for each row execute function public.write_audit_log();

create trigger trg_audit_profiles
  after update or delete on public.profiles
  for each row execute function public.write_audit_log();
```

### 1.29 Trigger Function: Auto-Create Profile on Signup

```sql
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)),
    'contributor'
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
```

### 1.30 Storage Buckets & Policies

```sql
insert into storage.buckets (id, name, public)
values
  ('post-media', 'post-media', true),
  ('avatars', 'avatars', true),
  ('directory-media', 'directory-media', true),
  ('ad-creatives', 'ad-creatives', true)
on conflict (id) do nothing;

create policy "post_media_public_read"
  on storage.objects for select
  using (bucket_id = 'post-media');

create policy "post_media_staff_upload"
  on storage.objects for insert
  with check (bucket_id = 'post-media' and public.is_staff());

create policy "post_media_staff_delete"
  on storage.objects for delete
  using (bucket_id = 'post-media' and public.is_staff());

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_self_upload"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid() is not null);
```

### 1.31 Seed Data Script

```sql
-- Default editorial desks (categories)
insert into public.categories (name_en, name_hi, slug, display_order, icon_name) values
  ('Politics', 'सियासत', 'siyasat', 1, 'landmark'),
  ('Gonda Region', 'गोंडा आंचल', 'gonda-aanchal', 2, 'map-pin'),
  ('History & Heritage', 'इतिहास व विरासत', 'itihas-virasat', 3, 'scroll'),
  ('Public Voice / Inspiration', 'जन-आवाज़ / प्रेरणा', 'jan-awaaz', 4, 'megaphone'),
  ('Literature & Stage', 'साहित्य एवं मंच', 'sahitya-manch', 5, 'book-open'),
  ('Video Desk', 'वीडियो डेस्क', 'video-desk', 6, 'play-circle'),
  ('Gonda Directory', 'गोंडा डायरेक्टरी', 'gonda-directory', 7, 'building-2')
on conflict (slug) do nothing;

-- Administrative seed record (password must be set via Supabase Auth invite flow, not here)
-- The auth.users row is created through supabase.auth.admin.createUser() in a secure
-- server-side seeding script; the profile is then patched to super_admin:
--
-- update public.profiles set role = 'super_admin', full_name = 'Editorial Desk Admin'
-- where username = 'ika_admin';
```

---

## 2. FULL-STACK APPLICATION ARCHITECTURE & DIRECTORY TREE

### 2.1 Complete Next.js App Router Directory Structure

```
internet-ki-awaaz/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                          # Homepage
│   │   │   ├── news/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx                  # Dynamic article reader
│   │   │   │       └── opengraph-image.tsx
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx                  # Category desk listing
│   │   │   ├── tag/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   ├── directory/
│   │   │   │   ├── page.tsx                      # District directory listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx                  # Individual business listing
│   │   │   ├── video-desk/
│   │   │   │   └── page.tsx
│   │   │   ├── author/
│   │   │   │   └── [username]/
│   │   │   │       └── page.tsx
│   │   │   └── static/
│   │   │       ├── about/page.tsx
│   │   │       ├── contact/page.tsx
│   │   │       ├── rni-declaration/page.tsx
│   │   │       ├── grievance-redressal/page.tsx
│   │   │       ├── privacy-policy/page.tsx
│   │   │       └── terms-of-service/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx                        # Auth-gated admin shell
│   │   │   └── admin/
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── posts/
│   │   │       │   ├── page.tsx                  # Posts list / queue
│   │   │       │   ├── create/page.tsx
│   │   │       │   └── [id]/edit/page.tsx
│   │   │       ├── categories/page.tsx
│   │   │       ├── tags/page.tsx
│   │   │       ├── users/
│   │   │       │   ├── page.tsx
│   │   │       │   └── invite/page.tsx
│   │   │       ├── breaking-news/page.tsx
│   │   │       ├── directory/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/review/page.tsx
│   │   │       ├── advertisements/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/analytics/page.tsx
│   │   │       ├── seo-settings/page.tsx
│   │   │       └── audit-logs/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── api/
│   │   │   ├── youtube/
│   │   │   │   └── sync/route.ts                 # YouTube Data API v3 sync job
│   │   │   ├── upload/
│   │   │   │   └── route.ts                      # Supabase Storage upload proxy
│   │   │   ├── sitemap.xml/route.ts
│   │   │   ├── sitemap-news.xml/route.ts
│   │   │   └── revalidate/route.ts               # On-demand ISR revalidation webhook
│   │   ├── layout.tsx                            # Root layout (fonts, providers)
│   │   ├── globals.css
│   │   ├── manifest.ts                           # PWA manifest generator
│   │   ├── robots.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── public/
│   │   │   ├── layout/
│   │   │   │   ├── TopUtilityBar.tsx
│   │   │   │   ├── Masthead.tsx
│   │   │   │   ├── StickyNav.tsx
│   │   │   │   ├── BreakingNewsTicker.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroNewsGrid.tsx
│   │   │   │   ├── CategoryDeskBlock.tsx
│   │   │   │   ├── VideoDeskCarousel.tsx
│   │   │   │   └── DirectorySpotlight.tsx
│   │   │   ├── article/
│   │   │   │   ├── ArticleHeader.tsx
│   │   │   │   ├── ArticleBody.tsx
│   │   │   │   ├── AuthorBylineCard.tsx
│   │   │   │   ├── SocialShareBar.tsx
│   │   │   │   ├── RelatedArticles.tsx
│   │   │   │   └── VideoEmbed.tsx
│   │   │   └── directory/
│   │   │       ├── DirectoryCard.tsx
│   │   │       └── DirectoryFilterBar.tsx
│   │   ├── admin/
│   │   │   ├── layout/
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   └── AdminTopbar.tsx
│   │   │   ├── editor/
│   │   │   │   ├── ArticleStudio.tsx
│   │   │   │   ├── TipTapEditor.tsx
│   │   │   │   ├── SeoSidebar.tsx
│   │   │   │   ├── SerpPreview.tsx
│   │   │   │   └── YoutubeMetaFetcher.tsx
│   │   │   ├── users/
│   │   │   │   └── RoleMatrixTable.tsx
│   │   │   ├── breaking-news/
│   │   │   │   └── BreakingNewsForm.tsx
│   │   │   └── analytics/
│   │   │       └── AdPerformanceChart.tsx
│   │   └── ui/                                   # Shadcn/UI primitives (button, card, dialog, etc.)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── youtube/
│   │   │   └── youtube-client.ts
│   │   ├── seo/
│   │   │   ├── json-ld.ts
│   │   │   └── metadata-builder.ts
│   │   ├── actions/
│   │   │   ├── posts.actions.ts
│   │   │   ├── categories.actions.ts
│   │   │   ├── directory.actions.ts
│   │   │   └── breaking-news.actions.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── database.types.ts
│   │   └── domain.types.ts
│   ├── hooks/
│   │   ├── useRealtimeBreakingNews.ts
│   │   └── useDebounce.ts
│   └── middleware.ts
├── public/
│   ├── icons/
│   └── fonts/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tailwind.config.ts
├── next.config.mjs
├── package.json
└── tsconfig.json
```

### 2.2 Route Inventory Summary

| Route | Access | Rendering Strategy |
|---|---|---|
| `/` | Public | ISR (revalidate 60s) |
| `/news/[slug]` | Public | ISR (revalidate 120s) + on-demand revalidation |
| `/category/[slug]` | Public | ISR (revalidate 300s) |
| `/directory` | Public | ISR (revalidate 600s) |
| `/directory/[slug]` | Public | ISR (revalidate 600s) |
| `/search` | Public | Dynamic (SSR, no cache) |
| `/admin/*` | Staff (RBAC-gated) | Dynamic (SSR, `force-dynamic`) |
| `/api/youtube/sync` | Server-only (cron/edge) | Route Handler, POST |
| `/api/upload` | Authenticated staff | Route Handler, POST |
| `/sitemap.xml`, `/sitemap-news.xml` | Public, crawler-facing | Route Handler, cached 15 min |

### 2.3 Middleware & Route Protection Flow

`src/middleware.ts` intercepts every request under `/admin/*`, refreshes the Supabase session cookie, and redirects unauthenticated or under-privileged users to `/login`. Role checks for specific admin sub-routes (e.g., only `super_admin` may reach `/admin/users`) are enforced twice: once at the middleware layer for UX redirect speed, and again inside the Server Component / Server Action via RLS, which is the actual security boundary. Middleware is a UX convenience, never the sole security control.

---

## 3. ADMINISTRATIVE WORKSPACE & CMS ENGINE SPECIFICATIONS

### 3.1 Master Article Studio (`/admin/posts/create`, `/admin/posts/[id]/edit`)

**Layout:** A split two-column canvas.

- **Left column (≈68% width):** The Devanagari-optimized TipTap rich-text editor surface, with a sticky sub-toolbar (bold, italic, H2/H3, blockquote/pull-quote, ordered/unordered list, image embed, YouTube embed, horizontal rule, link).
- **Right column (≈32% width, scrollable independent of editor):** Metadata sidebar organized into collapsible panels:
  1. **Publish Panel** — status dropdown (`draft` / `in_review` / `scheduled` / `published`), scheduled datetime picker, "Save Draft" / "Submit for Review" / "Publish Now" action buttons (buttons rendered conditionally based on the signed-in user's `user_role`).
  2. **Classification Panel** — category select (single, required), tag multi-select with create-on-the-fly capability, `is_featured` and `is_breaking` toggles (breaking toggle only visible to `editor`/`super_admin`).
  3. **Media Panel** — featured image upload (drag-and-drop to Supabase Storage `post-media` bucket), alt-text field (Hindi, required for accessibility + SEO), gallery uploader for `photo_gallery` format posts.
  4. **Video-First Panel** — a toggle switch labeled "यह एक वीडियो रिपोर्ट है" (This is a video report). When enabled: (a) format is forced to `video_report`, (b) a YouTube URL/ID input appears, (c) the `YoutubeMetaFetcher` component fires an API call on blur to pull title, thumbnail, and duration via the YouTube Data API v3, auto-populating `youtube_thumbnail_url` and `youtube_duration_seconds`.
  5. **SEO & Social Panel** (`SeoSidebar.tsx`) — see 3.2 below.

### 3.2 SEO & Social Card Configuration Panel

- **Live SERP Preview (`SerpPreview.tsx`):** Renders two side-by-side mock cards — a desktop Google result mock (blue title link, green URL breadcrumb, gray description) and a mobile card mock (narrower width, truncated at ~65 chars for title / ~120 chars for description) — both driven live off `seo_title_hi` and `seo_description_hi` form state via `onChange`, with no debounce needed since it's pure client-state re-render.
- **Character length indicators:** A small colored counter beneath each SEO field — green under 60 chars (title) / 155 chars (description), amber approaching the limit, red over limit — computed with `Array.from(string).length` rather than `string.length` to correctly count Devanagari combining characters (conjuncts/matras) as their true glyph count rather than raw UTF-16 code unit count.
- **Canonical URL override:** Optional text input; defaults to `https://internetkiawaaz.in/news/{slug}` if left blank. Used to prevent duplicate-content penalties when a story is later re-published under a different slug or syndicated.
- **JSON-LD schema type selector:** Dropdown constrained to `NewsArticle`, `VideoObject` (auto-selected and locked when Video-First is toggled on), `LiveBlogPosting` (for `live_blog` format posts, unlocking an "Add Update" sub-editor for timestamped live entries).

### 3.3 User Management & RBAC Security

**Role-Permission Matrix** (rendered as a read-only reference table in `/admin/users`, and enforced identically in RLS):

| Capability | `contributor` | `reporter` | `editor` | `super_admin` |
|---|---|---|---|---|
| Create draft posts | ✅ (own only) | ✅ (own only) | ✅ | ✅ |
| Submit post for review | ✅ | ✅ | ✅ | ✅ |
| Publish posts | ❌ | ❌ | ✅ | ✅ |
| Edit others' posts | ❌ | ❌ | ✅ | ✅ |
| Delete posts | ❌ | ❌ | ✅ | ✅ |
| Manage categories/tags | ❌ | ❌ | ✅ | ✅ |
| Post breaking news | ❌ | ❌ | ✅ | ✅ |
| Approve directory listings | ❌ | ❌ | ✅ | ✅ |
| Manage advertisements | ❌ | ❌ | ✅ | ✅ |
| Invite / deactivate users | ❌ | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ✅ |

**Invite Flow (`/admin/users/invite`):** `super_admin` enters an email + assigns an initial role → Server Action calls `supabase.auth.admin.inviteUserByEmail()` (using the service-role key, executed only in a server-only module never bundled to the client) → on acceptance, the `handle_new_auth_user` trigger creates the `profiles` row with default `contributor` role → a follow-up Server Action immediately patches the role to the intended assignment and writes an `audit_logs` entry.

### 3.4 Breaking News Engine (`/admin/breaking-news`)

- Editors compose a short headline (`headline_hi`), optionally linking to a full `posts` row, and assign a `breaking_priority` (`low` → `critical`).
- `expires_at` defaults to `now() + 6 hours` but is editable; a background Supabase Edge Function (`cron: */15 * * * *`) sweeps and flips `is_active = false` on any expired rows so the public ticker never shows stale flashes even if the client-side filter is bypassed.
- The public `BreakingNewsTicker.tsx` component subscribes to a Supabase Realtime channel on the `breaking_news` table (`postgres_changes` on `INSERT`/`UPDATE` filtered to `is_active = true`), so a newly published critical alert appears on every open browser tab within roughly a second, without a page refresh.
- Priority scoring drives visual treatment: `critical` renders with a pulsing red badge and forces the ticker to pause auto-scroll on that item for an extra 3 seconds; `low`/`medium` scroll at the standard ticker cadence.

### 3.5 Monetization & Directory Management

**Commercial Business Directory CRUD (`/admin/directory`):**
- Submissions (public-facing form, `is_approved = false` by default per RLS in section 1.20) land in a review queue at `/admin/directory` filtered to `is_approved = false`.
- Editors approve/reject with an optional rejection-reason note (stored transiently in a toast/notification, not persisted to schema, since the row is simply deleted or left unapproved).
- **Verification badges:** the `is_verified` boolean is distinct from `is_approved` — approval means "visible on the public site," verification means "Internet Ki Awaaz has confirmed this is a legitimate, currently operating business," rendered as a small checkmark badge next to the business name.
- **WhatsApp lead integration:** `DirectoryCard.tsx` renders a "व्हाट्सएप पर संपर्क करें" (Contact on WhatsApp) button that deep-links to `https://wa.me/{whatsapp_number}?text={url-encoded prefilled inquiry message}` — no backend lead-capture table is required for v1; this is a pure client-side deep link, keeping the funnel frictionless for Tier-2/3 mobile users.

**Banner Ad Scheduling (`/admin/advertisements`):**
- Campaign form captures `placement` (constrained to the `ad_placement` enum so the frontend always knows exactly which slot to render into), `start_date`/`end_date`, and the creative upload (uploaded to the `ad-creatives` bucket).
- **Impression/click tracking:** every ad-slot component fires a lightweight `POST` to a Supabase Edge Function on mount (impression) and on click (click-through), which executes an atomic `increment` RPC (mirroring the `increment_post_view` pattern in section 1.26) against `impression_count`/`click_count` to avoid read-modify-write races under concurrent traffic.
- `/admin/advertisements/[id]/analytics` renders a simple CTR chart (`AdPerformanceChart.tsx`) computed client-side as `click_count / impression_count`.

---

## 4. PUBLIC WEB PORTAL & UI/UX DESIGN SYSTEM

### 4.1 Top Utility Bar (`TopUtilityBar.tsx`)

A slim, dark-background (`bg-slate-900`) strip above the masthead, hidden on scroll-down and reappearing on scroll-up (sticky-collapse pattern) to conserve vertical space on mobile:
- **Left:** Live IST clock rendered in Hindi numerals and Hindi day/date format (e.g., "शनिवार, ३० अगस्त २०२६ | अपराह्न ३:४५"), updated client-side via `setInterval` every 30 seconds — never server-rendered as a static timestamp, since that would immediately go stale and hurt perceived freshness.
- **Center (desktop only, hidden below `md` breakpoint):** Current Gonda weather chip (temperature + condition icon), sourced from a lightweight cached weather API call revalidated every 30 minutes server-side, not fetched per-request.
- **Right:** Social icon cluster (YouTube, Facebook, X, Instagram) linking to the brand's live channels, using `lucide-react` icons wrapped in accessible `<a aria-label>` tags.

### 4.2 Masthead & Sticky Devanagari Navigation Bar (`Masthead.tsx`, `StickyNav.tsx`)

- **Masthead:** Centered wordmark "इंटरनेट की आवाज़" set in a bold Noto Sans Devanagari display weight, with the Latin tagline in Inter beneath it at reduced size/opacity, mimicking the visual hierarchy of established Hindi print mastheads (e.g., large centered nameplate, thin rule below).
- **Sticky Nav:** Category links (सियासत, गोंडा आंचल, इतिहास व विरासत, जन-आवाज़, साहित्य एवं मंच, वीडियो डेस्क, गोंडा डायरेक्टरी) rendered horizontally on desktop; collapses into a slide-out drawer (hamburger trigger) on mobile. Becomes `position: sticky; top: 0` once the utility bar scrolls out of view, with a subtle shadow (`shadow-sm`) appearing only once `window.scrollY > 0` to avoid a harsh line against the hero on first paint.

### 4.3 Realtime Breaking News Ticker (`BreakingNewsTicker.tsx`)

- Full-width red (`bg-red-700`) strip directly beneath the sticky nav, with a static "ब्रेकिंग" (BREAKING) badge on the left and a horizontally auto-scrolling (CSS `@keyframes` marquee, pausable on hover/touch) list of active headlines on the right, each a link to its `linked_post_id` article.
- Subscribes to Supabase Realtime as described in section 3.4; new critical items are prepended and briefly highlighted with a flash animation (`animate-pulse` for 2 seconds, then settling into the standard scroll).
- Entire ticker is omitted from the DOM (not just hidden) when there are zero active rows, to avoid shipping an empty marquee shell.

### 4.4 Three-Tier Hero News Grid & Specialized Desks

**Hero Grid (`HeroNewsGrid.tsx`):**
- **Tier 1 (top, full-bleed):** One large lead story card — big image, `title_hi`, `excerpt_hi`, author + relative timestamp.
- **Tier 2 (middle row, 3 columns on desktop / stacked on mobile):** Three secondary stories, medium-sized image thumbnails.
- **Tier 3 (bottom, dense list):** Five to eight smaller text-forward headline-only rows, optimized for scanning.

**Specialized Desk Blocks (`CategoryDeskBlock.tsx`, reused per desk):**
- **सियासत के सिरमौर (Siyasat Ke Sirmaur / "Titans of Politics"):** A horizontally-scrollable card rail pulling the latest 6 posts from the `siyasat` category, each card showing a small circular tag/avatar denoting the political figure or party discussed where applicable.
- **गोंडा का असली इतिहास (Real History of Gonda):** A visually distinct sepia-toned card treatment (custom Tailwind utility class `bg-amber-50 border-amber-200`) pulling from `itihas-virasat`, evoking an archival feel appropriate to heritage content.
- **जन-आवाज़ (Jan Awaaz):** Pulls from the `jan-awaaz` category, styled with a quote-mark accent icon, since this desk skews toward opinion/human-interest pieces.

### 4.5 High-Performance Reading Template (`/news/[slug]`)

Component composition, top to bottom:
1. **Breadcrumbs** — `होम / [श्रेणी नाम] / [शीर्षक संक्षिप्त]`, marked up with `BreadcrumbList` JSON-LD (see section 5).
2. **`ArticleHeader.tsx`** — Devanagari headline (large, `text-3xl md:text-5xl`, `font-bold`, tight `leading-tight` tuned for Devanagari's taller x-height and matra stacking), subtitle in a muted lighter weight, and a metadata row (author, published date in Hindi format, estimated reading time "X मिनट में पढ़ें").
3. **`AuthorBylineCard.tsx`** — small avatar + reporter name + beat, linking to `/author/[username]`.
4. **`SocialShareBar.tsx`** — sticky-on-scroll (desktop: left rail; mobile: bottom fixed bar) icon row for WhatsApp (`https://wa.me/?text=`), Facebook, and X share intents, plus a "लिंक कॉपी करें" (copy link) button with a toast confirmation.
5. **Featured media** — either the featured image (with `alt_text_hi`) or, for `video_report` format, an embedded `VideoEmbed.tsx` responsive 16:9 YouTube player using `next/dynamic` to lazy-load the iframe only on user interaction (facade/click-to-play pattern) to protect the mobile payload budget.
6. **`ArticleBody.tsx`** — renders the TipTap JSON `body_hi` content through a matching read-only renderer, applying Devanagari typography rules: line-height `1.9`, generous paragraph spacing (`mb-6`), pull-quotes styled with a left border accent and larger italic-equivalent (Devanagari has no true italic, so emphasis is conveyed via a distinct color + weight rather than font-style).
7. **`RelatedArticles.tsx`** — 3–4 cards from the same category, excluding the current post.
8. Comment/engagement section is explicitly out of scope for v1 (no `comments` table in the schema) to reduce moderation burden at launch.

### 4.6 Devanagari Typography System (Tailwind Tokens)

```
// tailwind.config.ts (excerpt)
fontFamily: {
  devanagari: ['"Noto Sans Devanagari"', '"Mukta"', 'sans-serif'],
  latin: ['"Inter"', 'sans-serif'],
},
fontSize: {
  'hi-body': ['1.125rem', { lineHeight: '1.9' }],
  'hi-headline': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
}
```
Numerals inside Hindi body copy (dates, counts, phone numbers) are deliberately rendered in Latin/Western numerals (०-९ Devanagari digits are avoided) since regional reader research and the brand's existing YouTube audience overwhelmingly expect Western numerals in a news context — a documented editorial decision, not an oversight.

---

## 5. LOCAL SEO, SCHEMA AUTOMATION & PWA CONFIGURATION

### 5.1 Production JSON-LD Schema Templates

**`NewsArticle` schema** (emitted for every `standard_article`/`opinion_editorial` post):

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "{{title_hi}}",
  "alternativeHeadline": "{{title_en}}",
  "image": ["{{featured_image_url}}"],
  "datePublished": "{{published_at_iso}}",
  "dateModified": "{{updated_at_iso}}",
  "author": {
    "@type": "Person",
    "name": "{{author.full_name_hi}}",
    "url": "https://internetkiawaaz.in/author/{{author.username}}"
  },
  "publisher": {
    "@type": "NewsMediaOrganization",
    "name": "इंटरनेट की आवाज़",
    "logo": {
      "@type": "ImageObject",
      "url": "https://internetkiawaaz.in/icons/logo-512.png",
      "width": 512,
      "height": 512
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://internetkiawaaz.in/news/{{slug}}"
  },
  "articleSection": "{{category.name_hi}}",
  "inLanguage": "hi",
  "description": "{{seo_description_hi}}"
}
```

**`VideoObject` schema** (emitted when `format = video_report`, merged alongside `NewsArticle` as an array in the same `<script type="application/ld+json">` block):

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "{{title_hi}}",
  "description": "{{seo_description_hi}}",
  "thumbnailUrl": ["{{youtube_thumbnail_url}}"],
  "uploadDate": "{{published_at_iso}}",
  "duration": "PT{{youtube_duration_seconds}}S",
  "embedUrl": "https://www.youtube.com/embed/{{youtube_video_id}}",
  "publisher": {
    "@type": "Organization",
    "name": "इंटरनेट की आवाज़",
    "logo": {
      "@type": "ImageObject",
      "url": "https://internetkiawaaz.in/icons/logo-512.png"
    }
  }
}
```

**`LocalBusiness` schema** (emitted per `directory_listings` detail page):

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{{business_name_hi}}",
  "description": "{{description_hi}}",
  "image": "{{cover_image_url}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{address_hi}}",
    "addressLocality": "{{locality}}",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "271001",
    "addressCountry": "IN"
  },
  "telephone": "{{phone_number}}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{rating}}",
    "bestRating": "5"
  }
}
```

### 5.2 Dynamic Sitemap Generation

**Standard sitemap** — `src/app/api/sitemap.xml/route.ts` streams every `published` post plus static pages, paginated at 5,000 URLs per file if the corpus grows past that threshold (a `sitemap-index.xml` router would then fan out — noted here as a forward-compatibility hook, not required at current scale).

**Google News sitemap** (`/api/sitemap-news.xml`) — per Google News sitemap protocol, includes **only posts published within the last 48 hours**, with the mandatory `<news:news>` block (publication name, language `hi`, `publication_date`, `title`). This route must set `Cache-Control: public, max-age=300` since News sitemaps are crawled far more frequently than standard sitemaps and an over-long cache would delay discovery of fresh stories.

### 5.3 PWA Manifest & Service Worker Strategy

**`manifest.ts`** (Next.js native manifest route) declares: `name: "इंटरनेट की आवाज़"`, `short_name: "IKA News"`, `theme_color` matching the brand's primary red, `display: "standalone"`, and a full icon set (`192x192`, `512x512`, maskable variant).

**Service worker caching strategy**, tuned for Tier-2/3 4G/5G variability:
- **App shell (nav bar, fonts, core CSS/JS):** Cache-first, versioned by build hash, so repeat visits load instantly even on a degraded connection.
- **Article HTML pages:** Stale-while-revalidate — serve the cached copy immediately, then silently refetch in the background so the *next* visit is current, which matches a news reader's actual behavior (skim now, don't need live-to-the-second on a page they already opened).
- **Images (featured images, gallery):** Cache-first with a size-capped LRU eviction (target ≤ 50 MB total image cache) and `next/image` responsive `srcset` generation at 3 breakpoints (400w / 800w / 1200w) so mobile devices never download a desktop-resolution asset.
- **API/RPC calls (view counters, ad impression pings):** Network-only, never cached, since these are write-adjacent and staleness would corrupt analytics.
- **Breaking news / Realtime channel:** Explicitly bypassed by the service worker (no interception), since it's a WebSocket-based subscription, not a fetchable resource.

### 5.4 Mobile Payload Budget Enforcement (< 1.5 MB per Article Page)

| Asset Category | Budget | Enforcement Mechanism |
|---|---|---|
| HTML + critical CSS | ≤ 60 KB | Tailwind JIT purge, no unused utility shipped |
| JS (route bundle, hydration) | ≤ 180 KB gzip | RSC by default; `VideoEmbed`, `TipTap` (admin only) code-split via `next/dynamic` |
| Fonts (Noto Sans Devanagari + Inter, subset) | ≤ 220 KB | `next/font` self-hosting with Devanagari + Latin subset only (no CJK/Cyrillic glyphs) |
| Featured image (above-the-fold) | ≤ 150 KB | AVIF/WebP via `next/image`, quality 75, responsive `sizes` attribute |
| Total initial article payload | **< 1.5 MB** | CI budget check (`next build` + bundle analyzer gate) fails the build if exceeded |

---

## 6. END-TO-END IMPLEMENTATION CODE DIRECTIVES

### 6.1 `src/lib/supabase/client.ts`

```typescript
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 6.2 `src/lib/supabase/server.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component; safe to ignore
            // because middleware handles session refresh.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Same as above.
          }
        },
      },
    }
  );
}

export async function createAdminClient() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

### 6.3 `src/lib/supabase/middleware.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';

const ADMIN_PREFIX = '/admin';
const SUPER_ADMIN_ONLY_ROUTES = ['/admin/users', '/admin/audit-logs'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path.startsWith(ADMIN_PREFIX)) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.is_active) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const isSuperAdminRoute = SUPER_ADMIN_ONLY_ROUTES.some((r) => path.startsWith(r));
    if (isSuperAdminRoute && profile.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return response;
}
```

**`src/middleware.ts`** (root export consumed by Next.js):

```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)',
  ],
};
```

### 6.4 `src/types/database.types.ts`

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'super_admin' | 'editor' | 'reporter' | 'contributor';
export type PostStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived' | 'retracted';
export type PostFormat = 'standard_article' | 'video_report' | 'photo_gallery' | 'live_blog' | 'opinion_editorial' | 'press_release';
export type AdPlacement = 'homepage_leaderboard' | 'homepage_sidebar' | 'article_inline' | 'article_sidebar' | 'category_header' | 'sticky_footer_mobile';
export type DirectoryTier = 'free_listing' | 'verified' | 'featured' | 'premium_sponsor';
export type BreakingPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          full_name_hi: string | null;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          bio_hi: string | null;
          role: UserRole;
          designation: string | null;
          designation_hi: string | null;
          phone_number: string | null;
          whatsapp_number: string | null;
          twitter_handle: string | null;
          is_active: boolean;
          reporter_beat: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          full_name: string;
          username: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      categories: {
        Row: {
          id: string;
          name_en: string;
          name_hi: string;
          slug: string;
          description_hi: string | null;
          icon_name: string | null;
          parent_id: string | null;
          display_order: number;
          is_active: boolean;
          seo_title_hi: string | null;
          seo_description_hi: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['categories']['Row']> & {
          name_en: string;
          name_hi: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Row']>;
      };
      tags: {
        Row: {
          id: string;
          name_hi: string;
          name_en: string | null;
          slug: string;
          usage_count: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['tags']['Row']> & {
          name_hi: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['tags']['Row']>;
      };
      posts: {
        Row: {
          id: string;
          title_hi: string;
          title_en: string | null;
          subtitle_hi: string | null;
          slug: string;
          excerpt_hi: string | null;
          body_hi: Json;
          body_html_cache: string | null;
          format: PostFormat;
          status: PostStatus;
          category_id: string;
          author_id: string;
          editor_id: string | null;
          featured_image_url: string | null;
          featured_image_alt_hi: string | null;
          gallery_image_urls: string[];
          youtube_video_id: string | null;
          youtube_thumbnail_url: string | null;
          youtube_duration_seconds: number | null;
          is_breaking: boolean;
          is_featured: boolean;
          is_video_first: boolean;
          view_count: number;
          reading_time_minutes: number | null;
          seo_title_hi: string | null;
          seo_description_hi: string | null;
          canonical_url: string | null;
          json_ld_type: string | null;
          published_at: string | null;
          scheduled_for: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['posts']['Row']> & {
          title_hi: string;
          category_id: string;
          author_id: string;
        };
        Update: Partial<Database['public']['Tables']['posts']['Row']>;
      };
      post_tags: {
        Row: { post_id: string; tag_id: string };
        Insert: { post_id: string; tag_id: string };
        Update: Partial<{ post_id: string; tag_id: string }>;
      };
      breaking_news: {
        Row: {
          id: string;
          headline_hi: string;
          linked_post_id: string | null;
          priority: BreakingPriority;
          is_active: boolean;
          created_by: string;
          expires_at: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['breaking_news']['Row']> & {
          headline_hi: string;
          created_by: string;
        };
        Update: Partial<Database['public']['Tables']['breaking_news']['Row']>;
      };
      directory_listings: {
        Row: {
          id: string;
          business_name_hi: string;
          business_name_en: string | null;
          slug: string;
          category_hi: string;
          description_hi: string | null;
          address_hi: string | null;
          locality: string | null;
          phone_number: string | null;
          whatsapp_number: string | null;
          cover_image_url: string | null;
          logo_url: string | null;
          tier: DirectoryTier;
          is_verified: boolean;
          rating: number;
          submitted_by: string | null;
          approved_by: string | null;
          is_approved: boolean;
          subscription_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['directory_listings']['Row']> & {
          business_name_hi: string;
          slug: string;
          category_hi: string;
        };
        Update: Partial<Database['public']['Tables']['directory_listings']['Row']>;
      };
      advertisements: {
        Row: {
          id: string;
          campaign_name: string;
          advertiser_name: string;
          placement: AdPlacement;
          creative_image_url: string;
          target_url: string;
          alt_text_hi: string | null;
          start_date: string;
          end_date: string;
          is_active: boolean;
          impression_count: number;
          click_count: number;
          created_by: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['advertisements']['Row']> & {
          campaign_name: string;
          advertiser_name: string;
          placement: AdPlacement;
          creative_image_url: string;
          target_url: string;
          start_date: string;
          end_date: string;
          created_by: string;
        };
        Update: Partial<Database['public']['Tables']['advertisements']['Row']>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['audit_logs']['Row']> & {
          action: string;
          entity_type: string;
        };
        Update: Partial<Database['public']['Tables']['audit_logs']['Row']>;
      };
    };
    Functions: {
      increment_post_view: {
        Args: { post_uuid: string };
        Returns: void;
      };
      current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
```

### 6.5 Server Action: Create / Update Article with SEO Validation

`src/lib/actions/posts.actions.ts`

```typescript
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { PostFormat, PostStatus, Json } from '@/types/database.types';

export interface ArticleFormInput {
  id?: string;
  titleHi: string;
  titleEn?: string;
  subtitleHi?: string;
  excerptHi?: string;
  bodyHi: Json;
  bodyHtmlCache: string;
  format: PostFormat;
  status: PostStatus;
  categoryId: string;
  featuredImageUrl?: string;
  featuredImageAltHi?: string;
  youtubeVideoId?: string;
  youtubeThumbnailUrl?: string;
  youtubeDurationSeconds?: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isVideoFirst?: boolean;
  seoTitleHi?: string;
  seoDescriptionHi?: string;
  canonicalUrl?: string;
  jsonLdType?: string;
  tagIds: string[];
  scheduledFor?: string;
}

export interface ActionResult {
  success: boolean;
  errors?: Record<string, string>;
  postId?: string;
}

function validateSeoFields(input: ArticleFormInput): Record<string, string> {
  const errors: Record<string, string> = {};

  const titleLen = Array.from(input.seoTitleHi ?? input.titleHi).length;
  if (titleLen === 0) {
    errors.seoTitleHi = 'एसईओ शीर्षक आवश्यक है।';
  } else if (titleLen > 65) {
    errors.seoTitleHi = 'एसईओ शीर्षक 65 अक्षरों से अधिक नहीं होना चाहिए।';
  }

  const descLen = Array.from(input.seoDescriptionHi ?? input.excerptHi ?? '').length;
  if (descLen === 0) {
    errors.seoDescriptionHi = 'मेटा विवरण आवश्यक है।';
  } else if (descLen > 160) {
    errors.seoDescriptionHi = 'मेटा विवरण 160 अक्षरों से अधिक नहीं होना चाहिए।';
  }

  if (!input.featuredImageAltHi && !input.isVideoFirst) {
    errors.featuredImageAltHi = 'फीचर्ड छवि के लिए Alt टेक्स्ट आवश्यक है।';
  }

  if (input.isVideoFirst && !input.youtubeVideoId) {
    errors.youtubeVideoId = 'वीडियो रिपोर्ट के लिए YouTube वीडियो आईडी आवश्यक है।';
  }

  if (input.status === 'scheduled' && !input.scheduledFor) {
    errors.scheduledFor = 'शेड्यूल की गई पोस्ट के लिए दिनांक/समय आवश्यक है।';
  }

  return errors;
}

function estimateReadingTimeMinutes(htmlContent: string): number {
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const WORDS_PER_MINUTE_HINDI = 180;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE_HINDI));
}

export async function saveArticle(input: ArticleFormInput): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, errors: { _root: 'आपको लॉगिन करना होगा।' } };
  }

  const isPublishIntent = input.status === 'published' || input.status === 'scheduled';
  const errors = isPublishIntent ? validateSeoFields(input) : {};

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { success: false, errors: { _root: 'प्रोफ़ाइल नहीं मिली।' } };
  }

  if (isPublishIntent && !['editor', 'super_admin'].includes(profile.role)) {
    return {
      success: false,
      errors: { _root: 'केवल संपादक ही पोस्ट प्रकाशित कर सकते हैं।' },
    };
  }

  const readingTime = estimateReadingTimeMinutes(input.bodyHtmlCache);

  const payload = {
    title_hi: input.titleHi,
    title_en: input.titleEn ?? null,
    subtitle_hi: input.subtitleHi ?? null,
    excerpt_hi: input.excerptHi ?? null,
    body_hi: input.bodyHi,
    body_html_cache: input.bodyHtmlCache,
    format: input.format,
    status: input.status,
    category_id: input.categoryId,
    author_id: input.id ? undefined : user.id,
    featured_image_url: input.featuredImageUrl ?? null,
    featured_image_alt_hi: input.featuredImageAltHi ?? null,
    youtube_video_id: input.youtubeVideoId ?? null,
    youtube_thumbnail_url: input.youtubeThumbnailUrl ?? null,
    youtube_duration_seconds: input.youtubeDurationSeconds ?? null,
    is_breaking: input.isBreaking ?? false,
    is_featured: input.isFeatured ?? false,
    is_video_first: input.isVideoFirst ?? false,
    reading_time_minutes: readingTime,
    seo_title_hi: input.seoTitleHi ?? input.titleHi,
    seo_description_hi: input.seoDescriptionHi ?? input.excerptHi ?? null,
    canonical_url: input.canonicalUrl ?? null,
    json_ld_type: input.jsonLdType ?? 'NewsArticle',
    scheduled_for: input.scheduledFor ?? null,
    published_at: input.status === 'published' ? new Date().toISOString() : null,
  };

  let postId = input.id;

  if (postId) {
    const { error } = await supabase.from('posts').update(payload).eq('id', postId);
    if (error) {
      return { success: false, errors: { _root: error.message } };
    }
  } else {
    const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
    if (error || !data) {
      return { success: false, errors: { _root: error?.message ?? 'पोस्ट सहेजने में त्रुटि हुई।' } };
    }
    postId = data.id;
  }

  await supabase.from('post_tags').delete().eq('post_id', postId);
  if (input.tagIds.length > 0) {
    await supabase
      .from('post_tags')
      .insert(input.tagIds.map((tagId) => ({ post_id: postId!, tag_id: tagId })));
  }

  revalidatePath('/admin/posts');
  if (input.status === 'published') {
    revalidatePath('/');
    revalidateTag('posts');
  }

  return { success: true, postId };
}

export async function deleteArticle(postId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    return { success: false, errors: { _root: error.message } };
  }

  revalidatePath('/admin/posts');
  redirect('/admin/posts');
}
```

### 6.6 TipTap Devanagari Editor Wrapper Component

`src/components/admin/editor/TipTapEditor.tsx`

```typescript
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  ImageIcon,
  LinkIcon,
  Minus,
} from 'lucide-react';

interface TipTapEditorProps {
  initialContentJson?: Record<string, unknown>;
  onChange: (json: Record<string, unknown>, html: string) => void;
}

export function TipTapEditor({ initialContentJson, onChange }: TipTapEditorProps) {
  const supabase = createClient();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: 'यहाँ अपनी खबर लिखना शुरू करें...',
      }),
    ],
    content: initialContentJson ?? '',
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none font-devanagari focus:outline-none min-h-[500px] leading-[1.9]',
        lang: 'hi',
        dir: 'ltr',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as Record<string, unknown>, currentEditor.getHTML());
    },
    immediatelyRender: false,
  });

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `article-inline/${fileName}`;

      const { error } = await supabase.storage.from('post-media').upload(filePath, file);

      if (error) {
        console.error('Image upload failed:', error.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('post-media').getPublicUrl(filePath);

      editor.chain().focus().setImage({ src: publicUrl, alt: '' }).run();
      event.target.value = '';
    },
    [editor, supabase]
  );

  if (!editor) {
    return (
      <div className="min-h-[500px] animate-pulse rounded-md border border-slate-200 bg-slate-50" />
    );
  }

  const toolbarButtonClass = (isActive: boolean) =>
    `rounded p-2 hover:bg-slate-100 ${isActive ? 'bg-slate-200 text-red-700' : 'text-slate-700'}`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 border-b border-slate-200 bg-white p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarButtonClass(editor.isActive('bold'))}
          aria-label="मोटा"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarButtonClass(editor.isActive('italic'))}
          aria-label="तिरछा"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 2 }))}
          aria-label="शीर्षक 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 3 }))}
          aria-label="शीर्षक 3"
        >
          <Heading3 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolbarButtonClass(editor.isActive('blockquote'))}
          aria-label="उद्धरण"
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarButtonClass(editor.isActive('bulletList'))}
          aria-label="बुलेट सूची"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarButtonClass(editor.isActive('orderedList'))}
          aria-label="क्रमांकित सूची"
        >
          <ListOrdered size={18} />
        </button>
        <label className="cursor-pointer rounded p-2 text-slate-700 hover:bg-slate-100">
          <ImageIcon size={18} />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('लिंक यूआरएल दर्ज करें:');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={toolbarButtonClass(editor.isActive('link'))}
          aria-label="लिंक"
        >
          <LinkIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded p-2 text-slate-700 hover:bg-slate-100"
          aria-label="क्षैतिज रेखा"
        >
          <Minus size={18} />
        </button>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
```

### 6.7 Dynamic Public Article Reader Page

`src/app/(public)/news/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleHeader } from '@/components/public/article/ArticleHeader';
import { ArticleBody } from '@/components/public/article/ArticleBody';
import { AuthorBylineCard } from '@/components/public/article/AuthorBylineCard';
import { SocialShareBar } from '@/components/public/article/SocialShareBar';
import { RelatedArticles } from '@/components/public/article/RelatedArticles';
import { VideoEmbed } from '@/components/public/article/VideoEmbed';
import { buildArticleJsonLd } from '@/lib/seo/json-ld';

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select(
      `
      *,
      category:categories(id, name_hi, slug),
      author:profiles!posts_author_id_fkey(id, full_name_hi, username, avatar_url, designation_hi, reporter_beat)
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return post;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticle(slug);

  if (!post) {
    return { title: 'लेख नहीं मिला | इंटरनेट की आवाज़' };
  }

  const title = post.seo_title_hi ?? post.title_hi;
  const description = post.seo_description_hi ?? post.excerpt_hi ?? '';
  const canonical = post.canonical_url ?? `https://internetkiawaaz.in/news/${post.slug}`;

  return {
    title: `${title} | इंटरनेट की आवाज़`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: post.featured_image_url ? [{ url: post.featured_image_url }] : [],
      locale: 'hi_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getArticle(slug);

  if (!post) {
    notFound();
  }

  const supabase = await createClient();
  await supabase.rpc('increment_post_view', { post_uuid: post.id });

  const jsonLd = buildArticleJsonLd(post);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8" lang="hi">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <a href="/" className="hover:text-red-700">होम</a>
        <span className="mx-2">/</span>
        <a href={`/category/${post.category.slug}`} className="hover:text-red-700">
          {post.category.name_hi}
        </a>
      </nav>

      <ArticleHeader
        titleHi={post.title_hi}
        subtitleHi={post.subtitle_hi}
        publishedAt={post.published_at}
        readingTimeMinutes={post.reading_time_minutes}
      />

      <AuthorBylineCard author={post.author} />

      <SocialShareBar
        url={`https://internetkiawaaz.in/news/${post.slug}`}
        title={post.title_hi}
      />

      {post.is_video_first && post.youtube_video_id ? (
        <VideoEmbed
          videoId={post.youtube_video_id}
          thumbnailUrl={post.youtube_thumbnail_url}
          titleHi={post.title_hi}
        />
      ) : post.featured_image_url ? (
        <img
          src={post.featured_image_url}
          alt={post.featured_image_alt_hi ?? post.title_hi}
          className="my-6 w-full rounded-lg object-cover"
          loading="eager"
        />
      ) : null}

      <ArticleBody bodyJson={post.body_hi} />

      <RelatedArticles categoryId={post.category.id} excludePostId={post.id} />
    </article>
  );
}
```

### 6.8 `src/lib/seo/json-ld.ts`

```typescript
interface PostForJsonLd {
  title_hi: string;
  title_en: string | null;
  seo_description_hi: string | null;
  excerpt_hi: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  updated_at: string;
  slug: string;
  is_video_first: boolean;
  youtube_video_id: string | null;
  youtube_thumbnail_url: string | null;
  youtube_duration_seconds: number | null;
  category: { name_hi: string };
  author: { full_name_hi: string | null; username: string };
}

export function buildArticleJsonLd(post: PostForJsonLd) {
  const newsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title_hi,
    alternativeHeadline: post.title_en ?? undefined,
    image: post.featured_image_url ? [post.featured_image_url] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author.full_name_hi ?? post.author.username,
      url: `https://internetkiawaaz.in/author/${post.author.username}`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'इंटरनेट की आवाज़',
      logo: {
        '@type': 'ImageObject',
        url: 'https://internetkiawaaz.in/icons/logo-512.png',
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://internetkiawaaz.in/news/${post.slug}`,
    },
    articleSection: post.category.name_hi,
    inLanguage: 'hi',
    description: post.seo_description_hi ?? post.excerpt_hi ?? undefined,
  };

  if (!post.is_video_first || !post.youtube_video_id) {
    return newsArticle;
  }

  const videoObject = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.title_hi,
    description: post.seo_description_hi ?? post.excerpt_hi ?? '',
    thumbnailUrl: post.youtube_thumbnail_url ? [post.youtube_thumbnail_url] : undefined,
    uploadDate: post.published_at ?? undefined,
    duration: post.youtube_duration_seconds
      ? `PT${post.youtube_duration_seconds}S`
      : undefined,
    embedUrl: `https://www.youtube.com/embed/${post.youtube_video_id}`,
    publisher: {
      '@type': 'Organization',
      name: 'इंटरनेट की आवाज़',
      logo: { '@type': 'ImageObject', url: 'https://internetkiawaaz.in/icons/logo-512.png' },
    },
  };

  return [newsArticle, videoObject];
}
```

---

## 7. IMPLEMENTATION ROADMAP & DELIVERY SEQUENCING

To keep this specification actionable, the AI code-generation agent consuming this document should execute work in the following dependency-respecting order:

1. **Foundation:** Run section 1 SQL (extensions → enums → tables → RLS enablement → policies → triggers → storage buckets → seed data) against a fresh Supabase project.
2. **Type generation:** Generate `database.types.ts` from the live schema (`supabase gen types typescript`) and reconcile against section 6.4 as a manual cross-check for any drift.
3. **Auth & middleware:** Wire `client.ts` / `server.ts` / `middleware.ts` before any protected route is built, so `/admin/*` is never accidentally exposed during development.
4. **Public shell:** Build the layout components in section 4.1–4.2 first, since every subsequent public page composes into them.
5. **Article Studio + Server Actions:** Implement section 3.1–3.2 and section 6.5–6.6 together, since the editor and its save action are tightly coupled.
6. **Public reader page:** Implement section 6.7–6.8, verifying the JSON-LD output against Google's Rich Results Test.
7. **Breaking news realtime + directory + ads:** Sections 3.4–3.5, in that order, since breaking news has the tightest realtime coupling and should be validated before the lower-urgency monetization surfaces.
8. **SEO infrastructure:** Sitemaps, robots.ts, manifest.ts, and service worker — section 5 — as the final pre-launch hardening pass, run against the Lighthouse mobile audit to confirm the < 1.5 MB budget holds in practice, not just in the CI heuristic.

**End of Master Specification.**

---

## 8. API ROUTE HANDLERS — FULL IMPLEMENTATION

### 8.1 YouTube Data API v3 Client

`src/lib/youtube/youtube-client.ts`

```typescript
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeVideoMeta {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  durationSeconds: number;
  viewCount: number;
}

function parseIso8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? '0', 10);
  const minutes = parseInt(match[2] ?? '0', 10);
  const seconds = parseInt(match[3] ?? '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function fetchYoutubeVideoMeta(videoId: string): Promise<YoutubeVideoMeta | null> {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_DATA_API_KEY environment variable is not configured.');
  }

  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const item = data.items?.[0];
  if (!item) return null;

  return {
    videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.maxres?.url ??
      item.snippet.thumbnails?.high?.url ??
      item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
    durationSeconds: parseIso8601Duration(item.contentDetails.duration),
    viewCount: parseInt(item.statistics?.viewCount ?? '0', 10),
  };
}

export async function fetchChannelLatestUploads(
  channelId: string,
  maxResults = 10
): Promise<YoutubeVideoMeta[]> {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_DATA_API_KEY environment variable is not configured.');
  }

  const searchUrl = `${YOUTUBE_API_BASE}/search?part=id&channelId=${channelId}&order=date&maxResults=${maxResults}&type=video&key=${apiKey}`;
  const searchResponse = await fetch(searchUrl, { next: { revalidate: 900 } });

  if (!searchResponse.ok) return [];

  const searchData = await searchResponse.json();
  const videoIds: string[] = searchData.items
    ?.map((item: { id: { videoId: string } }) => item.id.videoId)
    .filter(Boolean) ?? [];

  if (videoIds.length === 0) return [];

  const results = await Promise.all(videoIds.map((id) => fetchYoutubeVideoMeta(id)));
  return results.filter((result): result is YoutubeVideoMeta => result !== null);
}
```

### 8.2 YouTube Sync Route Handler

`src/app/api/youtube/sync/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { fetchChannelLatestUploads } from '@/lib/youtube/youtube-client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    return NextResponse.json({ error: 'YOUTUBE_CHANNEL_ID not configured' }, { status: 500 });
  }

  try {
    const videos = await fetchChannelLatestUploads(channelId, 15);
    const supabase = await createAdminClient();

    let updatedCount = 0;
    let skippedCount = 0;

    for (const video of videos) {
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('youtube_video_id', video.videoId)
        .maybeSingle();

      if (existing) {
        skippedCount += 1;
        continue;
      }

      updatedCount += 1;
    }

    return NextResponse.json({
      success: true,
      fetched: videos.length,
      newCandidates: updatedCount,
      alreadyLinked: skippedCount,
      note: 'New videos surface in /admin/posts/create as import candidates; they are not auto-published.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

> **Design rationale:** The sync job deliberately does **not** auto-create published posts from YouTube uploads. It surfaces new, unlinked videos as import candidates that a human editor pulls into the Article Studio via the `YoutubeMetaFetcher` component, preserving editorial control over headline, category, and SEO fields rather than mechanically mirroring YouTube's own (often SEO-unoptimized) video titles onto the news site.

### 8.3 Supabase Storage Upload Proxy Route

`src/app/api/upload/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

const BUCKET_BY_CONTEXT: Record<string, string> = {
  'post-featured': 'post-media',
  'post-gallery': 'post-media',
  'directory-cover': 'directory-media',
  'ad-creative': 'ad-creatives',
  avatar: 'avatars',
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const context = formData.get('context') as string | null;

  if (!file || !context || !(context in BUCKET_BY_CONTEXT)) {
    return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'फ़ाइल प्रकार समर्थित नहीं है।' }, { status: 415 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: 'फ़ाइल का आकार 8MB से अधिक नहीं होना चाहिए।' }, { status: 413 });
  }

  const bucket = BUCKET_BY_CONTEXT[context];
  const fileExt = file.name.split('.').pop();
  const filePath = `${context}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return NextResponse.json({ success: true, url: publicUrl, path: filePath });
}
```

### 8.4 Standard Sitemap Route Handler

`src/app/api/sitemap.xml/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';

const SITE_URL = 'https://internetkiawaaz.in';

const STATIC_PATHS = [
  '',
  '/directory',
  '/video-desk',
  '/static/about',
  '/static/contact',
  '/static/rni-declaration',
  '/static/grievance-redressal',
  '/static/privacy-policy',
  '/static/terms-of-service',
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5000);

  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true);

  const { data: directoryListings } = await supabase
    .from('directory_listings')
    .select('slug, updated_at')
    .eq('is_approved', true);

  const urlEntries: string[] = [];

  for (const path of STATIC_PATHS) {
    urlEntries.push(
      `<url><loc>${escapeXml(SITE_URL + path)}</loc><changefreq>daily</changefreq><priority>0.6</priority></url>`
    );
  }

  for (const post of posts ?? []) {
    urlEntries.push(
      `<url><loc>${escapeXml(`${SITE_URL}/news/${post.slug}`)}</loc><lastmod>${post.updated_at}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>`
    );
  }

  for (const category of categories ?? []) {
    urlEntries.push(
      `<url><loc>${escapeXml(`${SITE_URL}/category/${category.slug}`)}</loc><lastmod>${category.updated_at}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`
    );
  }

  for (const listing of directoryListings ?? []) {
    urlEntries.push(
      `<url><loc>${escapeXml(`${SITE_URL}/directory/${listing.slug}`)}</loc><lastmod>${listing.updated_at}</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
    },
  });
}
```

### 8.5 Google News Sitemap Route Handler

`src/app/api/sitemap-news.xml/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';

const SITE_URL = 'https://internetkiawaaz.in';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase = await createClient();
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title_hi, published_at')
    .eq('status', 'published')
    .gte('published_at', fortyEightHoursAgo)
    .order('published_at', { ascending: false });

  const urlEntries = (posts ?? []).map(
    (post) => `<url>
  <loc>${escapeXml(`${SITE_URL}/news/${post.slug}`)}</loc>
  <news:news>
    <news:publication>
      <news:name>Internet Ki Awaaz</news:name>
      <news:language>hi</news:language>
    </news:publication>
    <news:publication_date>${post.published_at}</news:publication_date>
    <news:title>${escapeXml(post.title_hi)}</news:title>
  </news:news>
</url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
```

### 8.6 On-Demand Revalidation Webhook

`src/app/api/revalidate/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { path, tag } = body as { path?: string; tag?: string };

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);

  if (!path && !tag) {
    return NextResponse.json({ error: 'Provide either path or tag' }, { status: 400 });
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

---

## 9. ADDITIONAL SERVER ACTIONS

### 9.1 `src/lib/actions/categories.actions.ts`

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface CategoryFormInput {
  id?: string;
  nameEn: string;
  nameHi: string;
  slug: string;
  descriptionHi?: string;
  iconName?: string;
  parentId?: string | null;
  displayOrder?: number;
  seoTitleHi?: string;
  seoDescriptionHi?: string;
}

export async function saveCategory(input: CategoryFormInput) {
  const supabase = await createClient();

  const payload = {
    name_en: input.nameEn,
    name_hi: input.nameHi,
    slug: input.slug,
    description_hi: input.descriptionHi ?? null,
    icon_name: input.iconName ?? null,
    parent_id: input.parentId ?? null,
    display_order: input.displayOrder ?? 0,
    seo_title_hi: input.seoTitleHi ?? null,
    seo_description_hi: input.seoDescriptionHi ?? null,
  };

  const query = input.id
    ? supabase.from('categories').update(payload).eq('id', input.id)
    : supabase.from('categories').insert(payload);

  const { error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/');
  return { success: true };
}

export async function toggleCategoryActive(categoryId: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', categoryId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/');
  return { success: true };
}
```

### 9.2 `src/lib/actions/directory.actions.ts`

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function submitDirectoryListing(formData: {
  businessNameHi: string;
  businessNameEn?: string;
  categoryHi: string;
  descriptionHi?: string;
  addressHi?: string;
  locality?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  coverImageUrl?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'लिस्टिंग जमा करने के लिए लॉगिन आवश्यक है।' };
  }

  const slugBase = formData.businessNameEn ?? formData.businessNameHi;
  const slug =
    slugBase
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);

  const { error } = await supabase.from('directory_listings').insert({
    business_name_hi: formData.businessNameHi,
    business_name_en: formData.businessNameEn ?? null,
    slug,
    category_hi: formData.categoryHi,
    description_hi: formData.descriptionHi ?? null,
    address_hi: formData.addressHi ?? null,
    locality: formData.locality ?? null,
    phone_number: formData.phoneNumber ?? null,
    whatsapp_number: formData.whatsappNumber ?? null,
    cover_image_url: formData.coverImageUrl ?? null,
    submitted_by: user.id,
    is_approved: false,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/directory');
  return { success: true };
}

export async function approveDirectoryListing(listingId: string, isVerified: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('directory_listings')
    .update({
      is_approved: true,
      is_verified: isVerified,
      approved_by: user.id,
    })
    .eq('id', listingId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/directory');
  revalidatePath('/directory');
  return { success: true };
}

export async function rejectDirectoryListing(listingId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('directory_listings').delete().eq('id', listingId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/directory');
  return { success: true };
}
```

### 9.3 `src/lib/actions/breaking-news.actions.ts`

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { BreakingPriority } from '@/types/database.types';

export async function publishBreakingNews(input: {
  headlineHi: string;
  linkedPostId?: string;
  priority: BreakingPriority;
  expiresInHours: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['editor', 'super_admin'].includes(profile.role)) {
    return { success: false, error: 'केवल संपादक ब्रेकिंग न्यूज़ प्रकाशित कर सकते हैं।' };
  }

  const expiresAt = new Date(Date.now() + input.expiresInHours * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from('breaking_news').insert({
    headline_hi: input.headlineHi,
    linked_post_id: input.linkedPostId ?? null,
    priority: input.priority,
    created_by: user.id,
    expires_at: expiresAt,
    is_active: true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/breaking-news');
  return { success: true };
}

export async function deactivateBreakingNews(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('breaking_news')
    .update({ is_active: false })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/breaking-news');
  return { success: true };
}
```

---

## 10. KEY UI COMPONENTS — FULL IMPLEMENTATION

### 10.1 `src/components/admin/editor/SerpPreview.tsx`

```typescript
'use client';

interface SerpPreviewProps {
  seoTitleHi: string;
  seoDescriptionHi: string;
  slug: string;
}

function truncateByGlyphs(text: string, maxGlyphs: number): string {
  const glyphs = Array.from(text);
  if (glyphs.length <= maxGlyphs) return text;
  return glyphs.slice(0, maxGlyphs).join('') + '…';
}

function CharCounter({ value, limit }: { value: string; limit: number }) {
  const length = Array.from(value).length;
  const ratio = length / limit;
  const colorClass =
    ratio > 1 ? 'text-red-600' : ratio > 0.85 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <span className={`text-xs font-medium ${colorClass}`}>
      {length} / {limit}
    </span>
  );
}

export function SerpPreview({ seoTitleHi, seoDescriptionHi, slug }: SerpPreviewProps) {
  const url = `internetkiawaaz.in › news › ${slug}`;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">डेस्कटॉप प्रीव्यू</span>
          <CharCounter value={seoTitleHi} limit={60} />
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="truncate text-sm text-slate-600">{url}</p>
          <p className="mt-1 truncate text-lg text-blue-800">
            {truncateByGlyphs(seoTitleHi, 60)}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-700">
            {truncateByGlyphs(seoDescriptionHi, 155)}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">मोबाइल प्रीव्यू</span>
          <CharCounter value={seoDescriptionHi} limit={155} />
        </div>
        <div className="max-w-[320px] rounded-md border border-slate-200 p-3">
          <p className="truncate text-xs text-slate-600">{url}</p>
          <p className="mt-1 line-clamp-2 text-base text-blue-800">
            {truncateByGlyphs(seoTitleHi, 65)}
          </p>
          <p className="mt-1 line-clamp-3 text-xs text-slate-700">
            {truncateByGlyphs(seoDescriptionHi, 120)}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 10.2 `src/components/public/article/VideoEmbed.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  videoId: string;
  thumbnailUrl: string | null;
  titleHi: string;
}

export function VideoEmbed({ videoId, thumbnailUrl, titleHi }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={titleHi}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      className="group relative my-6 block aspect-video w-full overflow-hidden rounded-lg bg-slate-900"
      aria-label={`वीडियो चलाएं: ${titleHi}`}
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={titleHi}
          className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          loading="lazy"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-700/90 text-white shadow-lg transition-transform group-hover:scale-110">
          <Play size={28} fill="white" />
        </span>
      </span>
    </button>
  );
}
```

**Design rationale:** This is the click-to-play facade pattern referenced in section 5.3 — the YouTube iframe (and its ~1 MB+ of associated JS) is never fetched until the reader explicitly opts in, which is essential to holding the sub-1.5 MB budget on `video_report` articles that would otherwise blow past it on page load alone.

### 10.3 `src/components/public/article/SocialShareBar.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

interface SocialShareBarProps {
  url: string;
  title: string;
}

export function SocialShareBar({ url, title }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 flex items-center gap-3 border-y border-slate-200 py-3">
      <span className="text-sm text-slate-500">शेयर करें:</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-green-600 p-2 text-white hover:bg-green-700"
        aria-label="व्हाट्सएप पर शेयर करें"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.06L2 22l5.06-1.38A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-blue-700 p-2 text-white hover:bg-blue-800"
        aria-label="फेसबुक पर शेयर करें"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6V9.8c0-2.56 1.52-3.98 3.87-3.98 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.88h-2.4v6.99A10 10 0 0 0 22 12z" />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-black p-2 text-white hover:bg-slate-800"
        aria-label="X पर शेयर करें"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-auto flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? 'कॉपी हो गया' : 'लिंक कॉपी करें'}
      </button>
    </div>
  );
}
```

### 10.4 `src/components/admin/users/RoleMatrixTable.tsx`

```typescript
'use client';

const CAPABILITIES: { label: string; roles: Record<string, boolean> }[] = [
  { label: 'ड्राफ्ट पोस्ट बनाएं', roles: { contributor: true, reporter: true, editor: true, super_admin: true } },
  { label: 'समीक्षा हेतु सबमिट करें', roles: { contributor: true, reporter: true, editor: true, super_admin: true } },
  { label: 'पोस्ट प्रकाशित करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'दूसरों की पोस्ट संपादित करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'पोस्ट हटाएं', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'श्रेणियां/टैग प्रबंधित करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'ब्रेकिंग न्यूज़ पोस्ट करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'डायरेक्टरी लिस्टिंग स्वीकृत करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'विज्ञापन प्रबंधित करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'उपयोगकर्ता आमंत्रित/निष्क्रिय करें', roles: { contributor: false, reporter: false, editor: false, super_admin: true } },
  { label: 'भूमिका बदलें', roles: { contributor: false, reporter: false, editor: false, super_admin: true } },
  { label: 'ऑडिट लॉग देखें', roles: { contributor: false, reporter: false, editor: false, super_admin: true } },
];

const ROLE_LABELS: Record<string, string> = {
  contributor: 'योगदानकर्ता',
  reporter: 'रिपोर्टर',
  editor: 'संपादक',
  super_admin: 'सुपर एडमिन',
};

export function RoleMatrixTable() {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left">
          <th className="py-2 pr-4 font-medium text-slate-500">क्षमता</th>
          {Object.keys(ROLE_LABELS).map((role) => (
            <th key={role} className="py-2 px-3 text-center font-medium text-slate-500">
              {ROLE_LABELS[role]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CAPABILITIES.map((capability) => (
          <tr key={capability.label} className="border-b border-slate-100">
            <td className="py-2 pr-4 text-slate-800">{capability.label}</td>
            {Object.keys(ROLE_LABELS).map((role) => (
              <td key={role} className="py-2 px-3 text-center">
                {capability.roles[role] ? (
                  <span className="text-emerald-600">✓</span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 11. TESTING STRATEGY

### 11.1 Testing Pyramid

| Layer | Tooling | Coverage Focus |
|---|---|---|
| Unit tests | Vitest | Pure functions: `generate_slug` equivalent client helpers, `estimateReadingTimeMinutes`, `truncateByGlyphs`, `parseIso8601Duration`, JSON-LD builders |
| Component tests | React Testing Library + Vitest | `SerpPreview` character-limit coloring, `VideoEmbed` click-to-play state transition, `SocialShareBar` copy-link toast |
| Integration tests | Vitest + a disposable Supabase local instance (`supabase start`) | RLS policy verification — assert a `reporter`-role session cannot `UPDATE` a `published` post, a `contributor` cannot insert with `status = 'published'`, an anonymous session cannot read `draft` posts |
| End-to-end tests | Playwright | Full editorial flow: login as reporter → draft article → submit for review → login as editor → publish → assert article appears on homepage and in `/sitemap.xml` |
| Accessibility tests | `@axe-core/playwright` | Automated a11y sweep on `/`, `/news/[slug]`, `/directory`, and the Article Studio |
| Performance budget tests | Lighthouse CI in the deployment pipeline | Enforce LCP < 2.5s, mobile payload < 1.5MB budget on `/news/[slug]` against a throttled "Slow 4G" profile |

### 11.2 Critical RLS Test Cases (Integration Suite)

```typescript
// tests/integration/rls-posts.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const SUPABASE_URL = process.env.SUPABASE_TEST_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_TEST_ANON_KEY!;

describe('RLS: posts table', () => {
  it('anonymous users cannot read draft posts', async () => {
    const anonClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await anonClient
      .from('posts')
      .select('*')
      .eq('status', 'draft');

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('a contributor cannot insert a post with status=published', async () => {
    const contributorClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    await contributorClient.auth.signInWithPassword({
      email: 'test-contributor@internetkiawaaz.in',
      password: process.env.TEST_CONTRIBUTOR_PASSWORD!,
    });

    const { error } = await contributorClient.from('posts').insert({
      title_hi: 'परीक्षण शीर्षक',
      category_id: process.env.TEST_CATEGORY_ID!,
      author_id: process.env.TEST_CONTRIBUTOR_ID!,
      status: 'published',
    });

    expect(error).not.toBeNull();
  });

  it('a reporter cannot update a post they do not author once it is in_review by another author', async () => {
    const reporterClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    await reporterClient.auth.signInWithPassword({
      email: 'test-reporter@internetkiawaaz.in',
      password: process.env.TEST_REPORTER_PASSWORD!,
    });

    const { data, error } = await reporterClient
      .from('posts')
      .update({ title_hi: 'अनधिकृत संपादन' })
      .eq('id', process.env.TEST_OTHER_AUTHOR_POST_ID!)
      .select();

    expect(error).toBeNull();
    expect(data).toEqual([]); // RLS silently filters — zero rows affected, not a thrown error
  });

  it('an editor can publish any post regardless of author', async () => {
    const editorClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    await editorClient.auth.signInWithPassword({
      email: 'test-editor@internetkiawaaz.in',
      password: process.env.TEST_EDITOR_PASSWORD!,
    });

    const { data, error } = await editorClient
      .from('posts')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', process.env.TEST_OTHER_AUTHOR_POST_ID!)
      .select();

    expect(error).toBeNull();
    expect(data?.[0]?.status).toBe('published');
  });
});
```

### 11.3 End-to-End Editorial Flow (Playwright)

```typescript
// tests/e2e/editorial-flow.spec.ts
import { test, expect } from '@playwright/test';

test('full editorial pipeline: draft → review → publish → live on homepage', async ({ page, context }) => {
  await page.goto('/login');
  await page.getByLabel('ईमेल').fill('test-reporter@internetkiawaaz.in');
  await page.getByLabel('पासवर्ड').fill(process.env.TEST_REPORTER_PASSWORD!);
  await page.getByRole('button', { name: 'लॉगिन करें' }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);

  await page.goto('/admin/posts/create');
  await page.getByLabel('शीर्षक').fill('गोंडा में नई सड़क परियोजना शुरू');
  await page.getByLabel('श्रेणी').selectOption({ label: 'गोंडा आंचल' });
  await page.locator('.ProseMirror').fill('यह एक परीक्षण लेख है जिसमें विस्तृत विवरण दिया गया है।');
  await page.getByRole('button', { name: 'समीक्षा हेतु सबमिट करें' }).click();
  await expect(page.getByText('सफलतापूर्वक सहेजा गया')).toBeVisible();

  // Switch to editor session in a fresh context
  const editorPage = await context.browser()!.newPage();
  await editorPage.goto('/login');
  await editorPage.getByLabel('ईमेल').fill('test-editor@internetkiawaaz.in');
  await editorPage.getByLabel('पासवर्ड').fill(process.env.TEST_EDITOR_PASSWORD!);
  await editorPage.getByRole('button', { name: 'लॉगिन करें' }).click();

  await editorPage.goto('/admin/posts');
  await editorPage.getByText('गोंडा में नई सड़क परियोजना शुरू').click();
  await editorPage.getByLabel('SEO शीर्षक').fill('गोंडा में नई सड़क परियोजना शुरू | पूरी जानकारी');
  await editorPage.getByLabel('मेटा विवरण').fill('गोंडा जिले में नई सड़क परियोजना का शुभारंभ, जानिए पूरी जानकारी।');
  await editorPage.getByRole('button', { name: 'अभी प्रकाशित करें' }).click();
  await expect(editorPage.getByText('सफलतापूर्वक प्रकाशित')).toBeVisible();

  await editorPage.goto('/');
  await expect(editorPage.getByText('गोंडा में नई सड़क परियोजना शुरू')).toBeVisible();
});
```

---

## 12. DEVOPS, CI/CD, ENVIRONMENT & MONITORING

### 12.1 Environment Variables

```bash
# .env.example — never commit populated .env files

# Supabase (public, safe for client bundle)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase (server-only, NEVER prefixed with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=

# YouTube Data API v3
YOUTUBE_DATA_API_KEY=
YOUTUBE_CHANNEL_ID=

# Cron / webhook secrets
CRON_SECRET=
REVALIDATE_SECRET=

# Weather API (for TopUtilityBar)
WEATHER_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=https://internetkiawaaz.in
```

### 12.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  unit-and-integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase start
      - run: supabase db reset
      - run: npm run test:unit
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [unit-and-integration-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e

  performance-budget:
    runs-on: ubuntu-latest
    needs: [e2e-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npx lhci autorun --config=./lighthouserc.json
```

### 12.3 Lighthouse CI Budget Configuration

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/news/sample-article-slug"],
      "numberOfRuns": 3,
      "settings": {
        "throttlingMethod": "simulate",
        "throttling": { "rttMs": 150, "throughputKbps": 1600 },
        "formFactor": "mobile"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "total-byte-weight": ["error", { "maxNumericValue": 1572864 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

### 12.4 Deployment Topology

- **Application hosting:** Vercel (native Next.js App Router support, Edge Middleware, ISR, and Route Handler co-location with the frontend).
- **Database & Auth:** Supabase managed cloud project, Mumbai (`ap-south-1`)-region instance selected specifically to minimize latency for the Uttar Pradesh reader base and the Gonda-based editorial staff logging into `/admin`.
- **Scheduled jobs:** Supabase Edge Functions on `pg_cron` for the breaking-news expiry sweep (section 3.4); Vercel Cron for the `/api/youtube/sync` invocation (every 30 minutes).
- **CDN & image optimization:** Vercel's built-in image optimization pipeline in front of Supabase Storage public URLs, serving AVIF/WebP per the payload budget in section 5.4.
- **Error monitoring:** Sentry, configured with `beforeSend` scrubbing of any `phone_number`/`whatsapp_number` fields that might leak into breadcrumbs from form-state error contexts.
- **Uptime & alerting:** A synthetic monitor pinging `/` and `/api/sitemap.xml` every 5 minutes, alerting the super_admin via WhatsApp Business API webhook (not email, per the operational preference of a small Tier-2 newsroom where email is checked far less frequently than WhatsApp).

### 12.5 Backup & Disaster Recovery

- Supabase automated daily PITR (point-in-time recovery) backups retained 7 days on the project's plan tier at minimum; a weekly `pg_dump` snapshot additionally pushed to a separate cold-storage bucket outside Supabase's own infrastructure, guarding against a platform-level incident rather than only database-level corruption.
- The `audit_logs` table is explicitly excluded from any data-retention pruning job — it is the newsroom's accountability record and must be preserved indefinitely, or per whatever period Indian press/media regulatory retention requirements the publication's legal counsel specifies (a determination outside this specification's engineering scope).

---

## 13. ACCESSIBILITY & INTERNATIONALIZATION NOTES

- All interactive icon-only buttons (share icons, toolbar buttons, hamburger menu) carry `aria-label` in Hindi, matching the surrounding UI language — screen reader users on this property are assumed to be primarily Hindi-fluent given the audience.
- Color contrast for the brand red (`bg-red-700`) against white text is verified at a minimum 4.5:1 ratio (WCAG AA) for all breaking-news and CTA button treatments.
- The `lang="hi"` attribute is set at the `<article>` root on the reader page (section 6.7) and at the `<html>` root in the site's root layout by default, with an explicit `lang="en"` override wrapper reserved for the rare `title_en` / English-language press-release reproductions, so assistive technology and browser translation tools apply correct pronunciation/translation rules per text block rather than treating the whole bilingual page as monolingual.
- Focus states on all interactive elements use a visible `focus-visible:ring-2 focus-visible:ring-red-700` Tailwind utility rather than suppressing the browser default outline, since keyboard navigation is a first-class access path for the Article Studio's power users (reporters filing stories quickly against deadline).
- Form validation errors (section 6.5's `errors` record) are rendered adjacent to their field AND announced via an `aria-live="polite"` region at the top of the SEO sidebar, so a screen-reader-using editor is notified of a failed publish attempt without having to manually scan the form.

---

## 14. APPENDIX: GLOSSARY OF DOMAIN TERMS FOR THE AI AGENT

| Term | Meaning in this specification |
|---|---|
| Video-First | An article flagged `is_video_first = true`; its primary content is a YouTube embed rather than body text, though `body_hi` still carries a written summary for SEO indexability. |
| Breaking Priority | The `breaking_priority` enum driving visual urgency treatment on the public ticker; not a workflow/approval concept — a `critical` item still requires the same editor-role gate as `low`. |
| Directory Tier | Commercial subscription level (`free_listing` → `premium_sponsor`) for the business directory; orthogonal to `is_verified`, which is an editorial trust signal, not a paid feature. |
| RLS Default-Deny | The architectural stance that a table with RLS enabled and zero matching policies returns zero rows / rejects all writes, rather than falling open — every table in section 1 relies on this as its baseline security posture before any policy is added. |
| Devanagari Glyph Counting | Using `Array.from(string).length` instead of `.length` when enforcing SEO character limits, because raw UTF-16 length miscounts combining marks (matras) common in Devanagari script. |
| Click-to-Play Facade | The pattern in `VideoEmbed.tsx` (section 10.2) where a static thumbnail substitutes for the actual YouTube iframe until user interaction, protecting the mobile payload budget. |
| Import Candidate | A YouTube video discovered by the sync job (section 8.2) that has no matching `posts.youtube_video_id` row yet; surfaced to editors for manual, editorially-controlled import rather than auto-published. |

---

## 15. ADMIN DASHBOARD ANALYTICS & OPERATIONAL VIEWS

### 15.1 `/admin/dashboard` Composition

The landing screen after staff login aggregates the signals an editorial desk checks first thing each morning, laid out as a responsive card grid:

1. **Publishing Pulse** — count of posts published in the last 24 hours vs. the trailing 7-day daily average, rendered as a small sparkline so an editor immediately notices an unusually quiet news day.
2. **Review Queue Depth** — count of posts currently `in_review`, with the oldest item's age highlighted in amber past 4 hours and red past 12 hours, since a stalled review queue is the most common failure mode in a small newsroom.
3. **Directory Approval Backlog** — count of `is_approved = false` submissions awaiting action.
4. **Active Breaking Alerts** — live count pulled from the same Realtime channel described in section 3.4, so the dashboard and the public ticker never visibly disagree.
5. **Top 5 Articles (24h)** by `view_count` delta, computed via a scheduled Edge Function that snapshots `view_count` hourly into a lightweight `post_view_snapshots` table (not exposed in the core schema in section 1, since it is an optional analytics extension rather than a system-of-record table) so "views in the last 24 hours" can be computed as a delta rather than requiring a separate real-time counting infrastructure.
6. **Ad Campaign Health** — active campaigns nearing their `end_date` within 3 days, prompting renewal outreach to the advertiser before the slot goes dark.

Only `editor` and `super_admin` roles see the full dashboard; `reporter` and `contributor` land on a narrower personal view showing just their own draft/in-review posts and view counts on their published bylines, keeping the interface focused on what that role can actually act on.

### 15.2 `AdPerformanceChart.tsx`

```typescript
'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdPerformancePoint {
  date: string;
  impressions: number;
  clicks: number;
}

interface AdPerformanceChartProps {
  data: AdPerformancePoint[];
}

export function AdPerformanceChart({ data }: AdPerformanceChartProps) {
  const ctr = data.length > 0
    ? (
        (data.reduce((sum, point) => sum + point.clicks, 0) /
          Math.max(data.reduce((sum, point) => sum + point.impressions, 0), 1)) *
        100
      ).toFixed(2)
    : '0.00';

  return (
    <div>
      <div className="mb-4 flex items-center gap-6">
        <div>
          <p className="text-xs text-slate-500">कुल इंप्रेशन</p>
          <p className="text-2xl font-semibold text-slate-900">
            {data.reduce((sum, point) => sum + point.impressions, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">कुल क्लिक</p>
          <p className="text-2xl font-semibold text-slate-900">
            {data.reduce((sum, point) => sum + point.clicks, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">CTR</p>
          <p className="text-2xl font-semibold text-red-700">{ctr}%</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="impressions" stroke="#334155" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="clicks" stroke="#b91c1c" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 15.3 `src/lib/seo/metadata-builder.ts`

Centralizes Next.js `Metadata` object construction so every route (article, category, directory listing) produces consistent Open Graph and Twitter Card output rather than each page hand-rolling its own metadata shape.

```typescript
import type { Metadata } from 'next';

const SITE_NAME = 'इंटरनेट की आवाज़';
const SITE_URL = 'https://internetkiawaaz.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/default-og-image.jpg`;

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonical = `${SITE_URL}${input.path}`;
  const image = input.imageUrl ?? DEFAULT_OG_IMAGE;

  return {
    title: `${input.title} | ${SITE_NAME}`,
    description: input.description,
    alternates: { canonical },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url: canonical,
      type: input.type ?? 'website',
      locale: 'hi_IN',
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.type === 'article' && {
        publishedTime: input.publishedTime ?? undefined,
        modifiedTime: input.modifiedTime,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
```

---

## 16. CONTENT MODERATION & EDITORIAL GOVERNANCE HOOKS

While full moderation tooling (automated content classifiers, plagiarism detection) is out of scope for the v1 schema, the following structural hooks are built in from day one so they can be layered on without a schema migration:

- **`post_status = 'retracted'`** exists specifically for post-publication corrections that go beyond a simple edit — a retracted post remains queryable by staff (for the audit trail and any regulatory grievance-redressal response) but is excluded from every public-facing query (`status = 'published'` filters, per section 1.17's RLS policy), and is excluded from both sitemap route handlers (section 8.4–8.5) since a retracted story should not remain discoverable to search engines.
- **`audit_logs`** (section 1.11) capturing full before/after JSON on every `posts`, `directory_listings`, and `advertisements` mutation gives the `super_admin` a complete record to respond to any press-council or reader grievance inquiry about when a story was altered and by whom — directly supporting the static `/static/grievance-redressal` compliance page referenced in section 2.1.
- **`editor_id`** on the `posts` table (distinct from `author_id`) preserves a record of which editor approved/published a given reporter's story, satisfying basic editorial-accountability norms expected of a registered news publication in India even though this specification does not model RNI (Registrar of Newspapers for India) registration numbers directly — that metadata belongs on the static compliance pages (`/static/rni-declaration`) as literal content rather than as a database-modeled field, since it changes on a multi-year cadence rather than per-article.

---

## 17. PROJECT CONFIGURATION FILES

### 17.1 `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=900, stale-while-revalidate=1800' }],
      },
      {
        source: '/api/sitemap-news.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=300' }],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
```

### 17.2 `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#B91C1C',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        devanagari: ['"Noto Sans Devanagari"', '"Mukta"', 'sans-serif'],
        latin: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        'hi-body': ['1.125rem', { lineHeight: '1.9' }],
        'hi-headline': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            lineHeight: '1.9',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

### 17.3 `src/app/layout.tsx` — Root Layout with Self-Hosted Font Subsetting

```typescript
import type { Metadata } from 'next';
import { Noto_Sans_Devanagari, Inter } from 'next/font/google';
import './globals.css';

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '700'],
  variable: '--font-devanagari',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://internetkiawaaz.in'),
  title: {
    default: 'इंटरनेट की आवाज़ | ख़बर, ज्ञान और जन-सरोकार का डिजिटल मंच',
    template: '%s | इंटरनेट की आवाज़',
  },
  description: 'गोंडा, कैसरगंज, देवीपाटन मंडल और पूर्वांचल की ताज़ा खबरें, वीडियो रिपोर्ट और स्थानीय व्यापार डायरेक्टरी।',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${notoSansDevanagari.variable} ${inter.variable}`}>
      <body className="font-devanagari antialiased">{children}</body>
    </html>
  );
}
```

Restricting the `subsets` option to `devanagari` (plus a separate `latin` subset for `Inter`) rather than pulling the full Noto Sans Devanagari character set is what keeps the font payload inside the 220 KB budget line-itemed in section 5.4 — the full Noto family ships Latin, Cyrillic, and Greek glyph tables that this bilingual (Hindi + numeral/UI-English) site never renders.

### 17.4 `package.json` — Core Dependencies

```json
{
  "name": "internet-ki-awaaz",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test:unit": "vitest run --dir tests/unit",
    "test:integration": "vitest run --dir tests/integration",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/ssr": "^0.4.0",
    "@supabase/supabase-js": "^2.45.0",
    "@tiptap/react": "^2.5.0",
    "@tiptap/starter-kit": "^2.5.0",
    "@tiptap/extension-image": "^2.5.0",
    "@tiptap/extension-link": "^2.5.0",
    "@tiptap/extension-placeholder": "^2.5.0",
    "lucide-react": "^0.427.0",
    "recharts": "^2.12.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.13",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@playwright/test": "^1.46.0",
    "@axe-core/playwright": "^4.9.0",
    "@lhci/cli": "^0.14.0"
  }
}
```

---

## 18. PHASE 2 ROADMAP (EXPLICITLY OUT OF SCOPE FOR THIS SPECIFICATION)

The following capabilities are intentionally excluded from the v1 build described above, either to keep the initial launch surface small enough for a two-to-three-person editorial team to operate confidently, or because they depend on usage data this specification's schema does not yet collect. They are recorded here so the AI code-generation agent does not attempt to silently scope-creep them into v1, and so a future planning pass has a documented starting point rather than rediscovering these needs from scratch:

1. **Reader comments & community moderation** — deliberately deferred (see section 4.5, item 8) given the moderation burden a comment system imposes on a small newsroom; if introduced later, it should ship with a dedicated `comments` table carrying its own RLS policy set and a lightweight profanity/spam classifier gate before a comment reaches `is_visible = true`, mirroring the approval-gate pattern already established for `directory_listings`.
2. **Push notifications for breaking news** — the PWA manifest (section 5.3) lays the groundwork, but Web Push subscription management (`push_subscriptions` table, VAPID key handling, per-category opt-in granularity) is a distinct feature slice warranting its own specification pass rather than being bolted onto this one.
3. **Multi-language expansion beyond Hindi/English** — the current schema's `_hi`/`_en` column-pair pattern (e.g., `title_hi`/`title_en`) does not generalize cleanly past two languages; a genuine third-language addition (e.g., Awadhi/Bhojpuri regional content, which would be editorially relevant to the Purvanchal audience) should migrate to a separate `post_translations` join table rather than continuing to add per-language columns to `posts`.
4. **Reader analytics beyond view counts** — session-level reading behavior (scroll depth, time-on-page, referrer breakdown) would require either a self-hosted privacy-respecting analytics tool or a third-party integration, and is left out of v1 to avoid adding a cookie-consent/privacy-policy surface area before the core editorial and monetization workflows are proven.
5. **Automated YouTube auto-publish** — as noted in section 8.2's design rationale, the sync job surfacing "import candidates" rather than auto-publishing is a deliberate v1 constraint, not a technical limitation; a Phase 2 "trusted auto-publish for verified categories" mode could be layered on once the editorial team has enough confidence in a specific recurring video series (e.g., a weekly explainer format) to skip manual review for that series only.
6. **Advertiser self-serve portal** — currently, campaign creation in `/admin/advertisements` (section 3.5) is staff-only; a Phase 2 advertiser-facing login (a new `advertiser` addition to the `user_role` enum, with RLS scoped to rows where `advertisements.created_by` matches their own profile) would let local Gonda businesses manage their own banner campaigns and view their own `AdPerformanceChart` without needing to route requests through an editor.
7. **RNI-integrated compliance metadata** — as flagged in section 16, formal RNI (Registrar of Newspapers for India) registration fields are currently modeled only as static page content rather than structured data; should the publication's registration status or the applicable compliance framework require it to be queryable/API-exposed, a dedicated `compliance_metadata` singleton table should be introduced rather than overloading the `profiles` or `posts` tables with organization-level fields that don't belong at the row level.

None of the items above should be implemented as part of executing this specification; they are documented purely to prevent scope ambiguity during code generation.

**End of Master Specification — Internet Ki Awaaz Digital News Portal & CMS.**
