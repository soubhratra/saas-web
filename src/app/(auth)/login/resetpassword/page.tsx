import React from "react";
import ResetPasswordForm from '@/app/(auth)/login/resetpassword/resetpassword-form'
import { getUserById } from "@/app/api/auth/data";
import PasswordChangeMessageComponent from "./passwordChangedMessage";

interface ResetPasswordPageProps{
    searchParams : { [key: string]: string | string[] | undefined };
}

const ResetPasswordPage = async ({searchParams }: ResetPasswordPageProps) => {
  let passwordResetToken : string;

  if (searchParams.token) {
    passwordResetToken = Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token;
    try{
      const user = await getUserById(passwordResetToken);
      if (!user) {
        return (
          <PasswordChangeMessageComponent 
            title = "Password can not be changed." 
            message="Invalid password reset token found. Check your email again."
          />
        );
      }
    }catch(error){
      console.log("error is", error);
      return (
        <PasswordChangeMessageComponent 
          title = "Password can not be changed." 
          message="Invalid password reset token found. Check your email again."
        />
      );
    }
  return(
  <ResetPasswordForm/>)
  }else{
    return(
      <PasswordChangeMessageComponent 
        title = "Password can not be changed." 
        message="No password reset token found. Check your email again."
      />
    );
  }
}

export default ResetPasswordPage;