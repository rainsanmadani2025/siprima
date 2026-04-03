# Data Loss Analysis & Recovery Plan
## RPP/PROSEM Data Loss Incident

**Date:** March 24, 2026
**Incident:** RPP (Rencana Pelaksanaan Pembelajaran) and PROSEM (Program Semester) data missing after login fix
**Root Cause:** Execution of `prisma.user.deleteMany({})` in `reset-users.ts`

---

## 📋 EXECUTIVE SUMMARY

After running a login fix script that executed `prisma.user.deleteMany({})`, the system experienced a **catastrophic data loss** due to cascade delete relationships in the database schema. The following data has been completely lost:

- ✗ All Teacher profiles
- ✗ All PROSEM records (Program Semester)
- ✗ All RPP records (Rencana Pelaksanaan Pembelajaran)
- ✗ All RPP Templates
- ✗ All Daily Plans (RPPH)
- ✗ All Student records
- ✗ All Class records
- ✗ All School information
- ✗ All Attendance records
- ✗ All Assessment records
- ✗ All Parent records

**Current Status:** Only 4 User accounts exist (admin, kepsek, guru1, ortu1), which were recreated after the reset.

---

## 🔍 ROOT CAUSE ANALYSIS

### 1. Schema Relationship Chain

The Prisma schema contains critical **cascade delete** relationships that caused this data loss:

```prisma
// Line 66 in schema.prisma
model User {
  id           String    @id @default(cuid())
  // ...
  teacherProfile  Teacher?  // Relation to Teacher
}

model Teacher {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)  // ⚠️ CASCADE DELETE
  // ...
  prosems         Prosem[]  // Relation to PROSEM
  dailyPlans      DailyPlan[]
  studentAssessments StudentAssessment[]
  reports         TeacherReport[]
}

model Prosem {
  id            String   @id @default(cuid())
  teacherId     String
  teacher       Teacher  @relation(fields: [teacherId], references: [id])
  // ...
}
```

### 2. Cascade Delete Flow

```
prisma.user.deleteMany({})
    ↓
[User records deleted]
    ↓ (Cascade: onDelete: Cascade)
[Teacher profiles deleted]
    ↓ (Foreign Key constraint)
[Prosem records deleted]
[DailyPlan records deleted]
[StudentAssessment records deleted]
[TeacherReport records deleted]
    ↓
[All dependent data lost]
```

### 3. Critical Schema Design Issues

**Issue #1: Aggressive Cascade Deletes**
- Line 66: `onDelete: Cascade` on Teacher → User relationship
- Line 91: `onDelete: Cascade` on Parent → User relationship
- Line 289: `onDelete: Cascade` on Notification → User relationship

**Issue #2: No Backup Strategy**
- No automatic database backups
- No backup files found in the project
- No database dump files

**Issue #3: Lack of Data Protection**
- No confirmation prompts for destructive operations
- No soft-delete implementation
- No data versioning

---

## 📊 CURRENT DATA ASSESSMENT

### Database State (as of analysis)

| Table | Record Count | Status |
|-------|--------------|--------|
| User | 4 | ✅ Recreated |
| Teacher | 0 | ❌ Lost |
| Parent | 0 | ❌ Lost |
| Student | 0 | ❌ Lost |
| Class | 0 | ❌ Lost |
| School | 0 | ❌ Lost |
| RPP | 0 | ❌ Lost |
| RPP Template | 0 | ❌ Lost |
| Prosem | 0 | ❌ Lost |
| DailyPlan | 0 | ❌ Lost |
| CurriculumPlan | 0 | ❌ Lost |
| StudentAssessment | 0 | ❌ Lost |
| Portfolio | 0 | ❌ Lost |
| Announcement | 0 | ❌ Lost |
| Notification | 0 | ❌ Lost |
| Message | 0 | ❌ Lost |
| StudentAttendance | 0 | ❌ Lost |
| TeacherAttendance | 0 | ❌ Lost |

### Available Resources for Recovery

✅ **Available:**
- Seed files for basic data (`prisma/seed.ts`)
- RPP Template seed files (4 different versions):
  - `seed-kbc-templates.ts` (487 lines, 15 templates)
  - `seed-15-templates-kbc.ts`
  - `seed-many-templates.ts`
  - `seed-templates.ts`
- Schema definitions in `schema.prisma`

❌ **Not Available:**
- Database backups
- Data exports/dumps
- Historical data snapshots
- Previous database versions

---

## 🛠️ RECOVERY OPTIONS

### Option A: Recreate from Seed Files (RECOMMENDED)

**Approach:** Use existing seed files to rebuild the database from scratch.

**Pros:**
- ✅ Fast recovery (minutes)
- ✅ Uses existing, tested seed data
- ✅ Guarantees data consistency
- ✅ No risk of corrupted data

**Cons:**
- ❌ All custom data is permanently lost
- ❌ Only template data is available
- ❌ Historical records cannot be restored

**Recoverable Data:**
- Basic school information
- Sample users and teachers
- RPP Templates (15 KBC-based templates)
- Sample classes and students

**Irrecoverable Data:**
- Custom RPP plans created by teachers
- PROSEM data specific to teachers
- Student attendance history
- Student assessments
- Custom announcements

**Estimated Recovery Time:** 15-30 minutes

---

### Option B: Restore from Backup (NOT AVAILABLE)

**Approach:** Restore database from a backup file.

**Pros:**
- ✅ Complete data restoration
- ✅ No data loss
- ✅ Maintains all customizations

**Cons:**
- ❌ **No backup files exist**
- ❌ Cannot be implemented

**Status:** ❌ NOT VIABLE - No backups found

---

### Option C: Manual Data Reconstruction

**Approach:** Manually recreate all data based on teacher memory and paper records.

**Pros:**
- ✅ Can restore some custom data
- ✅ Teachers can input their RPP/PROSEM from memory
- ✅ Opportunity to improve data quality

**Cons:**
- ❌ Extremely time-consuming (days/weeks)
- ❌ Incomplete data recovery
- ❌ High risk of errors
- ❌ Dependent on teacher availability

**Estimated Recovery Time:** 1-2 weeks

---

## 🎯 RECOMMENDED RECOVERY PLAN

### Phase 1: Immediate Recovery (30 minutes)

1. **Run Master Seed Script**
   ```bash
   npx prisma db seed
   ```

2. **Seed RPP Templates**
   ```bash
   npx tsx prisma/seed-kbc-templates.ts
   ```

3. **Verify Data Recovery**
   ```bash
   npx tsx check-database-state.ts
   ```

### Phase 2: Teacher Data Entry (1-2 weeks)

1. **Notify Teachers**
   - Inform them about the data loss
   - Provide guidance on recreating their PROSEM
   - Share template RPP plans for reference

2. **Recreate PROSEM Data**
   - Teachers use PROSEM generation API
   - Base on RPP Templates
   - Customize for their classes

3. **Recreate Custom RPP Plans**
   - Teachers recreate from memory or paper records
   - Use RPP Templates as starting point
   - Apply AI generation assistance if available

### Phase 3: System Hardening (1 week)

1. **Implement Backup Strategy** (see Prevention Measures)
2. **Update Schema to Remove Dangerous Cascades**
3. **Add Data Protection Safeguards**

---

## 🛡️ PREVENTION MEASURES

### 1. Immediate Schema Changes

**Remove Dangerous Cascade Deletes:**

```prisma
// BEFORE (DANGEROUS):
model Teacher {
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// AFTER (SAFE):
model Teacher {
  user  User  @relation(fields: [userId], references: [id])
  userId  String  @unique
}

// Add soft delete instead:
model User {
  deletedAt  DateTime?
  isDeleted  Boolean  @default(false)
}
```

### 2. Automated Backup System

**Implement Daily Backups:**
```typescript
// scripts/backup-database.ts
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const backupDir = './backups'
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupFile = path.join(backupDir, `backup-${timestamp}.db`)

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

// Copy database file
fs.copyFileSync('./db/custom.db', backupFile)

// Keep only last 30 days of backups
const files = fs.readdirSync(backupDir)
  .filter(f => f.startsWith('backup-'))
  .sort()
  .reverse()
  .slice(30)

files.forEach(f => fs.unlinkSync(path.join(backupDir, f)))

console.log(`✅ Database backed up to: ${backupFile}`)
```

**Add to package.json:**
```json
{
  "scripts": {
    "backup": "tsx scripts/backup-database.ts",
    "backup:cron": "node scripts/schedule-backup.js"
  }
}
```

### 3. Add Confirmation for Destructive Operations

**Create a safe delete utility:**
```typescript
// lib/safe-delete.ts
import { PrismaClient } from '@prisma/client'

export async function safeDeleteAllUsers(prisma: PrismaClient, confirm: boolean) {
  if (!confirm) {
    throw new Error('⚠️ DELETION CANCELLED: Must confirm with confirm=true')
  }

  // Count what will be deleted
  const userCount = await prisma.user.count()
  const teacherCount = await prisma.teacher.count()
  const prosemCount = await prisma.prosem.count()

  console.warn('⚠️ WARNING: This will DELETE:')
  console.warn(`   - ${userCount} users`)
  console.warn(`   - ${teacherCount} teachers`)
  console.warn(`   - ${prosemCount} PROSEM records`)
  console.warn('   - AND ALL RELATED DATA!')

  // Add delay for manual cancellation
  await new Promise(resolve => setTimeout(resolve, 5000))

  const result = await prisma.user.deleteMany({})
  console.warn(`✅ Deleted ${result.count} users`)
  return result
}
```

### 4. Implement Soft Deletes

```prisma
// Add to all important models
model User {
  deletedAt  DateTime?
  isDeleted  Boolean  @default(false)
}

model Prosem {
  deletedAt  DateTime?
  isDeleted  Boolean  @default(false)
}

// Update queries to filter out deleted records
model Prosem {
  @@index([isDeleted])
}
```

### 5. Add Data Validation Before Destructive Operations

```typescript
// scripts/safe-reset.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function safeReset() {
  // Check for critical data
  const prosemCount = await prisma.prosem.count()
  const rppCount = await prisma.rPP.count()
  const studentCount = await prisma.student.count()

  if (prosemCount > 0 || rppCount > 0 || studentCount > 0) {
    console.error('❌ CANNOT RESET: Critical data exists!')
    console.error(`   PROSEM: ${prosemCount}`)
    console.error(`   RPP: ${rppCount}`)
    console.error(`   Students: ${studentCount}`)
    console.error('\nPlease backup data first or use --force flag')
    process.exit(1)
  }

  // Proceed with reset
  console.log('✅ Proceeding with safe reset...')
}
```

### 6. Implement Data Versioning

```prisma
model DataSnapshot {
  id          String   @id @default(cuid())
  name        String
  description String?
  data        String   // JSON snapshot
  createdAt   DateTime @default(now())
  createdBy   String?
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String   // CREATE, UPDATE, DELETE
  entity      String   // User, Teacher, Prosem, etc.
  entityId    String?
  oldValue    String?  // JSON
  newValue    String?  // JSON
  createdAt   DateTime @default(now())
}
```

### 7. Add Automated Testing

```typescript
// tests/dangerous-operations.test.ts
import { describe, it, expect } from 'vitest'
import { prisma } from '@/lib/db'

describe('Destructive Operations', () => {
  it('should prevent deletion when PROSEM data exists', async () => {
    // Create test data
    await prisma.prosem.create({ data: { /* ... */ } })

    // Attempt deletion should fail
    await expect(
      prisma.user.deleteMany({})
    ).rejects.toThrow()

    // Cleanup
    await prisma.prosem.deleteMany()
  })
})
```

### 8. Implement Environment-Based Protection

```typescript
// lib/environment-protection.ts
const PROTECTED_ENVIRONMENTS = ['production', 'staging']

export function isProtectedEnvironment(): boolean {
  const env = process.env.NODE_ENV || 'development'
  return PROTECTED_ENVIRONMENTS.includes(env)
}

export function requireConfirmation(message: string): void {
  if (isProtectedEnvironment()) {
    console.error('🛑 PROTECTED ENVIRONMENT DETECTED')
    console.error(message)
    console.error('This operation requires explicit confirmation.')
    process.exit(1)
  }
}

// Usage in scripts:
requireConfirmation(
  'You are about to delete ALL users in production environment!'
)
```

---

## 📝 STEP-BY-STEP RECOVERY INSTRUCTIONS

### Step 1: Backup Current State (if any valuable data exists)

```bash
# Create backup of current (empty) database for reference
cp db/custom.db db/custom.db.empty-backup-$(date +%Y%m%d-%H%M%S)
```

### Step 2: Run Master Seed Script

```bash
# Run the main seed script
npx prisma db seed

# This will create:
# - 1 School
# - 1 Admin user
# - 1 Kepala Sekolah user
# - 2 Teachers
# - 2 Classes
# - 4 Students
# - 4 Parents
# - 2 Daily Plans
# - 2 Announcements
```

### Step 3: Seed RPP Templates

```bash
# Seed KBC-based RPP templates
npx tsx prisma/seed-kbc-templates.ts

# This will create 15 comprehensive RPP templates covering:
# - Beriman dan Berakhlak Mulia (3 templates)
# - Berkebinekaan Global (3 templates)
# - Gotong Royong (3 templates)
# - Mandiri dan Kreatif (3 templates)
# - Bernalar Kritis (3 templates)
```

### Step 4: Verify Recovery

```bash
# Check database state
npx tsx check-database-state.ts

# Expected output:
# User: 6-7 users
# Teacher: 2 teachers
# Student: 4 students
# Class: 2 classes
# School: 1 school
# RPP Template: 15 templates
# Announcement: 2 announcements
```

### Step 5: Create Teacher PROSEM Data

Teachers can now use the PROSEM generation API:

```bash
# Access the PROSEM generation endpoint
POST /api/prosem/generate

# Body:
{
  "tahunAjaran": "2025/2026",
  "semester": "Ganjil",
  "teacherId": "<teacher_id>"
}
```

### Step 6: Create Custom RPP Plans

Teachers can create RPP plans from templates:

```bash
# Access RPP template list
GET /api/rpp/templates

# Create RPP from template
POST /api/rpp/save

# Body:
{
  "tema": "<theme>",
  "subtema": "<subtheme>",
  // ... other fields from template
}
```

---

## 📊 DATA RECOVERY CHECKLIST

### Immediate Recovery (Day 1)
- [ ] Backup current database state
- [ ] Run master seed script
- [ ] Seed RPP templates
- [ ] Verify all seeded data
- [ ] Test user logins
- [ ] Verify teacher access

### Teacher Data Entry (Week 1-2)
- [ ] Notify all teachers of data loss
- [ ] Provide recovery instructions to teachers
- [ ] Teachers recreate PROSEM data
- [ ] Teachers recreate custom RPP plans
- [ ] Restore student enrollment data
- [ ] Recreate class assignments

### System Hardening (Week 2-3)
- [ ] Implement automated backup system
- [ ] Update schema to remove cascade deletes
- [ ] Add soft delete functionality
- [ ] Implement confirmation prompts
- [ ] Add data validation before destructive operations
- [ ] Set up monitoring and alerts
- [ ] Document recovery procedures

### Ongoing (Week 4+)
- [ ] Regular backup verification
- [ ] Monitor backup success/failure
- [ ] Train staff on data protection
- [ ] Review and update backup strategy
- [ ] Conduct quarterly disaster recovery drills

---

## 🚨 CRITICAL WARNINGS

### DO NOT:
- ❌ Run `prisma.user.deleteMany({})` again
- ❌ Delete any records without backup
- ❌ Modify cascade delete settings without understanding impact
- ❌ Skip backup verification

### ALWAYS:
- ✅ Create backup before any destructive operation
- ✅ Test recovery procedures regularly
- ✅ Monitor backup success/failure
- ✅ Document all data changes
- ✅ Use version control for seed data

---

## 📞 NEXT ACTIONS

### Immediate (Today)
1. **Implement Backup System** - Create automated backup script
2. **Recover Basic Data** - Run seed scripts to restore system functionality
3. **Notify Stakeholders** - Inform teachers and administrators

### Short-term (This Week)
1. **Schema Review** - Remove dangerous cascade deletes
2. **Add Safeguards** - Implement confirmation prompts
3. **Teacher Training** - Guide teachers on data recreation

### Long-term (This Month)
1. **Disaster Recovery Plan** - Create comprehensive DR documentation
2. **Monitoring System** - Set up alerts for unusual activity
3. **Regular Audits** - Review data integrity weekly

---

## 📚 LESSONS LEARNED

1. **Cascade Deletes are Dangerous** - Automatic cascading deletes should be used sparingly and only when absolutely necessary
2. **Backups are Essential** - No production system should operate without automated, verified backups
3. **Confirmation is Critical** - Any destructive operation should require explicit confirmation
4. **Soft Deletes are Safer** - Marking records as deleted is safer than physically deleting them
5. **Testing Matters** - All destructive operations should be tested in development first

---

## 🔄 RECOVERY PROGRESS TRACKING

| Phase | Task | Status | Completed |
|-------|------|--------|-----------|
| 1 | Backup current state | ⏳ Pending | - |
| 1 | Run master seed | ⏳ Pending | - |
| 1 | Seed RPP templates | ⏳ Pending | - |
| 1 | Verify recovery | ⏳ Pending | - |
| 2 | Notify teachers | ⏳ Pending | - |
| 2 | Recreate PROSEM | ⏳ Pending | - |
| 2 | Recreate RPP plans | ⏳ Pending | - |
| 3 | Implement backups | ⏳ Pending | - |
| 3 | Update schema | ⏳ Pending | - |
| 3 | Add safeguards | ⏳ Pending | - |

---

**Document Version:** 1.0
**Last Updated:** March 24, 2026
**Author:** Data Recovery Analysis Team
**Next Review:** After recovery completion

---

## APPENDICES

### Appendix A: Database Schema Key Relationships

```
User (1) ──┬──> (1) Teacher ──┬──> (N) Prosem
           │                 ├──> (N) DailyPlan
           │                 ├──> (N) StudentAssessment
           │                 └──> (N) TeacherReport
           │
           └──> (1) Parent ───> (N) Student
                                   │
                                   └──> (N) StudentAttendance
                                       (N) Portfolio
                                       (N) StudentReport
```

### Appendix B: Available Seed Files

1. **seed.ts** - Basic system data (school, users, teachers, students)
2. **seed-kbc-templates.ts** - 15 comprehensive RPP templates (KBC-based)
3. **seed-15-templates-kbc.ts** - Alternative KBC templates
4. **seed-many-templates.ts** - Multiple template variations
5. **seed-templates.ts** - Basic template set

### Appendix C: Critical File Locations

- Schema: `/home/z/my-project/prisma/schema.prisma`
- Database: `/home/z/my-project/db/custom.db`
- Seed Files: `/home/z/my-project/prisma/seed-*.ts`
- Recovery Script: `/home/z/my-project/check-database-state.ts`

---

**END OF DOCUMENT**
