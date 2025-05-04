# 🛒 GottaGrab — Real-Time Shared Shopping Lists

A polished, full-stack shopping list app built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Supabase**.  
GottaGrab allows multiple users to create and collaborate on shared shopping lists with live updates, intuitive UX, and customizable themes.

---

## 🚀 Features

- **🔐 Authentication**  
  Secure sign-in with Supabase Auth (email/password + optional OAuth).

- **📝 Custom Lists**  
  Create, rename, and delete lists with personalized icons and Tailwind-based color themes.

- **👥 Real-Time Collaboration**  
  Users see live updates on item additions/deletions through Supabase Realtime channels.

- **📨 Invite System**  
  Invite any registered user by email to collaborate on a list. Pending invites can be accepted or declined.

- **📦 Autofill + Theming**  
  Smart item suggestions via an autocomplete field and curated list of grocery staples. Choose from a variety of Lucide icons and color palettes.

- **🎨 Clean, Responsive UI**  
  Built mobile-first with transitions, modals, and smooth animations via Framer Motion.

---

## 🛠 Tech Stack

- **Frontend:**  
  - Next.js 14 App Router (TypeScript)  
  - Tailwind CSS (JIT)  
  - Framer Motion  
  - Lucide React Icons  
  - React Hot Toast

- **Backend:**  
  - Supabase (PostgreSQL)  
  - Realtime (WebSockets)  
  - Row Level Security  
  - SQL Views & Stored Procedures  

---

## 🧠 Database Schema

### 📂 `lists`
- Stores core list metadata.
| Column       | Type    | Description                        |
|--------------|---------|------------------------------------|
| `id`         | UUID    | Primary key                        |
| `name`       | Text    | List name                          |
| `icon`       | Text    | Lucide icon identifier             |
| `icon_color` | Text    | Tailwind-compatible hex color      |
| `owner_id`   | UUID    | FK to `auth.users`                 |

### 🛒 `list_items`
- Represents items in each list.
| Column       | Type       | Description                     |
|--------------|------------|---------------------------------|
| `id`         | Serial     | Primary key                     |
| `list_id`    | UUID       | FK to `lists.id`                |
| `name`       | Text       | Grocery item name               |
| `created_by` | UUID       | FK to `auth.users.id`           |
| `created_at` | Timestamp  | Auto-generated timestamp        |

### ✉️ `list_invites`
- Tracks pending email-based list invites.
| Column       | Type    | Description                      |
|--------------|---------|----------------------------------|
| `id`         | UUID    | Primary key                      |
| `list_id`    | UUID    | FK to `lists.id`                 |
| `email`      | Text    | Invitee's email                  |
| `invited_by` | UUID    | FK to `auth.users.id`            |

---

### `view_pending_invites` (View)
- A flat join of invite + inviter + list metadata to simplify frontend rendering.
- Used for invite previews and management.
```sql
CREATE VIEW public.view_pending_invites AS
SELECT
  li.id,
  li.list_id,
  li.email           AS invitee_email,
  li.invited_by,
  u.email            AS invited_by_email,
  l.name             AS list_name,
  l.icon             AS list_icon,
  l.icon_color       AS list_color
FROM public.list_invites AS li
JOIN auth.users           AS u ON u.id = li.invited_by
JOIN public.lists         AS l ON l.id = li.list_id;

GRANT SELECT ON public.view_pending_invites TO anon, authenticated;
```
---

## 📂 Deployment

This is a complete, full-stack project built with Supabase and deployed via Vercel.  

---

## 💡 Future Enhancements

- Push notifications for list updates  
- Offline-first caching with optimistic sync  
- Role-based permissions (e.g., viewer vs editor)  
- Custom categories (e.g., produce, frozen, pantry)  
- Internationalization support  

---

## 🧾 License

MIT © 2025 Aanand Aggarwal
