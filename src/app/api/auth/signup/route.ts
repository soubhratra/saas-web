import { NextResponse } from 'next/server';
import { VerifyEmailEmailTemplate } from '@/app/(auth)/verifyemail/email/verify-email-email';
import { headers } from 'next/headers';
import { RegisterSchema } from '../authValidationSchema';
import { sendEmail } from '@/app/components/emails/sendEmail';
import { createUser } from '../data';

export async function POST(request: Request) {
  try {
    const { given_name, family_name, email, password } = await request.json();
    const SignupDetails = {
      email: email,
      password: password,
      given_name: given_name,
      family_name: family_name,
    };
    //server-side validations
    const result = RegisterSchema.safeParse(SignupDetails);
    if(!result.success){
      let errorMessage = "";
      result.error.issues.forEach((issue: any) => {
        errorMessage = errorMessage + issue.path[0] + ":" + issue.message + ". ";
      });
      console.log(errorMessage);
      return NextResponse.json({ message: 'Something went wrong' }, {status: 400});
    }

    const signupQuery = await createUser(given_name, family_name, email, password);
    const id = signupQuery.id
    
    const headersList = headers();
    const host = headersList.get('host') || "";
    const protocol = headersList.get('x-forwarded-proto') || "";
      
    await sendEmail({
      from: 'Veye <support@veye.co>',
      to: [email],
      subject: 'Verify your email address',
      react: VerifyEmailEmailTemplate({ email, id , host, protocol}) as React.ReactElement,
    });
      
    console.log("Signup Successful");
    return NextResponse.json({ message: 'Signup Successful' });
  }catch(e: any){
    // Check if the error is a duplicate key violation (unique constraint violation)
    if (e.code === '23505') {
    console.log("Email already registered");
      return NextResponse.json({ message: 'This email is already registered' }, {status: 400});
    }
    console.log("Something went wrong", e);
    return NextResponse.json({ message: 'Something went wrong' }, {status: 400});
  }
}