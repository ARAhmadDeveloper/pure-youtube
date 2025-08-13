-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS video_likes CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Create video_likes table with proper schema
CREATE TABLE video_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    is_like BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- Create subscriptions table with proper schema
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscriber_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subscriber_id, channel_id),
    CHECK (subscriber_id != channel_id)
);

-- Create indexes for better performance
CREATE INDEX idx_video_likes_user_id ON video_likes(user_id);
CREATE INDEX idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX idx_video_likes_created_at ON video_likes(created_at);

CREATE INDEX idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_channel_id ON subscriptions(channel_id);
CREATE INDEX idx_subscriptions_created_at ON subscriptions(created_at);

-- Enable RLS
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for video_likes
CREATE POLICY "Users can view all video likes" ON video_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own video likes" ON video_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video likes" ON video_likes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video likes" ON video_likes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for subscriptions
CREATE POLICY "Users can view all subscriptions" ON subscriptions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
    FOR DELETE USING (auth.uid() = subscriber_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for video_likes updated_at
CREATE TRIGGER update_video_likes_updated_at
    BEFORE UPDATE ON video_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
