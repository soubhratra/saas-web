import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers';
import { error } from 'console';
import prisma from '@/app/lib/db';
import { ResetPasswordIntermediateSchema } from '../authValidationSchema';

export async function POST(request: Request) {
  try {
    const { password } = await request.json(); 

    //server-side validations
    const result = ResetPasswordIntermediateSchema.safeParse({password});
    if(!result.success){
      let errorMessage = "";
      result.error.issues.forEach((issue: any) => {
        errorMessage = errorMessage + issue.path[0] + ":" + issue.message + ". ";
      });
      console.log(errorMessage);
      return NextResponse.json({ message: 'Something went wrong' }, {status: 400});
    }

    const referer = headers().get('referer');
    if (!referer){
      console.log("referer error")
      throw error
    }
    const url = new URL(referer)
    const forgotPasswordToken = url.searchParams.get("token");
    
    //hash password
    const hashedPassword = await hash(password, 10)
     
    //Insert new password into the database
    if (forgotPasswordToken){
      const updatedUser = await prisma.user.update({
        where: { id: forgotPasswordToken },
        data: { password: hashedPassword },
      })
    }
    console.log("Password Changed Successfully");
    return NextResponse.json({ message: 'Password Changed Successfully' })
  }catch(e: any){
    console.log("Something went wrong", e);
    return NextResponse.json({ message: 'Something went wrong' }, {status: 400})
  }
}