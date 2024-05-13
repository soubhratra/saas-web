'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, ForgotPasswordUser } from '@/app/api/auth/authValidationSchema';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  
  const form = useForm<ForgotPasswordUser>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { formState: { errors, isValid }} = form;
  
  const onSubmit: SubmitHandler<ForgotPasswordUser> = async (data) => {
    console.log("data", data);

    if(isValid){
      try {
        const response = await fetch(`/api/auth/forgotpassword`, {
          method: 'POST',
          body: JSON.stringify({
          email: data.email,
          })
        })

        const responseData = await response.json()
        if(response.ok){
          setSuccessMessage(responseData.message)
          responseData && responseData.message && toast.success(responseData.message);
          router.push('/login/verifypassword')
        }else{
          setError(responseData.error || 'An unexpected error occurred')
          toast.error(responseData.error || 'There is no registered user with this email');
        }
      }catch(error){
        console.error('There is no registered user with this email:', error)
        setError('There is no registered user with this email')
        toast.error('There is no registered user with this email')
      }
    }else{
      console.log("Something went wrong");
      toast.error('Something went wrong');
    }
  }

  return (
    <Form {...form}>
      <section className="w-[550px] flex flex-col items-center justify-center py-0 px-5 box-border max-w-full">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[700px] flex flex-col items-start justify-start max-w-full mb-4 pl-14 pr-14 lg:pl-0 lg:pr-0">
          <p className="mb-6 lg:mb-10 lg:text-xl lg:font-semibold">Forgot Password</p>
          <div className="self-stretch flex flex-col items-start justify-start gap-[10px] max-w-full">
            <div className="self-stretch flex flex-col items-start justify-start w-full mb-2 lg:mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="lg:text-lg">Email</FormLabel>
                    </div>
                    <FormControl>
                      <Input className="self-stretch border bg-white h-11 w-[270px] md:w-[320px] lg:w-[430px] flex-1 rounded-lg mt-1 mb-3 box-border font-medium lg:text-lg text-black"   
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                    {errors.email &&
                      <p className="text-red-500 text-sm lg:text-lg mb-2">
                          {errors.email?.message}
                      </p>
                    }
                    </FormItem>
                  )}
              />
            </div>
          </div>
          <Button className="cursor-pointer rounded-lg py-4 px-6 mt-4 self-stretch h-12 lg:mb-6 flex flex-row items-center justify-center box-border gap-[8px]">
            <b className="relative lg:text-lg leading-[28px] text-center">
              Send Link 
            </b>
          </Button>
        </form>
      </section>
    </Form>
  );
}