-- Add comment_count column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Create function to update video statistics
CREATE OR REPLACE FUNCTION update_video_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update likes count
  UPDATE videos 
  SET likes = (
    SELECT COUNT(*) 
    FROM video_likes 
    WHERE video_id = COALESCE(NEW.video_id, OLD.video_id)
  )
  WHERE id = COALESCE(NEW.video_id, OLD.video_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update comment count
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update comment count
  UPDATE videos 
  SET comment_count = (
    SELECT COUNT(*) 
    FROM comments 
    WHERE video_id = COALESCE(NEW.video_id, OLD.video_id)
  )
  WHERE id = COALESCE(NEW.video_id, OLD.video_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically update stats
DROP TRIGGER IF EXISTS trigger_update_video_likes ON video_likes;
CREATE TRIGGER trigger_update_video_likes
  AFTER INSERT OR DELETE ON video_likes
  FOR EACH ROW EXECUTE FUNCTION update_video_stats();

DROP TRIGGER IF EXISTS trigger_update_comment_count ON comments;
CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- Update existing video stats
UPDATE videos SET 
  likes = (SELECT COUNT(*) FROM video_likes WHERE video_id = videos.id),
  comment_count = (SELECT COUNT(*) FROM comments WHERE video_id = videos.id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id_count ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id_count ON comments(video_id);
