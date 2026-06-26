# Email Client with Resend, Supabase, Next.js, and Vercel

## Overview
A Gmail-like email client using:
- **Frontend & Backend:** Next.js (API routes for backend logic)
- **Database & Storage:** Supabase (Postgres + file storage)
- **Email:** Resend API (send/receive)
- **Deployment:** Vercel

---

## Implementation Plan

### 1. Project Setup
- Initialize Next.js app (TypeScript recommended)
- Set up Supabase project (DB + storage)
- Configure environment variables for Resend and Supabase

### 2. Authentication
- Use Supabase Auth for user registration, login, password reset
- Protect API routes and pages

### 3. Email Sending (Resend API)
- Create Next.js API route for sending emails via Resend
- Support attachments (upload to Supabase Storage, include links in emails)
- Save sent emails to Supabase

### 4. Email Receiving (Resend Inbound)
- Set up Next.js API route as webhook endpoint for Resend inbound emails
- Parse and store incoming emails and attachments in Supabase

### 5. Mailbox Management
- Store emails, threads, folders (Inbox, Sent, Drafts, Trash, Spam, Labels) in Supabase
- Implement actions: mark as read/unread, star, move, delete, restore, label
- Support threading (group by conversation)

### 6. Search & Filters
- Implement search (sender, subject, content, label)
- Filters for unread, starred, attachments, etc.

### 7. UI/UX (Next.js Pages/Components)
- Auth pages (login, register, reset)
- Mailbox views (Inbox, Sent, Drafts, Trash, Spam, Labels)
- Email view (threaded, attachments, actions)
- Compose email (rich text, attachments)
- Search and filter UI
- Real-time updates (Supabase subscriptions or polling)

### 8. Deployment
- Deploy to Vercel
- Configure environment variables/secrets
- Set up custom domain, HTTPS

### 9. Testing & QA
- Unit and integration tests for API routes and components
- End-to-end tests for core flows

---

## Next Steps
1. Scaffold Next.js app and connect to Supabase
2. Set up Resend API integration
3. Implement authentication
4. Build mailbox and email features
5. Deploy to Vercel

---

# Environment Variables Example

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key
RESEND_DOMAIN=your-verified-domain.com

# App
NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
```

- `NEXT_PUBLIC_` variables are exposed to the browser (safe for public keys/URLs).
- `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` should only be used server-side (API routes).
- Adjust/add variables as needed for additional features.
