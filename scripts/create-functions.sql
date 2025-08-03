-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update video views
CREATE OR REPLACE FUNCTION public.increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET views = views + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get video with user info
CREATE OR REPLACE FUNCTION public.get_video_with_user(video_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  views INTEGER,
  likes INTEGER,
  is_public BOOLEAN,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  user_id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.description,
    v.video_url,
    v.thumbnail_url,
    v.duration,
    v.views,
    v.likes,
    v.is_public,
    v.tags,
    v.created_at,
    v.user_id,
    p.username,
    p.full_name,
    p.avatar_url
  FROM videos v
  JOIN profiles p ON v.user_id = p.id
  WHERE v.id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
