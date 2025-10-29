-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the reward distribution function to run every 5 minutes
SELECT cron.schedule(
  'distribute-staking-rewards',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://lprckedqkmygimsqbeih.supabase.co/functions/v1/distribute-rewards',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcmNrZWRxa215Z2ltc3FiZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0Njk4NzIsImV4cCI6MjA3NzA0NTg3Mn0.gB6CJh9yvULSoARGbxmg9HMjxAswXxTNT99fWPXhUqQ"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);