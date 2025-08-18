-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_trending_videos(integer, integer, text, text);
DROP FUNCTION IF EXISTS get_trending_stats(text);

-- Create the get_trending_videos function with correct column references
CREATE OR REPLACE FUNCTION get_trending_videos(
    limit_count integer DEFAULT 20,
    offset_count integer DEFAULT 0,
    sort_by text DEFAULT 'trending_score',
    time_period text DEFAULT 'week'
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    thumbnail_url text,
    video_url text,
    duration integer,
    views_count bigint,
    likes_count bigint,
    comments_count bigint,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    user_id uuid,
    username text,
    avatar_url text,
    trending_score numeric,
    engagement_rate numeric
) AS $$
DECLARE
    time_filter timestamp with time zone;
BEGIN
    -- Set time filter based on period
    CASE time_period
        WHEN 'day' THEN time_filter := NOW() - INTERVAL '1 day';
        WHEN 'week' THEN time_filter := NOW() - INTERVAL '1 week';
        WHEN 'month' THEN time_filter := NOW() - INTERVAL '1 month';
        WHEN 'year' THEN time_filter := NOW() - INTERVAL '1 year';
        ELSE time_filter := NOW() - INTERVAL '1 week';
    END CASE;

    RETURN QUERY
    SELECT 
        v.id,
        v.title,
        v.description,
        v.thumbnail_url,
        v.video_url,
        v.duration,
        COALESCE(v.views, 0)::bigint as views_count,
        COALESCE(v.likes, 0)::bigint as likes_count,
        COALESCE(v.comment_count, 0)::bigint as comments_count,
        v.created_at,
        v.updated_at,
        v.user_id,
        COALESCE(p.username, 'Unknown')::text as username,
        p.avatar_url,
        -- Calculate trending score based on views, likes, and recency
        (
            (COALESCE(v.views, 0) * 1.0) + 
            (COALESCE(v.likes, 0) * 10.0) + 
            (COALESCE(v.comment_count, 0) * 5.0) +
            -- Boost recent videos
            (EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 3600.0 * -0.1)
        )::numeric as trending_score,
        -- Calculate engagement rate
        CASE 
            WHEN COALESCE(v.views, 0) > 0 THEN 
                ((COALESCE(v.likes, 0) + COALESCE(v.comment_count, 0)) * 100.0 / COALESCE(v.views, 1))::numeric
            ELSE 0::numeric
        END as engagement_rate
    FROM videos v
    LEFT JOIN profiles p ON v.user_id = p.id
    WHERE v.created_at >= time_filter
        AND v.is_public = true
    ORDER BY 
        CASE 
            WHEN sort_by = 'trending_score' THEN 
                (
                    (COALESCE(v.views, 0) * 1.0) + 
                    (COALESCE(v.likes, 0) * 10.0) + 
                    (COALESCE(v.comment_count, 0) * 5.0) +
                    (EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 3600.0 * -0.1)
                )
            WHEN sort_by = 'views' THEN COALESCE(v.views, 0)::numeric
            WHEN sort_by = 'likes' THEN COALESCE(v.likes, 0)::numeric
            WHEN sort_by = 'recent' THEN EXTRACT(EPOCH FROM v.created_at)
            ELSE 
                (
                    (COALESCE(v.views, 0) * 1.0) + 
                    (COALESCE(v.likes, 0) * 10.0) + 
                    (COALESCE(v.comment_count, 0) * 5.0) +
                    (EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 3600.0 * -0.1)
                )
        END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create the get_trending_stats function with correct column references
CREATE OR REPLACE FUNCTION get_trending_stats(time_period text DEFAULT 'week')
RETURNS TABLE (
    total_videos bigint,
    total_views bigint,
    total_likes bigint,
    total_comments bigint,
    avg_engagement_rate numeric
) AS $$
DECLARE
    time_filter timestamp with time zone;
BEGIN
    -- Set time filter based on period
    CASE time_period
        WHEN 'day' THEN time_filter := NOW() - INTERVAL '1 day';
        WHEN 'week' THEN time_filter := NOW() - INTERVAL '1 week';
        WHEN 'month' THEN time_filter := NOW() - INTERVAL '1 month';
        WHEN 'year' THEN time_filter := NOW() - INTERVAL '1 year';
        ELSE time_filter := NOW() - INTERVAL '1 week';
    END CASE;

    RETURN QUERY
    SELECT 
        COUNT(*)::bigint as total_videos,
        COALESCE(SUM(v.views), 0)::bigint as total_views,
        COALESCE(SUM(v.likes), 0)::bigint as total_likes,
        COALESCE(SUM(v.comment_count), 0)::bigint as total_comments,
        CASE 
            WHEN COALESCE(SUM(v.views), 0) > 0 THEN 
                (COALESCE(SUM(v.likes + v.comment_count), 0) * 100.0 / COALESCE(SUM(v.views), 1))::numeric
            ELSE 0::numeric
        END as avg_engagement_rate
    FROM videos v
    WHERE v.created_at >= time_filter
        AND v.is_public = true;
END;
$$ LANGUAGE plpgsql;
