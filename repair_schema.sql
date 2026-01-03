-- FIX: Allow users to insert their own profile to enable self-healing
-- Run this in your Supabase SQL Editor to fix the 403 Forbidden error

CREATE POLICY "Users can insert their own profile" 
    ON public.users FOR INSERT 
    WITH CHECK (auth.uid() = id);
