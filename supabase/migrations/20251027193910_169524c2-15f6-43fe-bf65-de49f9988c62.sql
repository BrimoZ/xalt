-- Add images array column to tokens table
ALTER TABLE tokens ADD COLUMN images text[] DEFAULT '{}';

-- Copy existing image_url to images array (if not null)
UPDATE tokens SET images = ARRAY[image_url] WHERE image_url IS NOT NULL;

-- Keep image_url for backward compatibility but make it generated from images array
-- We'll handle this in the application layer