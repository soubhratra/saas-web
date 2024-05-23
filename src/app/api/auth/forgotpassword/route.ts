import { NextResponse } from 'next/server'
import { ResetPasswordTemplate } from '@/app/(auth)/login/resetpassword/email/resetpassword-template'
import { sendEmail } from '@/app/components/emails/sendEmail'
import { headers } from 'next/headers';
import { error } from 'console';
import { getVerifiedUserByEmail } from '@/app/api/auth/data';
import { ForgotPasswordSchema } from '../authValidationSchema';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("email", email);
    
    const ForgotPasswordDetails = {
      email: email,
    };
    //server-side validations
    const result = ForgotPasswordSchema.safeParse(ForgotPasswordDetails);
    if(!result.success){
      let errorMessage = "";
      result.error.issues.forEach((issue: any) => {
        errorMessage = errorMessage + issue.path[0] + ":" + issue.message + ". ";
      });
      console.log(errorMessage);
      return NextResponse.json({ message: 'Something went wrong' }, {status: 400});
    }

    const user = await getVerifiedUserByEmail(email); 
    console.log("user", user);
    
    if(!user){
      throw error
    }
    const id = user?.id
    const headersList = headers();
    const host = headersList.get('host') || "";
    const protocol = headersList.get('x-forwarded-proto') || "";
    console.log("protocol",protocol);

    await sendEmail({
      from: 'Veye <support@veye.co>',
      to: [email],
      subject: 'Reset your password',
      react: ResetPasswordTemplate({ email, id , host, protocol}) as React.ReactElement,
    });
    console.log("Email Sent Successfully");
    return NextResponse.json({ message: 'Email Sent Successfully' })
  }catch(e: any){
    console.log("There is no registered user with this email");
    return NextResponse.json({ message: 'There is no registered user with this email' }, {status:400})
  }
}