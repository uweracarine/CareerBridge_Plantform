# CareerBridge: Complete System Analysis

## Executive Summary
CareerBridge is a full-stack employment and career development platform connecting students, graduates, job seekers, employers, and administrators in Rwanda. The platform facilitates job/internship discovery, applications, recruitment management, and career development.

---

## 1. SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

### 1.1 Functional Requirements by Module

#### Module 1: Authentication & Account Management
- User registration (Student, Graduate, Job Seeker, Employer)
- Email verification
- Login/Logout with JWT
- Password reset and change
- Session management
- Role-based redirects
- Account activation/deactivation

#### Module 2: Student/Graduate Profile Management
- Profile creation and editing
- Profile photo upload
- Professional headline
- Education history management
- Work experience management
- Skills management
- Certifications and achievements
- CV upload and management
- Profile completion indicator
- Profile preview

#### Module 3: Opportunities Management
- Create, read, update, delete opportunities (by employers)
- Opportunity categories (12+ types)
- Opportunity statuses (Draft, Pending, Published, Closed, Rejected, Expired)
- Admin moderation before publication
- Opportunity details (title, description, responsibilities, requirements, salary, deadline, work arrangement, location)

#### Module 4: Search & Filtering
- Search by title, organization, industry, skills, category, location, education
- Filter by employment type (Full-time, Part-time, Internship, Remote, Onsite, Hybrid)
- Sorting (Recent, Closing soon, Updated, Alphabetical)
- Pagination
- Empty state handling

#### Module 5: Application Management
- Application submission workflow
- Application statuses (Submitted, Under Review, Shortlisted, Interview Scheduled, Assessment, Accepted, Rejected, Withdrawn)
- Prevent duplicate applications
- CV and document upload
- Cover letter submission
- Application history and status tracking
- Withdraw applications

#### Module 6: Employer Dashboard
- Statistics (opportunities, applications, shortlist, rejection)
- Organization profile management
- Opportunity management
- Application management
- Candidate shortlisting
- Messaging
- Reports and analytics

#### Module 7: Student Dashboard
- Welcome message and profile completion
- Recommended opportunities
- Recently published opportunities
- Saved opportunities
- Application status overview
- Upcoming deadlines
- Summary cards

#### Module 8: Training & Career Development
- Training opportunity listings
- Bootcamps
- Internship preparation
- Career guidance articles
- CV resources
- Interview preparation
- Scholarship announcements
- Bookmarking resources

#### Module 9: Notifications
- In-app notifications
- Email notification architecture
- Notification types: registration, email verification, application updates, deadline reminders, messages
- Mark as read/unread
- Unread count tracking

#### Module 10: Messaging System
- Send/receive messages between employers and applicants
- Conversation management
- Message timestamps
- Read status
- Communication restrictions (authorization-based)

#### Module 11: Admin Dashboard
- User management
- Employer verification
- Opportunity moderation
- Category management
- Reports and analytics
- Activity logging
- System settings
- Admin permission management

#### Module 12: Reporting & Analytics
- User registration statistics
- Opportunity metrics
- Application analytics
- Employer activity reports
- CSV/Excel export
- Chart and graph visualization

---

## 2. Non-Functional Requirements

### Performance
- Page load time < 2 seconds
- Search results < 500ms
- API response time < 200ms
- Support 10,000+ concurrent users at launch

### Scalability
- Horizontal scaling for backend
- Database indexing for fast queries
- Caching layer ready
- CDN for static assets

### Security
- Bcrypt/Argon2 password hashing
- JWT-based authentication
- HTTPS only
- CORS properly configured
- SQL injection protection (ORM/parameterized queries)
- XSS protection
- CSRF tokens where applicable
- Rate limiting on sensitive endpoints
- Secure headers (Helmet)
- File upload validation
- Document access authorization
- IDOR prevention
- Audit logging

### Reliability
- 99.5% uptime target
- Automated backups
- Error handling and recovery
- Graceful degradation

### Usability
- Responsive design (Desktop, Tablet, Mobile)
- Mobile-first approach for Rwanda
- Intuitive navigation
- Clear call-to-action buttons
- Loading states
- Toast notifications
- Empty states
- Error states
- Success states

### Maintainability
- Clean code architecture
- Comprehensive documentation
- Organized folder structure
- Reusable components
- Clear naming conventions

---

## 3. System Actors & Use Cases

### Actors
1. **Anonymous User** - Not logged in
2. **Student/Graduate/Job Seeker** - Job applicant
3. **Employer** - Recruiter/Organization
4. **Administrator** - Platform manager
5. **Super Admin** - Full system control

### Key Use Cases

#### Student Use Cases
- UC1: Register as Student
- UC2: Create Professional Profile
- UC3: Upload CV
- UC4: Search Opportunities
- UC5: Filter Opportunities
- UC6: Save Opportunity
- UC7: Apply for Opportunity
- UC8: Track Application Status
- UC9: Withdraw Application
- UC10: Receive Notifications
- UC11: Message Employer
- UC12: View Career Resources
- UC13: Update Profile

#### Employer Use Cases
- UC14: Register as Employer
- UC15: Create Organization Profile
- UC16: Submit Verification Documents
- UC17: Create Opportunity
- UC18: Edit Opportunity
- UC19: Delete Opportunity
- UC20: View Applications
- UC21: Review Applicant Profile
- UC22: Shortlist Candidate
- UC23: Update Application Status
- UC24: Reject Application
- UC25: Message Applicant
- UC26: View Reports
- UC27: Manage Organization Settings

#### Admin Use Cases
- UC28: Login as Admin
- UC29: View Dashboard
- UC30: Manage Users
- UC31: Verify Employer
- UC32: Approve Opportunity
- UC33: Reject Opportunity
- UC34: Suspend User
- UC35: Manage Categories
- UC36: Review Reports
- UC37: Generate Analytics
- UC38: View Activity Logs
- UC39: Manage Admin Accounts

---

## 4. System Architecture

### 4.1 Architecture Pattern: Layered Architecture with MVC

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                      (React + Vite)                          │
│   Pages | Components | Forms | Dashboards | Notifications   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    SERVICE LAYER                             │
│        API Services | Business Logic | State Management      │
└────────────────────┬────────────────────────────────────────┘
                     │ (REST API calls)
┌────────────────────▼────────────────────────────────────────┐
│                    API GATEWAY                               │
│              (Express.js + Middleware)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 APPLICATION LAYER                            │
│    Controllers | Routes | Request Validation | Error Handle │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│        Services | Authorization | Business Rules            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    DATA LAYER                                │
│         Prisma ORM | Data Access Objects | Queries           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  DATABASE LAYER                              │
│                    MySQL Database                            │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS |
| State Management | React Context API + Custom Hooks |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Form Management | React Hook Form |
| Validation | Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| ORM | Prisma |
| Database | MySQL 8.0+ |
| File Upload | Multer |
| Email | Nodemailer (SMTP) |
| API Docs | Swagger/OpenAPI |
| Testing | Jest, Supertest |
| Code Quality | ESLint, Prettier |
| Version Control | Git, GitHub |
| Deployment | Vercel (Frontend), Render (Backend), AWS RDS (DB) |

---

## 5. DATABASE DESIGN & ER DIAGRAM

### 5.1 Core Tables Structure

```
USERS TABLE
├── id (PK)
├── full_name
├── email (UNIQUE)
├── password_hash
├── phone
├── role (ENUM: student, graduate, job_seeker, employer, admin, super_admin)
├── profile_photo
├── email_verified_at
├── account_status (ENUM: active, inactive, suspended)
├── created_at
├── updated_at

STUDENT_PROFILES TABLE
├── id (PK)
├── user_id (FK → users)
├── headline
├── biography
├── date_of_birth
├── gender
├── location
├── linkedin_url
├── github_url
├── portfolio_url
├── profile_completion (0-100)

EDUCATION TABLE
├── id (PK)
├── user_id (FK → users)
├── institution
├── qualification
├── field_of_study
├── start_date
├── end_date
├── description

WORK_EXPERIENCE TABLE
├── id (PK)
├── user_id (FK → users)
├── organization
├── job_title
├── employment_type
├── start_date
├── end_date
├── description

SKILLS TABLE
├── id (PK)
├── skill_name (UNIQUE)
├── category

USER_SKILLS TABLE
├── id (PK)
├── user_id (FK → users)
├── skill_id (FK → skills)
├── proficiency_level (ENUM: beginner, intermediate, advanced, expert)

CERTIFICATIONS TABLE
├── id (PK)
├── user_id (FK → users)
├── certification_name
├── issuing_organization
├── issue_date
├── expiry_date
├── certificate_file

CVS TABLE
├── id (PK)
├── user_id (FK → users)
├── file_name
├── file_path
├── is_default (BOOLEAN)
├── uploaded_at

ORGANIZATIONS TABLE
├── id (PK)
├── owner_user_id (FK → users)
├── organization_name
├── organization_type (ENUM: private, ngo, government, startup, university, training, international)
├── industry
├── description
├── logo
├── website
├── email
├── phone
├── location
├── verification_status (ENUM: pending, verified, rejected)
├── created_at
├── updated_at

ORGANIZATION_DOCUMENTS TABLE
├── id (PK)
├── organization_id (FK → organizations)
├── document_type (ENUM: registration, tax_certificate, business_license)
├── file_path
├── review_status (ENUM: pending, approved, rejected)
├── reviewed_by (FK → users, nullable)
├── reviewed_at

CATEGORIES TABLE
├── id (PK)
├── category_name (UNIQUE)
├── description

OPPORTUNITIES TABLE
├── id (PK)
├── organization_id (FK → organizations)
├── category_id (FK → categories)
├── title
├── slug (UNIQUE)
├── description
├── responsibilities
├── qualifications
├── required_skills
├── location
├── work_arrangement (ENUM: remote, onsite, hybrid)
├── employment_type (ENUM: full_time, part_time, internship, contract, freelance, volunteer)
├── salary_min (DECIMAL, nullable)
├── salary_max (DECIMAL, nullable)
├── currency (ENUM: rwf, usd, eur)
├── application_url
├── application_deadline
├── status (ENUM: draft, pending, published, closed, rejected, expired)
├── approved_by (FK → users, nullable)
├── published_at
├── created_at
├── updated_at

APPLICATIONS TABLE
├── id (PK)
├── opportunity_id (FK → opportunities)
├── applicant_id (FK → users)
├── cv_id (FK → cvs)
├── cover_letter (TEXT)
├── application_status (ENUM: submitted, under_review, shortlisted, interview_scheduled, assessment, accepted, rejected, withdrawn)
├── submitted_at
├── updated_at

APPLICATION_DOCUMENTS TABLE
├── id (PK)
├── application_id (FK → applications)
├── document_name
├── file_path
├── uploaded_at

APPLICATION_STATUS_HISTORY TABLE
├── id (PK)
├── application_id (FK → applications)
├── old_status
├── new_status
├── changed_by (FK → users)
├── notes (TEXT, nullable)
├── changed_at

SAVED_OPPORTUNITIES TABLE
├── id (PK)
├── user_id (FK → users)
├── opportunity_id (FK → opportunities)
├── saved_at

NOTIFICATIONS TABLE
├── id (PK)
├── user_id (FK → users)
├── title
├── message
├── notification_type (ENUM: registration, verification, application, message, deadline, opportunity, admin)
├── is_read (BOOLEAN)
├── created_at

CONVERSATIONS TABLE
├── id (PK)
├── opportunity_id (FK → opportunities)
├── employer_id (FK → users)
├── applicant_id (FK → users)
├── created_at

MESSAGES TABLE
├── id (PK)
├── conversation_id (FK → conversations)
├── sender_id (FK → users)
├── message (TEXT)
├── read_at (DATETIME, nullable)
├── created_at

CAREER_RESOURCES TABLE
├── id (PK)
├── title
├── description
├── content (TEXT)
├── resource_type (ENUM: article, video, guide, tool)
├── thumbnail
├── published_by (FK → users)
├── status (ENUM: draft, published, archived)
├── created_at

REPORTS TABLE
├── id (PK)
├── reported_by (FK → users)
├── opportunity_id (FK → opportunities, nullable)
├── reason (ENUM: scam, harassment, inappropriate, duplicate, other)
├── description (TEXT)
├── status (ENUM: pending, reviewed, resolved)
├── reviewed_by (FK → users, nullable)
├── created_at

ACTIVITY_LOGS TABLE
├── id (PK)
├── user_id (FK → users, nullable)
├── action (VARCHAR)
├── entity_type (ENUM: user, opportunity, application, organization)
├── entity_id
├── ip_address
├── created_at

ADMIN_PERMISSIONS TABLE
├── id (PK)
├── admin_user_id (FK → users)
├── permission_name (VARCHAR)
├── created_at
```

### 5.2 Entity Relationship Diagram (Conceptual)

```
                ┌─────────────┐
                │    USERS    │
                └──────┬──────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   STUDENT_      ORGANIZATIONS   ADMIN_
   PROFILES      (employer)    PERMISSIONS
        │              │
        │              ▼
        │         ORG_DOCS
        │
    ┌───┴───┐
    │       │
    ▼       ▼
EDUCATION  WORK_EXP
    
    ┌───────────────┐
    │ USER_SKILLS   │
    └───────┬───────┘
            │
            ▼
        SKILLS
        
    ┌──────────────────┐
    │  OPPORTUNITIES   │
    │  ├─ CATEGORY     │
    └─────┬────────────┘
          │
      ┌───┴────┐
      │        │
      ▼        ▼
  APPLICATIONS SAVED_OPPS
      │
      ├─ APP_DOCS
      └─ APP_STATUS_HISTORY
      
    ┌──────────────┐
    │ CONVERSATIONS│
    └──────┬───────┘
           │
           ▼
       MESSAGES
       
    ┌─────────────────┐
    │ CAREER_RESOURCES│
    └─────────────────┘
    
    ┌─────────────┐
    │ REPORTS     │
    └─────────────┘
    
    ┌──────────────┐
    │ ACTIVITY_LOGS│
    └──────────────┘
```

---

## 6. COMPLETE API ENDPOINTS STRUCTURE

### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/verify-email` - Verify email
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password
- POST `/api/auth/refresh-token` - Refresh JWT token
- GET `/api/auth/me` - Get current user

### Student Endpoints
- GET/PUT `/api/students/profile` - Get/update profile
- POST/GET `/api/students/education` - Manage education
- POST/GET `/api/students/experience` - Manage experience
- POST/GET `/api/students/skills` - Manage skills
- POST/GET `/api/students/certifications` - Manage certifications
- POST/GET `/api/students/cv` - Manage CVs
- GET `/api/students/dashboard` - Get dashboard data

### Opportunity Endpoints
- GET `/api/opportunities` - List opportunities (with search, filter, sort)
- GET `/api/opportunities/:id` - Get opportunity details
- POST `/api/opportunities` - Create opportunity (employer only)
- PUT `/api/opportunities/:id` - Update opportunity (employer only)
- DELETE `/api/opportunities/:id` - Delete opportunity (employer only)
- GET `/api/opportunities/featured` - Get featured opportunities
- GET `/api/opportunities/categories` - Get categories

### Application Endpoints
- POST `/api/applications` - Submit application
- GET `/api/applications/my-applications` - Get user's applications
- GET `/api/applications/:id` - Get application details
- PATCH `/api/applications/:id/status` - Update application status
- POST `/api/applications/:id/withdraw` - Withdraw application
- GET `/api/applications/:id/documents` - Get application documents

### Employer Endpoints
- GET/PUT `/api/employers/profile` - Get/update organization profile
- POST `/api/employers/verification` - Submit verification documents
- GET `/api/employers/opportunities` - Get employer's opportunities
- GET `/api/employers/applications` - Get applications for employer's opportunities
- GET `/api/employers/candidates/:id` - Get candidate details
- POST `/api/employers/shortlist` - Shortlist candidate
- GET `/api/employers/dashboard` - Get employer dashboard data

### Messaging Endpoints
- GET `/api/messages/conversations` - Get user's conversations
- GET `/api/messages/conversations/:id` - Get conversation messages
- POST `/api/messages` - Send message
- PATCH `/api/messages/:id/read` - Mark message as read

### Notification Endpoints
- GET `/api/notifications` - Get user notifications
- PATCH `/api/notifications/:id/read` - Mark notification as read
- PATCH `/api/notifications/read-all` - Mark all as read
- DELETE `/api/notifications/:id` - Delete notification

### Admin Endpoints
- GET `/api/admin/dashboard` - Get admin dashboard
- GET `/api/admin/users` - List users
- GET `/api/admin/users/:id` - Get user details
- PATCH `/api/admin/users/:id/status` - Update user status
- GET `/api/admin/employers` - List employers
- PATCH `/api/admin/employers/:id/verify` - Verify employer
- GET `/api/admin/opportunities` - List opportunities
- PATCH `/api/admin/opportunities/:id/approve` - Approve opportunity
- DELETE `/api/admin/opportunities/:id` - Delete opportunity
- GET `/api/admin/applications` - List applications
- GET `/api/admin/reports` - Get reports
- GET `/api/admin/analytics` - Get analytics
- GET `/api/admin/activity-logs` - Get activity logs
- GET `/api/admin/categories` - Get categories
- POST `/api/admin/categories` - Create category

### Career Resources Endpoints
- GET `/api/resources` - List career resources
- GET `/api/resources/:id` - Get resource details
- POST `/api/resources` - Create resource (admin/authorized)
- PUT `/api/resources/:id` - Update resource (admin/authorized)
- DELETE `/api/resources/:id` - Delete resource (admin/authorized)

---

## 7. UI/UX DESIGN SPECIFICATIONS

### Color Palette
- **Primary (Deep Navy Blue)**: #142B4A
- **Secondary (Professional Blue)**: #2563EB
- **Accent (Teal)**: #14B8A6
- **Background (Light Gray)**: #F8FAFC
- **White**: #FFFFFF
- **Text (Dark Slate)**: #1E293B
- **Success (Green)**: #10B981
- **Warning (Amber)**: #F59E0B
- **Error (Red)**: #EF4444
- **Disabled (Gray)**: #9CA3AF

### Typography
- **Heading 1**: 2.5rem (40px), Bold (700), Primary Color
- **Heading 2**: 2rem (32px), Semibold (600), Primary Color
- **Heading 3**: 1.5rem (24px), Semibold (600), Primary Color
- **Body**: 1rem (16px), Regular (400), Text Color
- **Small**: 0.875rem (14px), Regular (400), Text Color
- **Caption**: 0.75rem (12px), Regular (400), Gray

### Responsive Design
- **Desktop**: 1280px+
- **Tablet**: 768px - 1279px
- **Mobile**: 320px - 767px

---

## 8. DEVELOPMENT ROADMAP

### Phase 1: Planning & Analysis ✓
- ✓ Requirements analysis
- ✓ System architecture design
- ✓ Database ER diagram
- ✓ API specifications
- ✓ UI/UX design plan

### Phase 2: Project Setup (2-3 days)
- Initialize React + Vite project
- Configure Tailwind CSS
- Initialize Node.js + Express
- Configure MySQL database
- Set up Prisma ORM
- Configure environment variables
- Initialize Git repository
- Set up folder structure

### Phase 3: Database Development (2-3 days)
- Create Prisma schema
- Create database migrations
- Set up relationships
- Add constraints and indexes
- Create seed data for development

### Phase 4: UI/UX Development (4-5 days)
- Build homepage
- Create authentication pages
- Build reusable components
- Create navigation system
- Build dashboards

### Phase 5: Backend API Development (7-8 days)
- Authentication system
- Student profile management
- Employer management
- Opportunity CRUD
- Application management
- Admin features
- Messaging and notifications

### Phase 6: Frontend & Backend Integration (5-6 days)
- Connect all pages to API
- Implement workflows
- Testing and bug fixes

### Phase 7: Testing & Security (3-4 days)
- Unit tests
- Integration tests
- Security review

### Phase 8: Deployment (1-2 days)
- Configure production environment
- Deploy frontend and backend

**Estimated Total Timeline**: 4-5 weeks

---

## 9. SUCCESS CRITERIA

✓ All 12 modules fully implemented
✓ All user roles functioning correctly
✓ Mobile-responsive design
✓ Secure authentication and authorization
✓ Fast API performance
✓ Professional appearance
✓ Complete documentation
✓ Production-ready code

---

## STATUS: ✅ READY FOR PHASE 2 - PROJECT SETUP

This analysis document provides complete specifications for CareerBridge development. 

**Next Steps:**
1. Review and approve this analysis
2. Begin Phase 2: Project Setup
3. Initialize all repositories and environments
4. Start database design implementation

**Questions or modifications needed? Please specify below.**
