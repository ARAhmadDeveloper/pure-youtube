-- Create watch_later table
CREATE TABLE IF NOT EXISTS watch_later (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watch_later_user_id ON watch_later(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_later_video_id ON watch_later(video_id);
CREATE INDEX IF NOT EXISTS idx_watch_later_created_at ON watch_later(created_at);

-- Enable RLS
ALTER TABLE watch_later ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own watch later items" ON watch_later
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch later items" ON watch_later
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch later items" ON watch_later
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to get watch later videos for a user
CREATE OR REPLACE FUNCTION get_watch_later_videos(user_uuid UUID, page_limit INTEGER DEFAULT 20, page_offset INTEGER DEFAULT 0)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration INTEGER,
  views INTEGER,
  likes INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  added_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.description,
    v.thumbnail_url,
    v.video_url,
    v.duration,
    v.views,
    v.likes,
    v.comment_count,
    v.created_at,
    v.user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    wl.created_at as added_at
  FROM videos v
  INNER JOIN watch_later wl ON v.id = wl.video_id
  INNER JOIN profiles p ON v.user_id = p.id
  WHERE wl.user_id = user_uuid
  ORDER BY wl.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
