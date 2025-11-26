-- Manual Migration: SavedFilter Table
-- Run this SQL directly in Supabase SQL Editor

-- Create SavedFilter table
CREATE TABLE IF NOT EXISTS saved_filters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  filter_config JSONB NOT NULL,
  category_slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  CONSTRAINT saved_filters_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);

-- Create index
CREATE INDEX IF NOT EXISTS saved_filters_user_id_idx ON saved_filters(user_id);

-- Verify
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'saved_filters'
ORDER BY ordinal_position;
