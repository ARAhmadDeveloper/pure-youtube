-- Check if videos exist in the database
SELECT 
  v.id,
  v.title,
  v.user_id,
  v.is_public,
  v.created_at,
  p.username
FROM videos v
LEFT JOIN profiles p ON v.user_id = p.id
ORDER BY v.created_at DESC;

-- Check if profiles exist
SELECT id, username, full_name FROM profiles;

-- Check storage buckets
SELECT * FROM storage.buckets WHERE id IN ('videos', 'thumbnails');

-- Check storage objects
SELECT 
  name,
  bucket_id,
  created_at,
  metadata
FROM storage.objects 
WHERE bucket_id IN ('videos', 'thumbnails')
ORDER BY created_at DESC;
