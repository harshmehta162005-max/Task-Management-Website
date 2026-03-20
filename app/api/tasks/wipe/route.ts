import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET() {
  try {
    const result = await db.task.updateMany({
      where: { description: 'Added' },
      data: { description: '' }
    });
    return NextResponse.json({ success: true, count: result.count });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
