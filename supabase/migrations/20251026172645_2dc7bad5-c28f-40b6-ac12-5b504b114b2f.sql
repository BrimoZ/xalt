-- Create storage bucket for token images
insert into storage.buckets (id, name, public)
values ('token-images', 'token-images', true)
on conflict (id) do nothing;

-- Create storage policies for token images
create policy "Token images are publicly accessible"
on storage.objects for select
using (bucket_id = 'token-images');

create policy "Authenticated users can upload token images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'token-images');

create policy "Users can update their token images"
on storage.objects for update
to authenticated
using (bucket_id = 'token-images');