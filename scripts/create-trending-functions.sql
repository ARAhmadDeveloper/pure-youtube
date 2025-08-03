-- Create function to calculate trending score
CREATE OR REPLACE FUNCTION calculate_trending_score(
  views_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) RETURNS DECIMAL AS $$
DECLARE
  hours_since_creation DECIMAL;
  view_score DECIMAL;
  engagement_score DECIMAL;
  time_decay DECIMAL;
  final_score DECIMAL;
BEGIN
  -- Calculate hours since creation
  hours_since_creation := EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600;
  
  -- Prevent division by zero and set minimum time
  IF hours_since_creation < 1 THEN
    hours_since_creation := 1;
  END IF;
  
  -- Calculate view score (logarithmic to prevent dominance of viral videos)
  view_score := LOG(GREATEST(views_count, 1)) * 10;
  
  -- Calculate engagement score (likes and comments weighted)
  engagement_score := (likes_count * 2) + (comments_count * 3);
  
  -- Time decay factor (newer content gets higher score)
  time_decay := 1 / POWER(hours_since_creation, 0.8);
  
  -- Final trending score
  final_score := (view_score + engagement_score) * time_decay;
  
  RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Create function to get trending videos
CREATE OR REPLACE FUNCTION get_trending_videos(
  time_period TEXT DEFAULT '24h',
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration INTEGER,
  views_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  trending_score DECIMAL
) AS $$
DECLARE
  time_filter TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Set time filter based on period
  CASE time_period
    WHEN '1h' THEN time_filter := NOW() - INTERVAL '1 hour';
    WHEN '6h' THEN time_filter := NOW() - INTERVAL '6 hours';
    WHEN '24h' THEN time_filter := NOW() - INTERVAL '24 hours';
    WHEN '7d' THEN time_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN time_filter := NOW() - INTERVAL '30 days';
    ELSE time_filter := NOW() - INTERVAL '24 hours';
  END CASE;
  
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.description,
    v.thumbnail_url,
    v.video_url,
    v.duration,
    v.views_count,
    v.likes_count,
    v.comments_count,
    v.created_at,
    v.updated_at,
    v.user_id,
    u.username,
    u.avatar_url,
    calculate_trending_score(v.views_count, v.likes_count, v.comments_count, v.created_at) as trending_score
  FROM videos v
  JOIN users u ON v.user_id = u.id
  WHERE v.created_at >= time_filter
  ORDER BY trending_score DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
