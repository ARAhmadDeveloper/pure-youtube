-- First, let's check and fix the comment_count column
ALTER TABLE videos ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Update the increment_video_views function to be more robust
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET views = views + 1,
      updated_at = NOW()
  WHERE id = video_id;
  
  -- Log the update for debugging
  RAISE NOTICE 'Updated views for video %', video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a more robust function to update video statistics
CREATE OR REPLACE FUNCTION update_video_stats()
RETURNS TRIGGER AS $$
DECLARE
  target_video_id UUID;
BEGIN
  -- Get the video_id from either NEW or OLD record
  target_video_id := COALESCE(NEW.video_id, OLD.video_id);
  
  -- Update likes count
  UPDATE videos 
  SET likes = (
    SELECT COUNT(*) 
    FROM video_likes 
    WHERE video_id = target_video_id
  ),
  updated_at = NOW()
  WHERE id = target_video_id;
  
  RAISE NOTICE 'Updated likes for video %', target_video_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update comment count
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
DECLARE
  target_video_id UUID;
BEGIN
  -- Get the video_id from either NEW or OLD record
  target_video_id := COALESCE(NEW.video_id, OLD.video_id);
  
  -- Update comment count
  UPDATE videos 
  SET comment_count = (
    SELECT COUNT(*) 
    FROM comments 
    WHERE video_id = target_video_id
  ),
  updated_at = NOW()
  WHERE id = target_video_id;
  
  RAISE NOTICE 'Updated comment count for video %', target_video_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers and recreate them
DROP TRIGGER IF EXISTS trigger_update_video_likes ON video_likes;
DROP TRIGGER IF EXISTS trigger_update_comment_count ON comments;

-- Create triggers
CREATE TRIGGER trigger_update_video_likes
  AFTER INSERT OR DELETE ON video_likes
  FOR EACH ROW EXECUTE FUNCTION update_video_stats();

CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- Manually update all existing video stats to current values
UPDATE videos SET 
  likes = COALESCE((SELECT COUNT(*) FROM video_likes WHERE video_id = videos.id), 0),
  comment_count = COALESCE((SELECT COUNT(*) FROM comments WHERE video_id = videos.id), 0),
  updated_at = NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id_count ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id_count ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_stats ON videos(views, likes, comment_count);

-- Add some debug data to verify the system works
-- (This will show current counts)
SELECT 
  v.id,
  v.title,
  v.views,
  v.likes,
  v.comment_count,
  (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id) as actual_likes,
  (SELECT COUNT(*) FROM comments WHERE video_id = v.id) as actual_comments
FROM videos v
ORDER BY v.created_at DESC
LIMIT 10;
