'use client';

import { Inter } from 'next/font/google';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupUser } from '@/app/api/auth/authValidationSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { NextPage } from 'next';
import Link from 'next/link';

const  SignupForm: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const form = useForm<SignupUser>({
    resolver: zodResolver(SignupSchema),
  });

  const { formState: { errors, isValid }} = form;

  const onSubmit: SubmitHandler<SignupUser> = async (data) => {
    console.log("data", data);
    console.log("isValid", isValid);
    
    if(isValid){
      try{
        const response = await fetch(`/api/auth/signup`, {
          method: 'POST',
          body: JSON.stringify({
            given_name: data.given_name,
            family_name: data.family_name,
            email: data.email,
            password: data.password,
          }),
        });
        const responseData = await response.json();
        if(response.ok){
          setSuccessMessage(responseData.message);
          responseData && responseData.message && toast.success(responseData.message);
          router.push('/verifyemail');
        }else{
          setError(responseData.error || 'An unexpected error occurred');
          toast.error(responseData.error || 'An unexpected error occurred');
        }
      }catch (error) {
        if(error instanceof Error){
          console.log(error.stack);
        }
        console.error('Error creating account:', error);
        setError('This email is already registered');
        toast.error('This email is already registered');
      }
      }else{
        console.log("Something went wrong");
        toast.error('Something went wrong');
      }
    }

  return (
    <Form {...form}>
      <section className="w-[550px] flex flex-col items-center justify-center pb-8 px-5 box-border max-w-full">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[700px] flex flex-col items-start justify-start max-w-full mb-4 pl-14 pr-14 lg:pl-0 lg:pr-0">
          <p className="mb-6 lg:mb-10 lg:text-xl lg:font-semibold">Register</p>
          <div className="self-stretch flex flex-col items-start justify-start gap-[10px] max-w-full">
            <div className="self-stretch flex flex-col items-start justify-start w-full mb-2 lg:mb-3">
              <FormField
                control={form.control}
                name="given_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="lg:text-lg">First Name</FormLabel>
                    </div>
                    <FormControl>
                      <Input className="self-stretch border bg-white h-11 w-[270px] md:w-[320px] lg:w-[430px] flex-1 rounded-lg mt-1 mb-3 box-border font-medium lg:text-lg text-black"   
                        placeholder="Enter your first name"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                    {errors.given_name &&
                      <p className="text-red-500 text-sm lg:text-lg mb-2">
                          {errors.given_name?.message}
                      </p>
                    }
                    </FormItem>
                  )}
              />
            </div>
            <div className="self-stretch flex flex-col items-start justify-start w-full mb-2 lg:mb-3">
              <FormField
                control={form.control}
                name="family_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="lg:text-lg">Last Name</FormLabel>
                    </div>
                    <FormControl>
                      <Input className="self-stretch border bg-white h-11 w-[270px] md:w-[320px] lg:w-[430px] flex-1 rounded-lg mt-1 mb-3 box-border font-medium lg:text-lg text-black"   
                        placeholder="Enter your last name"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                    {errors.family_name &&
                      <p className="text-red-500 text-sm lg:text-lg mb-2">
                          {errors.family_name?.message}
                      </p>
                    }
                  </FormItem>
                )}
              />
            </div>
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
            <div className="self-stretch flex flex-col items-start justify-start w-full mb-2 lg:mb-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="lg:text-lg">Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input className="self-stretch border bg-white h-11 w-[270px] md:w-[320px] lg:w-[430px] flex-1 rounded-lg mt-1 mb-3 box-border font-medium lg:text-lg text-black"   
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                    {errors.password &&
                      <p className="text-red-500 text-sm lg:text-lg mb-2">
                          {errors.password?.message}
                      </p>
                    }
                  </FormItem>
                )}
              />
            </div>
            <div className="self-stretch flex flex-col items-start justify-start w-full mb-2 lg:mb-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="lg:text-lg">Confirm Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input className="self-stretch border bg-white h-11 w-[270px] md:w-[320px] lg:w-[430px] flex-1 rounded-lg mt-1 mb-3 box-border font-medium lg:text-lg text-black"   
                        placeholder="Re-enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                    {errors.confirmPassword &&
                      <p className="text-red-500 text-sm lg:text-lg mb-2">
                          {errors.confirmPassword?.message}
                      </p>
                    }
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button className="cursor-pointer rounded-lg py-4 px-6 mt-4 self-stretch h-12 lg:mb-6 flex flex-row items-center justify-center box-border gap-[8px]">
            <b className="relative lg:text-lg leading-[28px] text-center">
              Sign up
            </b>
          </Button>
          <div className="flex items-center pl-5 lg:pl-[65px] pt-2">
            <p className="text-sm lg:text-lg mr-2">Already have an account?</p>
            <Link href="/login" className="text-primary text-sm lg:text-lg font-semibold">Login</Link>
          </div>
        </form>
      </section>
    </Form>
  );
}

export default SignupForm;