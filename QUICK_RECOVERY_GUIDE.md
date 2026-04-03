# Quick Recovery Guide

## 🚨 Immediate Actions

### Option 1: Automated Recovery (Recommended)

Run the recovery script:

```bash
./recover-data.sh
```

This will:
1. ✅ Backup current (empty) database state
2. ✅ Restore basic system data (users, teachers, students, classes)
3. ✅ Seed 15 RPP templates
4. ✅ Verify the recovery

### Option 2: Manual Recovery

If the automated script fails, run these commands manually:

```bash
# Step 1: Backup current state
cp db/custom.db db/custom.db.empty-backup-$(date +%Y%m%d-%H%M%S)

# Step 2: Run master seed
npx tsx prisma/seed.ts

# Step 3: Seed RPP templates
npx tsx prisma/seed-kbc-templates.ts

# Step 4: Verify recovery
npx tsx check-database-state.ts
```

---

## 📋 What Will Be Recovered

### Immediately Recovered (After running script)
- ✅ 6-7 User accounts (admin, kepsek, teachers, parents)
- ✅ 1 School information
- ✅ 2 Teacher profiles
- ✅ 2 Classes (A1, B1)
- ✅ 4 Students
- ✅ 15 RPP Templates (KBC-based)
- ✅ 2 Sample Daily Plans
- ✅ 2 Sample Announcements

### Requires Manual Recreation
- ❌ Custom RPP plans (teachers must recreate)
- ❌ PROSEM data (teachers must recreate)
- ❌ Student attendance history
- ❌ Student assessments
- ❌ Custom announcements

---

## 👨‍🏫 Teacher Instructions (Share This)

### For Teachers:

1. **Log in to the system** using your credentials
2. **Access PROSEM generation** at `/api/prosem/generate`
3. **Create your PROSEM** for the current semester:
   ```json
   {
     "tahunAjaran": "2025/2026",
     "semester": "Ganjil"
   }
   ```
4. **Create RPP plans** from the available templates:
   - Browse templates at `/api/rpp/templates`
   - Customize based on your class needs
   - Save your custom RPP plans

### Resources Available:
- 📚 15 comprehensive RPP templates covering all 6 KBC pillars
- 🎯 Template themes include: religion, culture, cooperation, creativity, critical thinking
- 📝 Detailed lesson plans with activities and materials

---

## ⚠️ Important Warnings

### DO NOT:
- ❌ Run `prisma.user.deleteMany({})` again
- ❌ Delete any records without creating a backup first
- ❌ Skip the verification step

### ALWAYS:
- ✅ Create backup before any changes
- ✅ Verify data after recovery
- ✅ Test login for all users
- ✅ Notify all teachers about the data loss

---

## 🔧 Troubleshooting

### Script fails with "command not found: npx"
**Solution:** Install Node.js dependencies
```bash
npm install
```

### Script fails with "prisma.client not found"
**Solution:** Generate Prisma client
```bash
npx prisma generate
```

### Database locked error
**Solution:** Stop any running applications using the database
```bash
# Stop Next.js dev server if running
# Then retry the recovery script
```

### Verification shows 0 records
**Solution:** Check database connection in `.env` file
```bash
# Verify DATABASE_URL is correct
cat .env | grep DATABASE_URL
```

---

## 📞 Next Steps After Recovery

### Immediate (Today)
1. ✅ Run recovery script
2. ✅ Verify all data is restored
3. ✅ Test login for all user types
4. ✅ Notify teachers of data loss

### This Week
1. 📝 Teachers recreate PROSEM data
2. 📝 Teachers recreate custom RPP plans
3. 🛡️ Implement automated backup system
4. 🛡️ Update schema to prevent cascade deletes

### This Month
1. 📚 Create disaster recovery documentation
2. 📊 Set up monitoring and alerts
3. 🎯 Train staff on data protection
4. 🔍 Review and test backup procedures

---

## 📊 Verification Checklist

After running the recovery script, verify:

- [ ] Script completed without errors
- [ ] Database state check shows expected record counts
- [ ] Admin user can log in (username: admin, password: admin123)
- [ ] Kepsek user can log in (username: kepsek, password: kepsek123)
- [ ] Teacher users can log in (username: guru1, password: guru123)
- [ ] Parent users can log in (username: ortu1, password: ortu123)
- [ ] RPP Templates are accessible (should have 15 templates)
- [ ] School information is correct
- [ ] Classes are created (A1, B1)
- [ ] Students are enrolled

---

## 📁 Important Files

- **Recovery Script:** `./recover-data.sh`
- **Recovery Plan:** `DATA_LOSS_ANALYSIS_AND_RECOVERY_PLAN.md`
- **Database:** `db/custom.db`
- **Seed Files:** `prisma/seed-*.ts`
- **Schema:** `prisma/schema.prisma`

---

## 🚀 Getting Help

If you encounter issues:

1. Check the full recovery plan document for detailed information
2. Review the error messages carefully
3. Check that all dependencies are installed
4. Verify database connection settings

**Document Reference:** See `DATA_LOSS_ANALYSIS_AND_RECOVERY_PLAN.md` for complete analysis and prevention measures.

---

**Last Updated:** March 24, 2026
**Recovery Script Version:** 1.0
