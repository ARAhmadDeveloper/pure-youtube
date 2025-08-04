-- Drop existing watch_later table if it exists to recreate with proper relationships
DROP TABLE IF EXISTS watch_later CASCADE;
DROP TABLE IF EXISTS video_likes CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Create watch_later table if it doesn't exist
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

-- Enable RLS (Row Level Security)
ALTER TABLE watch_later ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own watch later videos" ON watch_later
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch later videos" ON watch_later
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch later videos" ON watch_later
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON watch_later TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create video_likes table
CREATE TABLE video_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL,
  is_like BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Add foreign key constraints for video_likes
ALTER TABLE video_likes 
ADD CONSTRAINT fk_video_likes_user 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE video_likes 
ADD CONSTRAINT fk_video_likes_video 
FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL,
  channel_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscriber_id, channel_id)
);

-- Add foreign key constraints for subscriptions
ALTER TABLE subscriptions 
ADD CONSTRAINT fk_subscriptions_subscriber 
FOREIGN KEY (subscriber_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE subscriptions 
ADD CONSTRAINT fk_subscriptions_channel 
FOREIGN KEY (channel_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS for new tables
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for video_likes
CREATE POLICY "Users can view all video likes" ON video_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own video likes" ON video_likes
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view all subscriptions" ON subscriptions
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = subscriber_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_channel_id ON subscriptions(channel_id);

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
