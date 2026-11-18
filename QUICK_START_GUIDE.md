# 🚀 CareerBridge - Quick Start Guide

## Status After Phase 2 Fixes

✅ **Frontend**: Ready to run  
✅ **Backend**: Ready to run (needs database)  
⏳ **Database**: Needs to be created  

---

## Step 1: Create MySQL Database

### Option A: MySQL Command Line
```bash
mysql -u root -p
# Press Enter if no password

# Create database
CREATE DATABASE careerbridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify
SHOW DATABASES;

# Exit
EXIT;
```

### Option B: phpMyAdmin (Recommended)
1. Open: `http://localhost/phpmyadmin`
2. Click **"Databases"** tab
3. Enter `careerbridge` in database name field
4. Select **"utf8mb4_unicode_ci"** collation
5. Click **"Create"**

### Option C: MySQL Workbench
1. Open MySQL Workbench
2. Connect to localhost
3. Right-click "Databases"
4. Select "Create Schema"
5. Name: `careerbridge`
6. Charset: `utf8mb4`
7. Click **"Apply"**

---

## Step 2: Run Database Migrations

```bash
cd server

# Generate Prisma client (if needed)
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# You'll be asked if you want to generate Prisma Client
# Answer: Yes
```

**Expected Output:**
```
✔ Your database has been reset, and Prisma Client has been regenerated.
✔ 1 migration created
```

---

## Step 3: Start the Backend

Open a terminal and run:

```bash
cd server
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════╗
║     CareerBridge API Server           ║
╠═══════════════════════════════════════╣
║ Environment: DEVELOPMENT             ║
║ Port:        5000                    ║
║ Status:      Running ✓                ║
╚═══════════════════════════════════════╝

✓ Database connection established
```

Backend runs on: `http://localhost:5000`

---

## Step 4: Start the Frontend

Open a new terminal and run:

```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.4.2  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Frontend runs on: `http://localhost:5173`

---

## Step 5: Verify Everything Works

### Test Backend Health Check
```bash
# In a new terminal
curl http://localhost:5000/health

# Or open in browser
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-11-16T...",
  "environment": "development"
}
```

### Test Frontend
Open `http://localhost:5173` in your browser

Should show the React dev server running without errors

---

## Database GUI (Optional)

View and manage your database visually:

```bash
cd server
npx prisma studio
```

Opens at: `http://localhost:5555`

---

## What's Running

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Ready |
| Backend | http://localhost:5000 | ✅ Ready |
| Database GUI | http://localhost:5555 | ✅ Ready |
| Health Check | http://localhost:5000/health | ✅ Ready |

---

## Troubleshooting

### MySQL not starting?
```bash
# XAMPP Control Panel
# Click "Start" next to MySQL

# Or manually (Windows)
"C:\xampp\mysql\bin\mysqld.exe"
```

### Database already exists error?
```bash
mysql -u root
DROP DATABASE careerbridge;
CREATE DATABASE careerbridge CHARACTER SET utf8mb4;
EXIT;
```

### Prisma errors?
```bash
cd server
rm -r node_modules/.prisma
npx prisma generate
npx prisma migrate dev --name init
```

### Port already in use?
- Frontend: Change in `vite.config.js` (search for 5173)
- Backend: Change PORT in `server/.env` (change 5000)

---

## Next Phase: Phase 3 - Database Development

Now that everything is running, Phase 3 is starting:

### Completed:
- [x] MySQL database created
- [x] Prisma migrations run
- [x] All 25 tables created
- [x] Backend connected to database
- [x] Frontend and backend running

### Next Steps:
1. **Create test data** (via Prisma Studio or manually)
2. **Start Phase 4** - Build React components
3. **Then Phase 5** - Build API endpoints
4. **Finally Phase 6** - Connect everything

---

## Available Commands

### Frontend Commands
```bash
cd client

npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check code quality
```

### Backend Commands
```bash
cd server

npm run dev              # Start dev server with auto-reload
npm start                # Start production server
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run migrations
npx prisma studio      # Open database GUI
npm test                # Run tests (when available)
```

### Database Commands
```bash
# Connect to MySQL
mysql -u root careerbridge

# View all tables
SHOW TABLES;

# View database size
SELECT table_name, round(((data_length + index_length) / 1024 / 1024), 2) AS size_mb 
FROM information_schema.TABLES 
WHERE table_schema = "careerbridge";
```

---

## Project Structure Review

```
careerbridge/
├── client/              (Frontend - React + Vite)
│   ├── src/
│   ├── node_modules/    ✅ (300+ packages)
│   └── .env.local       ✅ (configured)
│
├── server/              (Backend - Express + Prisma)
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma ✅ (fixed)
│   ├── node_modules/    ✅ (300+ packages)
│   └── .env             ✅ (configured)
│
└── docs/
    ├── START_HERE.md
    ├── README.md
    ├── QUICK_START_GUIDE.md (this file)
    └── ... more docs
```

---

## Development Workflow

### Daily Development
1. **Terminal 1**: `cd server && npm run dev` (Backend)
2. **Terminal 2**: `cd client && npm run dev` (Frontend)
3. **Terminal 3** (Optional): `cd server && npx prisma studio` (Database)
4. **Browser**: Open http://localhost:5173

### Making Changes
- Edit React components in `client/src/`
- Changes auto-reload in browser
- Edit backend in `server/src/`
- Changes auto-reload with --watch flag

### Testing Database
```bash
# Option 1: Prisma Studio GUI
npx prisma studio

# Option 2: MySQL Command Line
mysql -u root careerbridge
SHOW TABLES;
SELECT * FROM User;
```

---

## Common Development Tasks

### Add a new API endpoint
1. Create route in `server/src/routes/`
2. Create controller in `server/src/controllers/`
3. Import route in `server/src/app.js`
4. Restart backend

### Add a new React page
1. Create file in `client/src/pages/`
2. Import in `client/src/App.jsx`
3. Frontend auto-reloads

### Modify database schema
1. Update `server/prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name description`
3. Prisma client regenerates automatically

### Add a dependency
```bash
# Frontend
cd client
npm install package-name

# Backend
cd server
npm install package-name
```

---

## Performance Tips

- Keep browser dev tools closed when not debugging (saves memory)
- Use `npm run build` for production testing
- Clear browser cache: Ctrl+Shift+Delete
- Restart terminals if experiencing issues

---

## Documentation

For more detailed information:
- `README.md` - Project overview
- `CAREERBRIDGE_ANALYSIS.md` - Complete system design
- `DEVELOPMENT_ROADMAP.md` - Project timeline
- `PHASE3_PREPARATION.md` - Database setup guide

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| Database won't connect | Create `careerbridge` database first |
| Port in use | Change PORT in .env |
| npm packages missing | Run `npm install` |
| Prisma errors | Run `npx prisma generate` |
| Frontend won't load | Check `http://localhost:5173` |
| Backend won't start | Check database connection in .env |
| Changes not appearing | Check browser cache / hard refresh |

---

## Success Indicators

✅ **Everything working when:**
- Backend shows "Database connection established"
- Frontend loads at http://localhost:5173
- Health check returns status: "ok"
- No errors in browser console
- Prisma Studio opens without errors

---

## Next Steps

1. ✅ Create database
2. ✅ Run migrations
3. ✅ Start backend
4. ✅ Start frontend
5. 🔄 **Create test data** (optional)
6. 🔄 Start Phase 4 - Build UI components
7. 🔄 Phase 5 - Build API endpoints
8. 🔄 Phase 6 - Full integration

---

**You're all set! Happy coding! 🎉**

---

*For detailed setup instructions, see PHASE3_PREPARATION.md*  
*Project: CareerBridge - Connecting Talent to Opportunity*  
*Status: Phase 2 Complete - Ready for Phase 3*
