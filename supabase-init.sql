-- Supabase Initial Migration: Email Client Schema

-- 1. users (reference to auth.users, but for profile info)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 2. threads
create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  subject text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. emails
create table if not exists emails (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references threads(id) on delete set null,
  sender_id uuid references users(id) on delete set null,
  from_email text,
  to_emails text[],
  cc_emails text[],
  bcc_emails text[],
  subject text,
  body text,
  html_body text,
  sent_at timestamp with time zone,
  is_draft boolean default false,
  in_reply_to uuid references emails(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- 4. email_status (per-user mailbox/folder info)
create table if not exists email_status (
  id uuid primary key default gen_random_uuid(),
  email_id uuid references emails(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  folder text check (folder in ('inbox','sent','drafts','trash','spam','archive','custom')),
  is_read boolean default false,
  is_starred boolean default false,
  is_deleted boolean default false,
  is_spam boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. labels
create table if not exists labels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text,
  color text,
  created_at timestamp with time zone default now()
);

-- 6. email_labels (many-to-many)
create table if not exists email_labels (
  id uuid primary key default gen_random_uuid(),
  email_id uuid references emails(id) on delete cascade,
  label_id uuid references labels(id) on delete cascade
);

-- 7. attachments
create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  email_id uuid references emails(id) on delete cascade,
  file_url text,
  file_name text,
  file_type text,
  file_size integer,
  uploaded_at timestamp with time zone default now()
);
