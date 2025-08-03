-- Create liked_videos table if it doesn't exist
CREATE TABLE IF NOT EXISTS liked_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_liked_videos_user_id ON liked_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_videos_video_id ON liked_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_liked_videos_created_at ON liked_videos(created_at DESC);

-- Enable RLS
ALTER TABLE liked_videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own liked videos" ON liked_videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can like videos" ON liked_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike videos" ON liked_videos
  FOR DELETE USING (auth.uid() = user_id);

-- Function to get liked videos with video details
CREATE OR REPLACE FUNCTION get_liked_videos(
  user_uuid UUID,
  page_limit INTEGER DEFAULT 12,
  page_offset INTEGER DEFAULT 0
)
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
  liked_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    lv.created_at as liked_at
  FROM liked_videos lv
  JOIN videos v ON lv.video_id = v.id
  JOIN profiles p ON v.user_id = p.id
  WHERE lv.user_id = user_uuid
  ORDER BY lv.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

-- Function to check if user liked a video
CREATE OR REPLACE FUNCTION is_video_liked(
  user_uuid UUID,
  video_uuid UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM liked_videos 
    WHERE user_id = user_uuid AND video_id = video_uuid
  );
END;
$$;

-- Function to toggle like status
CREATE OR REPLACE FUNCTION toggle_video_like(
  user_uuid UUID,
  video_uuid UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_liked BOOLEAN;
BEGIN
  -- Check if already liked
  SELECT EXISTS (
    SELECT 1 FROM liked_videos 
    WHERE user_id = user_uuid AND video_id = video_uuid
  ) INTO is_liked;
  
  IF is_liked THEN
    -- Unlike the video
    DELETE FROM liked_videos 
    WHERE user_id = user_uuid AND video_id = video_uuid;
    
    -- Decrease like count
    UPDATE videos 
    SET likes = GREATEST(0, likes - 1)
    WHERE id = video_uuid;
    
    RETURN FALSE;
  ELSE
    -- Like the video
    INSERT INTO liked_videos (user_id, video_id)
    VALUES (user_uuid, video_uuid)
    ON CONFLICT (user_id, video_id) DO NOTHING;
    
    -- Increase like count
    UPDATE videos 
    SET likes = likes + 1
    WHERE id = video_uuid;
    
    RETURN TRUE;
  END IF;
END;
$$;
