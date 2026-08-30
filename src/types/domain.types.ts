import type { Database, PostFormat, PostStatus, UserRole, BreakingPriority, DirectoryTier, AdPlacement } from './database.types';

export type PostRow = Database['public']['Tables']['posts']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type TagRow = Database['public']['Tables']['tags']['Row'];
export type BreakingNewsRow = Database['public']['Tables']['breaking_news']['Row'];
export type DirectoryListingRow = Database['public']['Tables']['directory_listings']['Row'];
export type AdvertisementRow = Database['public']['Tables']['advertisements']['Row'];
export type AuditLogRow = Database['public']['Tables']['audit_logs']['Row'];

export interface PostWithRelations extends PostRow {
  category: Pick<CategoryRow, 'id' | 'name_hi' | 'name_en' | 'slug'>;
  author: Pick<ProfileRow, 'id' | 'full_name' | 'full_name_hi' | 'username' | 'avatar_url' | 'designation_hi' | 'reporter_beat'>;
  tags?: Pick<TagRow, 'id' | 'name_hi' | 'slug'>[];
}

export interface BreakingNewsWithPost extends BreakingNewsRow {
  linked_post?: Pick<PostRow, 'id' | 'slug' | 'title_hi'> | null;
}
