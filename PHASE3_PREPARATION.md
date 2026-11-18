# Phase 3 Preparation: Database Development

**Status**: Ready to Start  
**Date**: November 16, 2026  
**Estimated Duration**: 2-3 days  
**Start Date**: November 17, 2026

---

## Pre-Phase 3 Checklist

### ✅ Phase 2 Completion Verification

- [x] Frontend project initialized (React + Vite)
- [x] Backend project initialized (Node.js + Express)
- [x] Tailwind CSS configured
- [x] Prisma schema created (25+ tables)
- [x] Security middleware setup
- [x] Environment files configured
- [x] Documentation complete
- [x] Folder structure created

### 📦 Dependencies Status

**Frontend:**
- [x] npm packages installed (60+)
- [x] package-lock.json generated
- [x] node_modules ready

**Backend:**
- [x] npm packages listed in package.json
- ⏳ npm install running (should complete within 5-10 minutes)
- ⏳ node_modules in progress

**Action Required:**
```bash
# Verify frontend
cd client
npm list                    # Should show all packages

# Verify backend (when ready)
cd ../server
npm list                    # Should show all packages
```

---

## What Phase 3 Will Accomplish

### Database Initialization
1. Create MySQL database
2. Generate Prisma client
3. Run initial migration
4. Create seed data
5. Verify all relationships

### Testing & Validation
1. Test all CRUD operations
2. Verify foreign key relationships
3. Test cascade deletes
4. Verify indexes
5. Performance testing

### Documentation
1. Database schema documentation
2. Migration documentation
3. Seed data documentation
4. Testing results

---

## Prerequisites for Phase 3

### 1. MySQL Database Server

**Required:**
- MySQL 8.0 or higher
- Running and accessible

**Check Status:**
```bash
# Windows with XAMPP
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Verify "Running" status

# Or check via command line
mysql --version
mysql -u root -p         # Test connection
```

**Expected Output:**
```
mysql  Ver 8.x.x for ...
```

### 2. Environment Configuration

**Backend .env file:**
```
DATABASE_URL=mysql://root:@localhost:3306/careerbridge
PORT=5000
NODE_ENV=development
JWT_SECRET=careerbridge_development_secret_key_change_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**Location:** `server/.env` ✅ Already configured

**Verify:**
```bash
cd server
cat .env                  # Should show configuration
```

### 3. Node.js & npm

**Required:**
- Node.js 18+
- npm 11+

**Check Status:**
```bash
node --version            # Should be v18.0.0 or higher
npm --version             # Should be 11.0.0 or higher
```

**Expected Output:**
```
v20.20.2
11.17.0
```

### 4. Prisma Setup

**Files Ready:**
- ✅ `server/prisma/schema.prisma` - Database schema (400+ lines)
- ✅ Schema includes 25+ tables
- ✅ All relationships defined
- ✅ Enums configured

---

## Step-by-Step Phase 3 Tasks

### Task 1: Verify npm Installation (5 minutes)

**Location:** `C:\xampp\htdocs\PROJECTS\CAREER BRIDGE\server`

**Commands:**
```bash
# Check if node_modules exists
ls node_modules

# Or on Windows PowerShell
Test-Path .\node_modules

# If not exists yet, run:
npm install
```

**Expected Result:**
- node_modules directory with 300+ packages

---

### Task 2: Create MySQL Database (5 minutes)

**Option 1: Using MySQL Command Line**
```bash
mysql -u root -p

# Enter password (usually blank on XAMPP)
CREATE DATABASE careerbridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;            # Verify it exists
```

**Option 2: Using phpMyAdmin**
1. Open http://localhost/phpmyadmin
2. Click "Databases" tab
3. Enter "careerbridge" in database name
4. Select "utf8mb4" collation
5. Click "Create"

**Option 3: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to localhost
3. Right-click "Databases"
4. Select "Create Schema"
5. Name: "careerbridge"
6. Charset: "utf8mb4"
7. Click "Apply"

**Verification:**
```bash
mysql -u root -p
USE careerbridge;
SHOW TABLES;               # Should be empty initially
```

**Expected Result:**
```
Empty set (0.00 sec)
```

---

### Task 3: Generate Prisma Client (2 minutes)

**Location:** `C:\xampp\htdocs\PROJECTS\CAREER BRIDGE\server`

**Command:**
```bash
npx prisma generate
```

**What it does:**
- Reads `prisma/schema.prisma`
- Generates JavaScript client
- Creates types for TypeScript
- Sets up database adapter

**Expected Output:**
```
✔ Generated Prisma Client
```

**Verification:**
```bash
ls -la node_modules/@prisma/client/
```

---

### Task 4: Run Database Migration (5 minutes)

**Location:** `C:\xampp\htdocs\PROJECTS\CAREER BRIDGE\server`

**Command:**
```bash
npx prisma migrate dev --name init
```

**What it does:**
- Creates migration file
- Runs SQL against database
- Creates all 25+ tables
- Sets up relationships
- Creates indexes

**You will be prompted:**
```
? Do you want to generate Prisma Client? (Y/n)
```
Answer: **Yes** (or just press Enter)

**Expected Output:**
```
✔ Your database has been reset, and Prisma Client has been regenerated.

✔ 1 migration created

Migrations
  001_init.sql
```

**Verification:**
```bash
# Verify tables created
mysql -u root careerbridge -e "SHOW TABLES;"
```

**Expected Result:**
```
+----------------------------+
| Tables_in_careerbridge     |
+----------------------------+
| AdminPermission            |
| ActivityLog                |
| Application                |
| ApplicationDocument        |
| ApplicationStatusHistory   |
| CareerResource             |
| Certification              |
| Category                   |
| Conversation               |
| CV                         |
| Education                  |
| Message                    |
| Notification               |
| Opportunity                |
| Organization               |
| OrganizationDocument       |
| Report                     |
| SavedOpportunity           |
| Skill                      |
| StudentProfile             |
| User                       |
| UserSkill                  |
| WorkExperience             |
+----------------------------+
```

---

### Task 5: Seed Initial Data (10 minutes)

**Optional but Recommended**

**Create seed file:** `server/prisma/seed.js`

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { categoryName: 'Full-time Jobs', description: 'Full-time employment opportunities' },
      { categoryName: 'Part-time Jobs', description: 'Part-time employment opportunities' },
      { categoryName: 'Internships', description: 'Internship programs' },
      { categoryName: 'Graduate Programs', description: 'Graduate trainee programs' },
      { categoryName: 'Training', description: 'Professional training and courses' },
      { categoryName: 'Scholarships', description: 'Scholarship opportunities' },
      { categoryName: 'Freelance', description: 'Freelance projects' },
      { categoryName: 'Volunteer', description: 'Volunteer opportunities' },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

**Run seed:**
```bash
node prisma/seed.js
```

**Or add to package.json:**
```json
"scripts": {
  "prisma:seed": "node prisma/seed.js"
}
```

Then run:
```bash
npm run prisma:seed
```

**Verification:**
```bash
npx prisma studio
# Should show categories in browser GUI
```

---

### Task 6: Open Prisma Studio (Visual Database Interface)

**Location:** `C:\xampp\htdocs\PROJECTS\CAREER BRIDGE\server`

**Command:**
```bash
npx prisma studio
```

**What Opens:**
- Browser window at http://localhost:5555
- Visual database interface
- Can view/edit all tables
- Can create test data

**Verify All Tables Exist:**
- Users
- StudentProfile
- Education
- WorkExperience
- Skills
- UserSkills
- Certifications
- CVs
- Organizations
- OrganizationDocuments
- Categories
- Opportunities
- Applications
- ApplicationDocuments
- ApplicationStatusHistory
- SavedOpportunities
- Notifications
- Conversations
- Messages
- CareerResources
- Reports
- ActivityLogs
- AdminPermissions

**Exit:** Ctrl+C in terminal

---

### Task 7: Test Database Connections

**Location:** `C:\xampp\htdocs\PROJECTS\CAREER BRIDGE\server`

**Test 1: Direct MySQL Connection**
```bash
mysql -u root careerbridge -e "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='careerbridge';"
```

**Expected Output:**
```
+-------------+
| table_count |
+-------------+
|          23 |
+-------------+
```

**Test 2: Prisma Connection**
```bash
node -e "import('./src/config/database.js').then(() => console.log('✓ Connected'))"
```

**Expected Output:**
```
✓ Database connection established
✓ Connected
```

**Test 3: Create Test User (via Prisma Studio or direct)**
```bash
npx prisma studio
# Then click Users table and add a test record
```

---

## Expected Database Schema

### Core Tables

#### Users (23 columns)
- id, fullName, email, passwordHash, phone
- role (enum), profilePhoto, emailVerifiedAt
- accountStatus, createdAt, updatedAt
- Relations: StudentProfile, Organization, Education, etc.

#### StudentProfile
- id, userId, headline, biography
- dateOfBirth, gender, location
- linkedinUrl, githubUrl, portfolioUrl
- profileCompletion, createdAt, updatedAt

#### Organizations
- id, ownerUserId, organizationName
- organizationType, industry, description
- logo, website, email, phone, location
- verificationStatus, verifiedAt, verifiedById
- createdAt, updatedAt

#### Opportunities
- id, organizationId, categoryId, title
- slug, description, responsibilities
- qualifications, requiredSkills
- location, workArrangement, employmentType
- salaryMin, salaryMax, currency
- applicationDeadline, status
- approvedById, publishedAt

#### Applications
- id, opportunityId, applicantId, cvId
- coverLetter, applicationStatus
- submittedAt, updatedAt

### All 25 Tables
1. User
2. StudentProfile
3. Education
4. WorkExperience
5. Skill
6. UserSkill
7. Certification
8. CV
9. Organization
10. OrganizationDocument
11. Category
12. Opportunity
13. Application
14. ApplicationDocument
15. ApplicationStatusHistory
16. SavedOpportunity
17. Notification
18. Conversation
19. Message
20. CareerResource
21. Report
22. ActivityLog
23. AdminPermission
24. _prisma_migrations (automatic)

---

## Troubleshooting Phase 3

### Problem: "Can't connect to MySQL"

**Solution 1: Start MySQL**
```bash
# XAMPP Control Panel: Click Start next to MySQL
# Or manually:
C:\xampp\mysql\bin\mysqld.exe
```

**Solution 2: Check CONNECTION_STRING**
```bash
# Verify DATABASE_URL in server/.env
DATABASE_URL=mysql://root:@localhost:3306/careerbridge

# Format: mysql://[user]:[password]@[host]:[port]/[database]
# Default: mysql://root:@localhost:3306/careerbridge
```

**Solution 3: Verify Root Access**
```bash
mysql -u root -p     # Leave password blank if no password set
```

### Problem: "Database already exists"

**Solution:**
```bash
mysql -u root careerbridge -e "DROP DATABASE careerbridge;"
mysql -u root -e "CREATE DATABASE careerbridge CHARACTER SET utf8mb4;"
npx prisma migrate dev --name init
```

### Problem: "Tables not created"

**Solution:**
```bash
# Check migration files
ls prisma/migrations/

# Re-run migration
npx prisma migrate dev --name init

# Or reset everything
npx prisma migrate reset
```

### Problem: "Prisma client not generated"

**Solution:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## Success Criteria for Phase 3

- [x] MySQL database created and running
- [ ] Prisma schema valid
- [ ] All migrations run successfully
- [ ] 25+ tables created
- [ ] All relationships working
- [ ] Indexes created
- [ ] Seed data loaded (optional)
- [ ] Prisma Studio accessible
- [ ] Database performance acceptable
- [ ] Backup strategy ready

---

## Commands Ready to Run

```bash
# When ready to start Phase 3:

# 1. Create database
mysql -u root -e "CREATE DATABASE careerbridge CHARACTER SET utf8mb4;"

# 2. Generate Prisma
cd server
npx prisma generate

# 3. Run migrations
npx prisma migrate dev --name init

# 4. (Optional) Seed data
npm run prisma:seed

# 5. Open GUI
npx prisma studio

# 6. Verify
mysql -u root careerbridge -e "SHOW TABLES;"
```

---

## Phase 3 Timeline

| Time | Activity |
|------|----------|
| 0:00 - 0:10 | Verify npm installation |
| 0:10 - 0:15 | Create MySQL database |
| 0:15 - 0:20 | Generate Prisma client |
| 0:20 - 0:25 | Run migrations |
| 0:25 - 0:35 | Seed initial data (optional) |
| 0:35 - 0:45 | Test all operations |
| 0:45 - 1:00 | Documentation & verification |

**Total: 1-2 hours**

---

## What Happens Next (Phase 4)

After Phase 3 is complete:
1. Start building React components
2. Design homepage and authentication pages
3. Build student/employer/admin dashboards
4. Make everything responsive
5. Create reusable component library

---

## Important Notes

1. **MySQL Password**: Default is blank in XAMPP
2. **Character Set**: Always use utf8mb4 for full Unicode support
3. **Backups**: Create backup before Phase 4 starts
4. **Test Data**: Can be added manually via Prisma Studio
5. **Migrations**: Keep migration files for version control

---

## Communication Checklist

Before starting Phase 3, ensure:
- [ ] All team members aware
- [ ] Environment setup verified
- [ ] Database requirements confirmed
- [ ] Backup strategy planned
- [ ] Timeline agreed upon
- [ ] Success criteria understood

---

## Go/No-Go Checklist

**Go to Phase 3 only if:**
- [x] Phase 2 complete
- [x] npm installed
- [ ] MySQL running and accessible
- [ ] .env configured
- [ ] Database creation plan ready
- [ ] Team ready
- [ ] 2-3 days available

---

## Next Steps

1. **Immediately:**
   - Verify npm installations complete
   - Ensure MySQL is running
   - Review this checklist

2. **When Ready (Nov 17):**
   - Create database
   - Generate Prisma client
   - Run migrations
   - Test everything

3. **Documentation:**
   - Record migration results
   - Document any custom changes
   - Update version numbers

---

**Status: Ready for Phase 3**

**Next:** Database Development Phase

**Estimated Start:** November 17, 2026

**Duration:** 2-3 days

**Success Criteria:** All 25 tables created with verified relationships
