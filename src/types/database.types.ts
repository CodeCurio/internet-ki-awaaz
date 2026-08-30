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
          email?: string | null;
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
          blood_group?: string | null;
          emergency_contact?: string | null;
          id_card_number?: string | null;
          aadhaar_card_url?: string | null;
          pan_card_url?: string | null;
          date_of_joining?: string | null;
          valid_until?: string | null;
          address?: string | null;
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
      contact_submissions: {
        Row: {
          id: string;
          reference_id: string;
          full_name: string;
          phone_number: string;
          email: string | null;
          city: string | null;
          subject: string;
          message: string;
          status: 'pending' | 'in_review' | 'resolved';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['contact_submissions']['Row']> & {
          reference_id: string;
          full_name: string;
          phone_number: string;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Row']>;
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
