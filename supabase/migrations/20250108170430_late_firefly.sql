/*
  # Initial Schema Setup for SignEase

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to auth.users
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `translations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `source_text` (text)
      - `translated_text` (text)
      - `source_type` (text) - 'video' or 'text'
      - `created_at` (timestamp)
      - `status` (text) - 'pending', 'completed', 'failed'
    
    - `feedback`
      - `id` (uuid, primary key)
      - `translation_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users Table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Translations Table
CREATE TABLE translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  source_text text NOT NULL,
  translated_text text,
  source_type text NOT NULL CHECK (source_type IN ('video', 'text')),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed'))
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own translations"
  ON translations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create translations"
  ON translations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Feedback Table
CREATE TABLE feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id uuid REFERENCES translations(id),
  user_id uuid REFERENCES users(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Indexes
CREATE INDEX translations_user_id_idx ON translations(user_id);
CREATE INDEX feedback_translation_id_idx ON feedback(translation_id);
CREATE INDEX feedback_user_id_idx ON feedback(user_id);