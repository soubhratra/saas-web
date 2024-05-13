"use server";

import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '../../../auth';
import { getVerifiedUserByEmail } from "./data";
import { LoginSchema, ProfileUpdateSchema } from '@/app/api/auth/authValidationSchema';
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: { email: string; password: string; },
) { 
  try {
    if(formData){
      //server-side validations
      const result = LoginSchema.safeParse(formData);
      if(!result.success){
        let errorMessage = "";
        result.error.issues.forEach((issue: any) => {
          errorMessage = errorMessage + issue.path[0] + ":" + issue.message + ". ";
        });
        console.log(errorMessage);
        return 'Something went wrong';
      }

      const email = formData.email;
      const password = formData.password;
      let res = await getVerifiedUserByEmail(email);
      
      if (res == null){
        return 'Verify your email first'
      }
      const formUserData = new FormData();
      formUserData.append('email', email);
      formUserData.append('password', password);
      await signIn('credentials', Object.fromEntries(formUserData));
    }
  }
   catch (error: any) {
    console.log("true");
    if(error instanceof AuthError){
      console.log("Credentials Invalid");
      return 'CredentialSignin';
    }
    throw error;
  }
}

const UpdateProfile = ProfileUpdateSchema.omit({ email: true });

export async function updateProfile(email: string, formData: { name: string, email: string }) {
  //server-side validations
  const result = ProfileUpdateSchema.safeParse(formData);
  if(!result.success){
    let errorMessage = "";
    result.error.issues.forEach((issue: any) => {
      errorMessage = errorMessage + issue.path[0] + ":" + issue.message + ". ";
    });
    console.log(errorMessage);
    return 'Something went wrong';
  }
  const { given_name } = UpdateProfile.parse({
    name: formData.name,
  });

  try {
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { given_name: given_name },
    })
  } catch (error) {
    console.log(error);
    return { message: 'Database Error: Failed to Update Profile.' };
  }
  revalidatePath('/dashboard/profile');
  redirect('/dashboard/profile');
}