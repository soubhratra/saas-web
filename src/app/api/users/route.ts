import { NextResponse } from 'next/server';
import prisma from '../../lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        given_name: true,
        family_name: true,
        email: true,
        userRole: true,
        accountStatus: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
