-- Migration Step B: Rename community tables to hub tables
-- This is safe to run because all code already uses the new names via Drizzle mappings.

BEGIN;

-- 1. Create new enum types (matching Drizzle schema in enums.ts)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hub_type') THEN
    CREATE TYPE hub_type AS ENUM ('community', 'product', 'company');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hub_privacy') THEN
    CREATE TYPE hub_privacy AS ENUM ('public', 'unlisted', 'private');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hub_join_policy') THEN
    CREATE TYPE hub_join_policy AS ENUM ('open', 'approval', 'invite');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hub_role') THEN
    CREATE TYPE hub_role AS ENUM ('owner', 'admin', 'moderator', 'member');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hub_member_status') THEN
    CREATE TYPE hub_member_status AS ENUM ('pending', 'active');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
    CREATE TYPE product_status AS ENUM ('active', 'discontinued', 'preview');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
    CREATE TYPE product_category AS ENUM ('microcontroller', 'sbc', 'sensor', 'actuator', 'display', 'communication', 'power', 'mechanical', 'software', 'tool', 'other');
  END IF;
END $$;

-- 2. Migrate columns from old enum types to new ones (drop default first, re-add after)
ALTER TABLE communities ALTER COLUMN join_policy DROP DEFAULT;
ALTER TABLE communities ALTER COLUMN join_policy TYPE hub_join_policy USING join_policy::text::hub_join_policy;
ALTER TABLE communities ALTER COLUMN join_policy SET DEFAULT 'open';

ALTER TABLE community_members ALTER COLUMN role DROP DEFAULT;
ALTER TABLE community_members ALTER COLUMN role TYPE hub_role USING role::text::hub_role;
ALTER TABLE community_members ALTER COLUMN role SET DEFAULT 'member';

-- 3. Add new columns to communities table (if not already present)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'hub_type') THEN
    ALTER TABLE communities ADD COLUMN hub_type hub_type NOT NULL DEFAULT 'community';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'privacy') THEN
    ALTER TABLE communities ADD COLUMN privacy hub_privacy NOT NULL DEFAULT 'public';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'parent_hub_id') THEN
    ALTER TABLE communities ADD COLUMN parent_hub_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'website') THEN
    ALTER TABLE communities ADD COLUMN website varchar(512);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'categories') THEN
    ALTER TABLE communities ADD COLUMN categories jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'ap_actor_id') THEN
    ALTER TABLE communities ADD COLUMN ap_actor_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communities' AND column_name = 'deleted_at') THEN
    ALTER TABLE communities ADD COLUMN deleted_at timestamptz;
  END IF;
END $$;

-- 4. Add status column to community_members (if not present)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_members' AND column_name = 'status') THEN
    ALTER TABLE community_members ADD COLUMN status hub_member_status NOT NULL DEFAULT 'active';
  END IF;
END $$;

-- 5. Add last_edited_at to community_posts (if not present)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'last_edited_at') THEN
    ALTER TABLE community_posts ADD COLUMN last_edited_at timestamptz;
  END IF;
END $$;

-- 6. Create products table (if not exists)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  description text,
  hub_id uuid NOT NULL,
  category product_category,
  specs jsonb,
  image_url text,
  purchase_url text,
  datasheet_url text,
  alternatives jsonb,
  pricing jsonb,
  status product_status NOT NULL DEFAULT 'active',
  created_by_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Create content_products join table (if not exists)
CREATE TABLE IF NOT EXISTS content_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  role varchar(64),
  notes text,
  required boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(content_id, product_id)
);

-- 8. Create content_versions table (if not exists)
CREATE TABLE IF NOT EXISTS content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  version integer NOT NULL,
  title varchar(255),
  content jsonb,
  metadata jsonb,
  created_by_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Add missing columns to content_items
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'license_type') THEN
    ALTER TABLE content_items ADD COLUMN license_type varchar(32);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'series') THEN
    ALTER TABLE content_items ADD COLUMN series varchar(128);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'estimated_minutes') THEN
    ALTER TABLE content_items ADD COLUMN estimated_minutes integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'canonical_url') THEN
    ALTER TABLE content_items ADD COLUMN canonical_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'ap_object_id') THEN
    ALTER TABLE content_items ADD COLUMN ap_object_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_items' AND column_name = 'deleted_at') THEN
    ALTER TABLE content_items ADD COLUMN deleted_at timestamptz;
  END IF;
END $$;

-- 10. Add missing columns to users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'pronouns') THEN
    ALTER TABLE users ADD COLUMN pronouns varchar(32);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'timezone') THEN
    ALTER TABLE users ADD COLUMN timezone varchar(64);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_notifications') THEN
    ALTER TABLE users ADD COLUMN email_notifications jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'deleted_at') THEN
    ALTER TABLE users ADD COLUMN deleted_at timestamptz;
  END IF;
END $$;

-- 11. Add missing columns to files
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'original_name') THEN
    ALTER TABLE files ADD COLUMN original_name varchar(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'content_id') THEN
    ALTER TABLE files ADD COLUMN content_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'hub_id') THEN
    ALTER TABLE files ADD COLUMN hub_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'width') THEN
    ALTER TABLE files ADD COLUMN width integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'height') THEN
    ALTER TABLE files ADD COLUMN height integer;
  END IF;
END $$;

-- 12. Add 'hub' to notification_type enum if not present
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'hub' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'hub';
  END IF;
END $$;

-- 13. Rename main tables
ALTER TABLE communities RENAME TO hubs;
ALTER TABLE community_members RENAME TO hub_members;
ALTER TABLE community_posts RENAME TO hub_posts;
ALTER TABLE community_post_replies RENAME TO hub_post_replies;
ALTER TABLE community_bans RENAME TO hub_bans;
ALTER TABLE community_invites RENAME TO hub_invites;
ALTER TABLE community_shares RENAME TO hub_shares;

-- 14. Rename foreign key columns
ALTER TABLE hub_members RENAME COLUMN community_id TO hub_id;
ALTER TABLE hub_posts RENAME COLUMN community_id TO hub_id;
ALTER TABLE hub_bans RENAME COLUMN community_id TO hub_id;
ALTER TABLE hub_invites RENAME COLUMN community_id TO hub_id;
ALTER TABLE hub_shares RENAME COLUMN community_id TO hub_id;

-- 15. Rename constraints
ALTER INDEX communities_pkey RENAME TO hubs_pkey;
ALTER INDEX communities_slug_unique RENAME TO hubs_slug_unique;
ALTER INDEX community_members_community_id_user_id_pk RENAME TO hub_members_hub_id_user_id_pk;

-- 16. Add products FK to hubs (now that tables are renamed)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_hub_id_fkey') THEN
    ALTER TABLE products ADD CONSTRAINT products_hub_id_fkey FOREIGN KEY (hub_id) REFERENCES hubs(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_created_by_id_fkey') THEN
    ALTER TABLE products ADD CONSTRAINT products_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 17. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_content_author ON content_items(author_id);
CREATE INDEX IF NOT EXISTS idx_content_type_status ON content_items(type, status);
CREATE INDEX IF NOT EXISTS idx_content_published ON content_items(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_hub_posts_hub_created ON hub_posts(hub_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hub_shares_hub_id ON hub_shares(hub_id);
CREATE INDEX IF NOT EXISTS idx_hub_shares_content_id ON hub_shares(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_content_products_product ON content_products(product_id);
CREATE INDEX IF NOT EXISTS idx_content_products_content ON content_products(content_id);
CREATE INDEX IF NOT EXISTS idx_products_hub ON products(hub_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_path ON enrollments(path_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_activities_pending ON activities(status) WHERE status = 'pending';

-- 18. Drop stale enums (now safe — columns have been migrated)
DROP TYPE IF EXISTS community_join_policy;
DROP TYPE IF EXISTS community_role;

COMMIT;
