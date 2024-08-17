import React from 'react';
import prisma from "@/app/lib/db";
import { getUserById } from '@/app/api/auth/data';
import EmailVerificationMessageComponent from "./emailVerificationMessage";

interface ConfirmEmailPageProps {
    searchParams : { [key: string]: string | string[] | undefined };
}

const ConfirmEmailPage = async ({searchParams }: ConfirmEmailPageProps) => {
  let confirmEmailToken : string;

  if (searchParams.token) {
    confirmEmailToken = Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token;
    try{
      const user = await getUserById(confirmEmailToken);

      if (!user) {
        return (
          <EmailVerificationMessageComponent 
            title="Account not verified." 
            message ="Invalid token found. Check your email again."
          />
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: confirmEmailToken },
        data: { accountStatus: 'Active' },
      });
      console.log("status updated");

      return (
        <EmailVerificationMessageComponent
          title="Account Verified."
          message="Thank you for signing up to SaaS Accelerator. Please continue to login."
          buttonText="Go to login"
          buttonLink="/login"
        />
      );
        
    }catch(error){
      return(
        <EmailVerificationMessageComponent 
          title = "Account not verified." 
          message="Invalid token found. Check your email again."
        />
      );
    }
  }else{
    return (
      <EmailVerificationMessageComponent 
        title = "Account not verified." 
        message="No verification token found. Check your email again."
      />
    );
  }
};


export default ConfirmEmailPage;