import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkHolidayField() {
  try {
    // Try to query with isHoliday field
    const attendance = await prisma.studentAttendance.findFirst({
      select: {
        id: true,
        date: true,
        isHoliday: true
      }
    });

    if (attendance) {
      console.log('✅ isHoliday field exists in database');
      console.log('Sample record:', {
        id: attendance.id,
        date: attendance.date,
        isHoliday: attendance.isHoliday
      });
    } else {
      console.log('✅ isHoliday field exists (but no records found)');
    }

    // Count total records
    const count = await prisma.studentAttendance.count();
    console.log(`Total attendance records: ${count}`);
  } catch (error: any) {
    console.error('❌ Error checking isHoliday field:', error.message);
    if (error.message.includes('isHoliday')) {
      console.log('❌ isHoliday field does NOT exist in database');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkHolidayField();
