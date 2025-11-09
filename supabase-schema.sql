-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Posts table
create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  content text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster queries
create index posts_user_id_idx on posts(user_id);
create index posts_status_idx on posts(status);
create index posts_slug_idx on posts(slug);
create index posts_created_at_idx on posts(created_at desc);

-- Row Level Security (RLS) policies
alter table posts enable row level security;

-- Users can view all published posts
create policy "Published posts are viewable by everyone"
  on posts for select
  using (status = 'published');

-- Users can view their own posts regardless of status
create policy "Users can view their own posts"
  on posts for select
  using (auth.uid() = user_id);

-- Users can insert their own posts
create policy "Users can create their own posts"
  on posts for insert
  with check (auth.uid() = user_id);

-- Users can update their own posts
create policy "Users can update their own posts"
  on posts for update
  using (auth.uid() = user_id);

-- Users can delete their own posts
create policy "Users can delete their own posts"
  on posts for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_posts_updated_at
  before update on posts
  for each row
  execute function update_updated_at_column();
