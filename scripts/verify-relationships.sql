-- Let's verify all our table relationships are correct
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('comments', 'videos', 'video_likes', 'subscriptions')
ORDER BY tc.table_name, tc.constraint_name;

-- Check if we have any existing comments data
SELECT COUNT(*) as comment_count FROM comments;

-- Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test the relationship with a sample query
SELECT 
  c.id,
  c.content,
  c.created_at,
  p.username,
  p.avatar_url
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id
LIMIT 5;
