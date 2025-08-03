-- Create function to get trending statistics
CREATE OR REPLACE FUNCTION get_trending_stats(time_period text DEFAULT '24h')
RETURNS TABLE (
  total_videos bigint,
  total_views bigint,
  total_likes bigint,
  total_comments bigint,
  avg_engagement_rate numeric
) AS $$
DECLARE
  time_filter timestamp;
BEGIN
  -- Set time filter based on period
  CASE time_period
    WHEN '1h' THEN time_filter := NOW() - INTERVAL '1 hour';
    WHEN '24h' THEN time_filter := NOW() - INTERVAL '24 hours';
    WHEN '7d' THEN time_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN time_filter := NOW() - INTERVAL '30 days';
    ELSE time_filter := NOW() - INTERVAL '24 hours';
  END CASE;

  RETURN QUERY
  SELECT 
    COUNT(v.id) as total_videos,
    COALESCE(SUM(v.view_count), 0) as total_views,
    COALESCE(SUM(v.like_count), 0) as total_likes,
    COALESCE(SUM(v.comment_count), 0) as total_comments,
    CASE 
      WHEN SUM(v.view_count) > 0 THEN 
        ROUND((SUM(v.like_count) + SUM(v.comment_count))::numeric / SUM(v.view_count) * 100, 2)
      ELSE 0
    END as avg_engagement_rate
  FROM videos v
  WHERE v.created_at >= time_filter;
END;
$$ LANGUAGE plpgsql;

-- Create function to get trending videos with scoring
CREATE OR REPLACE FUNCTION get_trending_videos(
  time_period text DEFAULT '24h',
  sort_by text DEFAULT 'trending_score',
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  thumbnail_url text,
  video_url text,
  duration integer,
  view_count integer,
  like_count integer,
  comment_count integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  user_id uuid,
  username text,
  avatar_url text,
  trending_score numeric,
  engagement_rate numeric
) AS $$
DECLARE
  time_filter timestamp;
  decay_factor numeric := 0.8;
BEGIN
  -- Set time filter based on period
  CASE time_period
    WHEN '1h' THEN time_filter := NOW() - INTERVAL '1 hour';
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
    v.view_count,
    v.like_count,
    v.comment_count,
    v.created_at,
    v.updated_at,
    v.user_id,
    p.username,
    p.avatar_url,
    -- Trending score calculation
    ROUND(
      (
        (v.view_count * 1.0) + 
        (v.like_count * 3.0) + 
        (v.comment_count * 5.0)
      ) * 
      POWER(decay_factor, EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 3600.0)
    , 2) as trending_score,
    -- Engagement rate calculation
    CASE 
      WHEN v.view_count > 0 THEN 
        ROUND((v.like_count + v.comment_count)::numeric / v.view_count * 100, 2)
      ELSE 0
    END as engagement_rate
  FROM videos v
  JOIN profiles p ON v.user_id = p.id
  WHERE v.created_at >= time_filter
  ORDER BY 
    CASE 
      WHEN sort_by = 'trending_score' THEN 
        (
          (v.view_count * 1.0) + 
          (v.like_count * 3.0) + 
          (v.comment_count * 5.0)
        ) * 
        POWER(decay_factor, EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 3600.0)
      WHEN sort_by = 'views' THEN v.view_count::numeric
      WHEN sort_by = 'likes' THEN v.like_count::numeric
      WHEN sort_by = 'comments' THEN v.comment_count::numeric
      WHEN sort_by = 'recent' THEN EXTRACT(EPOCH FROM v.created_at)
      ELSE 
        (
          (v.view_count * 1.0) + 
          (v.like_count * 3.0) + 
          (v.comment_count * 5.0)
        ) * 
        POWER(decay_factor, EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 3600.0)
    END DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
