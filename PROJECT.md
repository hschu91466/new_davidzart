# Project: DavidZart Admin Interface

**Status:** In Progress (Core Complete, User Management Complete, UI Expansion Ongoing)  
**Last Updated:** June 2026  
**Repository:** [new_davidzart](https://github.com/hschu91466/new_davidzart)

---

## 🎯 Project Goal

Provide a secure admin interface for managing site content, including user access, comment moderation, and future content tools, using a fully integrated authentication and session system.

---

## 📋 Current Status Overview

### ✅ Core Systems Complete

- **Authentication System** — Session-based, fully functional
- **User Management** — Approval workflow, role-based access control
- **Comment System** — Integrated with auth, moderation tools active
- **Image Storage** — Cloudflare R2 + CDN ready for uploads
- **Backend Architecture** — Controllers, models, and API structure validated

### ⚠️ In Progress

- Admin dashboard UI polish (layout, navigation)
- Image upload workflow & UI
- Gallery metadata management
- Admin UX refinements (loading states, feedback, transitions)

### 🔄 Next 3 Actions (Priority)

1. Add image upload UI (connect to existing R2 backend)
2. Build gallery management tools (create/edit metadata)
3. Improve admin UX (loading states, confirmations, transitions)

---

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend:** React (primary UI)
- **Backend:** PHP (API only)
- **Database:** MySQL (auth, users, comments, galleries)
- **Storage:** Cloudflare R2 + CDN (images)
- **Package Manager:** Composer (PHP dependencies)

### Project Structure

```
new_davidzart/
├── app/                          # Core application code
│   ├── config/
│   │   ├── bootstrap.php        # App initialization
│   │   ├── config.php           # Settings & constants
│   │   └── database.php         # DB connection
│   ├── controllers/
│   │   ├── AuthController.php   # User auth endpoints
│   │   ├── GalleryApiController.php
│   │   └── HomeController.php
│   ├── models/
│   │   ├── GalleryModel.php
│   │   ├── ImageModel.php
│   │   └── UserModel.php
│   ├── routes/
│   │   ├── Router.php
│   │   └── web.php              # Route definitions
│   └── includes/
│       ├── helper.php           # Utilities (build_image_url, etc)
│       ├── header.php
│       ├── footer.php
│       └── nav.php
│
├── public/                       # Web root
│   ├── api/                     # JSON API endpoints
│   │   ├── auth/
│   │   │   ├── login.php
│   │   │   ├── logout.php
│   │   │   ├── register.php
│   │   │   └── me.php          # Get current user
│   │   ├── comment/
│   │   │   ├── create.php
│   │   │   └── list.php
│   │   ├── galleries.php
│   │   ├── gallery-images.php
│   │   └── home-images.php
│   ├── react/                   # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── GalleryCard.jsx
│   │   │   │   ├── GalleryGrid.jsx
│   │   │   │   ├── forms/
│   │   │   │   └── comments/
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Galleries.jsx
│   │   │   │   └── GalleryDetail.jsx
│   │   │   ├── services/
│   │   │   │   ├── auth.js
│   │   │   │   ├── axios.js
│   │   │   │   └── comments.js
│   │   │   ├── context/
│   │   │   │   └── AuthContext.jsx
│   │   │   ├── config/
│   │   │   │   └── config.js    # BASE_URL + CDN_BASE
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── .htaccess
│   │   └── httpd.conf
│   └── api/ files (above)
│
├── vendor/                       # Composer dependencies
├── .env                         # Environment variables
├── composer.json
├── composer.lock
├── README.md
└── .gitignore
```

### Data Flow

```
React Frontend
    ↓
Axios + AuthContext
    ↓
PHP API Endpoints (/api/*)
    ↓
Controllers → Models → Database
    ↓
JSON Response ← helper functions (build_image_url)
    ↓
Frontend renders + CDN serves images
    ↓
Cloudflare R2 (image storage)
```

### Key Design Decisions

| Component    | Implementation  | Reason                                                       |
| ------------ | --------------- | ------------------------------------------------------------ |
| **UI**       | React (SPAs)    | Modern, component-based, interactive                         |
| **Backend**  | PHP (API-only)  | Lightweight, existing skills, perfect for small/medium sites |
| **Sessions** | PHP `$_SESSION` | Stateful, simple to implement, cross-request persistence     |
| **Images**   | R2 + CDN        | Scalable, fast delivery, decouples from main server          |
| **Database** | MySQL           | Stores metadata only, images served from CDN                 |

---

## ✅ What's Complete & Tested

### Authentication System

- ✅ Session-based auth fully implemented
  - Login, logout, register endpoints working
  - Sessions persist across page refresh
  - `/api/auth/me.php` correctly restores user on load
- ✅ Frontend auth flow complete
  - AuthContext loads user on app mount
  - User state synced with backend
  - Login state reflected in UI
- ✅ Session structure standardized
  - Uses `$_SESSION['user']` consistently
  - Legacy keys removed (no more `user_id`, `role`, `is_admin` at root)

### User Management & Access Control

- ✅ Role-based access control (RBAC)
  - `require_admin()` protects admin endpoints
  - Unauthorized users get 403 responses
- ✅ User approval workflow
  - New users register with `is_approved = 0`
  - Login blocked for unapproved users
  - Admin Users page: Pending / Approved tabs
  - Approve/reject (delete) functionality working
  - User lifecycle fully controlled by admin

### Comment System

- ✅ Fully integrated with auth
  - Logged-in users: comments auto-approved
  - Guests: comments require moderation
- ✅ Admin moderation tools
  - Approve, delete, mark as spam functions
  - Comment moderation UI complete

### Backend Architecture

- ✅ Controllers, models, APIs aligned
- ✅ Consistent JSON API response structure
- ✅ Clean separation of concerns

### Image System

- ✅ Cloudflare R2 + CDN functional
- ✅ Backend architecture prepared for upload integration
  - `build_image_url()` generates correct CDN paths
  - Image metadata stored in database
  - R2 bucket structure: `sites/davidzart/images/galleries/gXXX/filename.jpg`

---

## ⚠️ What's In Progress

1. **Admin Dashboard UI Polish**
   - Current layout works but needs refinement
   - Navigation could be clearer
   - Visual hierarchy improvements

2. **Image Upload Workflow**
   - Backend R2 integration ready
   - Frontend UI for uploads not yet built
   - Need to connect React form → PHP upload endpoint

3. **Gallery Metadata Management**
   - Create/edit gallery metadata UI needed
   - Gallery detail editing
   - Image reordering/management

4. **Admin UX Polish**
   - Loading states during actions
   - Success/error feedback messages
   - Smooth transitions and animations
   - Form validation feedback

---

## 🔄 Development Roadmap

### Phase 1: Quick Wins ⚡ (Easy, High Value)

_Est. 2–3 sessions_

- [ ] Improve post-registration flow
  - Redirect user after registration (login or confirmation page)
  - Display "Awaiting approval" message clearly
- [ ] Add confirm password field to registration form
  - Validate matching passwords client-side
  - Clear error feedback
- [ ] Auto-refresh or update UI after actions
  - Comments list updates without page reload
  - User list updates after approve/reject

### Phase 2: Image Upload & Gallery Management ⚙️ (Medium Effort)

_Est. 1–2 weeks_

- [ ] Image upload UI
  - Build form in React (drag-and-drop optional)
  - Connect to PHP endpoint
  - Upload to R2 + store metadata in DB
  - Show upload progress
- [ ] Gallery management tools
  - Create new gallery UI
  - Edit gallery metadata (title, description, order)
  - Image reordering within galleries
  - Delete gallery/images

### Phase 3: Admin UX Refinements 🎨 (Medium Effort)

_Est. 3–5 days_

- [ ] Loading states
  - Spinners during API calls
  - Disabled buttons while loading
- [ ] Confirmation dialogs
  - Confirm before deleting users/comments/galleries
- [ ] Success/error toasts
  - Clear feedback on actions
- [ ] Form validation
  - Real-time validation feedback
  - Clear error messages

### Phase 4: Advanced Features 🚀 (Larger Effort)

_Next phase_

#### 4a: Password Reset

- [ ] Password reset form
- [ ] Token-based reset flow (email verification)
- [ ] Secure password update endpoint

#### 4b: Enhanced User Management

- [ ] User activity tracking (login history)
- [ ] Last login display
- [ ] User deactivation (soft delete)

#### 4c: Rotating Content System

- Phase 1: Frontend-based rotation (client JS)
- Phase 2: Database-driven content
- Phase 3: Admin-managed rotating content
- _Design goal: Reusable across multiple sites_

#### 4d: Email Notifications

- [ ] New user registration notification → admin
- [ ] Account pending approval notification → user
- [ ] Comment moderation notification → admin
- _Requires email service integration (SMTP or API provider)_

#### 4e: Site Content Management

- [ ] Editable home page banner text
- [ ] Dynamic meta tags/SEO fields
- [ ] Site-wide settings admin panel

---

## 📊 API Reference

### Authentication Endpoints

```
POST   /api/auth/register.php     → Create account
POST   /api/auth/login.php        → Authenticate
POST   /api/auth/logout.php       → Destroy session
GET    /api/auth/me.php           → Get current user
```

### User Management Endpoints (Admin Only)

```
GET    /api/users.php             → List all users
PATCH  /api/users/{id}/approve.php → Approve user
DELETE /api/users/{id}.php        → Reject/delete user
```

### Comment Endpoints

```
POST   /api/comment/create.php    → Create comment
GET    /api/comment/list.php      → Get comments
PATCH  /api/comment/{id}/approve.php → Approve
DELETE /api/comment/{id}.php      → Delete
```

### Gallery Endpoints

```
GET    /api/galleries.php         → List galleries
GET    /api/gallery-images.php    → Get images for gallery
GET    /api/home-images.php       → Get home page images
```

**Response Format (all endpoints):**

```json
{
  "success": true,
  "message": "Action completed",
  "data": {}
}
```

---

## 🔐 Security Checklist

- ✅ Session-based auth (server-side state)
- ✅ RBAC (`require_admin()` guard)
- ✅ Password hashing (PHP `password_hash`)
- ✅ CSRF protection (if using forms)
- ✅ SQL injection prevention (parameterized queries assumed)
- ⚠️ **TODO:** Validate all user inputs (sanitize/escape)
- ⚠️ **TODO:** Rate limiting on auth endpoints
- ⚠️ **TODO:** CORS headers (if frontend on different domain)

---

## 🛠️ Local Development Setup

```bash
# 1. Clone repo
git clone https://github.com/hschu91466/new_davidzart.git
cd new_davidzart

# 2. Install PHP dependencies
composer install

# 3. Set up environment
cp .env.example .env
# Edit .env with database credentials, R2 config, etc

# 4. Run migrations (if any)
# php migrate.php

# 5. Serve locally
# Option A: Built-in PHP server
php -S localhost:8000 -t public/

# Option B: Apache + .htaccess (configured)
# Configure virtual host to point to public/

# 6. Build React (if using bundler)
cd public/react
npm install
npm run dev  # or npm run build
```

---

## 📝 Notes & Known Issues

- **React Hot Reload:** If using Vite/similar, configure HMR in `public/react/config.js`
- **CORS:** If React on different port, ensure PHP sends correct headers
- **Session Domain:** Verify `.env` session settings match deployment domain
- **Image Paths:** `build_image_url()` uses `CDN_BASE` from config—update for production
- **Database Migrations:** Consider adding migration system for schema updates

---

## 🚀 Deployment Checklist

- [ ] Set production `.env` values (database, R2 keys, CDN URL)
- [ ] Run tests (unit tests for critical paths)
- [ ] Build React for production (`npm run build`)
- [ ] Set up error logging (log auth failures, API errors)
- [ ] Configure backups (database, R2 bucket)
- [ ] Set CORS headers for API security
- [ ] Enable HTTPS (redirect HTTP → HTTPS)
- [ ] Set secure session cookies (`secure`, `httponly`, `samesite`)

---

## 📚 Resources & References

- **PHP Framework:** Custom (MVC-inspired, no framework)
- **React:** React 18+ with Hooks
- **Database:** MySQL/MariaDB
- **Image Storage:** Cloudflare R2 API
- **Authentication:** PHP Sessions (built-in)

---

## 👤 Contributors

- [@hschu91466](https://github.com/hschu91466)

---

## 📞 Questions or Updates?

As the project evolves:

1. Update the **"Current Status Overview"** section at the top
2. Move completed items from "In Progress" to "✅ What's Complete"
3. Update the **roadmap** as priorities shift
4. Commit changes to git (keeps history of project evolution)

---

_Last synchronized with GitHub: June 2026_
