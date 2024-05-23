'use client';
 
import type { NextPage } from "next";
import { authenticate } from '@/app/api/auth/actions';
import Link from 'next/link';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginUser } from '@/app/api/auth/authValidationSchema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";

const LoginPage: NextPage = () => {
  const form = useForm<LoginUser>({
    resolver: zodResolver(LoginSchema),
  });

  const { formState: { errors, isValid }} = form;

  const onSubmit: SubmitHandler<LoginUser> = async (data) => {
    console.log("data", data);
    
    if(isValid){
      console.log("login page true");
      
      const result = await authenticate(undefined, data);
      console.log("res", result);

      if(result === 'Verify your email first'){
        toast.error("Verify your email first");
      }

      if(result === 'CredentialSignin'){
        toast.error("Invalid credentials");
      }

    }else{
      console.log("Something Went wrong.");
    }
  }
 
  return (
    <Form {...form}>
      <section className="w-[550px] flex flex-col items-center justify-center py-0 px-5 box-border max-w-full">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[700px] flex flex-col items-start justify-start max-w-full mb-4 pl-14 pr-14 lg:pl-0 lg:pr-0">
          <p className="mb-6 lg:mb-10 lg:text-xl lg:font-semibold">Hello friend! Welcome back</p>
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
          </div>
          <Button className="cursor-pointer rounded-lg py-4 px-6 mt-4 self-stretch h-12 lg:mb-6 flex flex-row items-center justify-center box-border gap-[8px]">
            <b className="relative lg:text-lg leading-[28px] text-center">
              Login
            </b>
          </Button>
          <div className="flex items-center pl-5 lg:pl-[65px] pt-2">
            <p className="text-sm lg:text-lg mr-2">Forgot Password?</p>
            <Link href="/login/forgotpassword" className="text-primary text-sm lg:text-lg font-semibold">Reset Password</Link>
          </div>
        </form>
      </section>
    </Form>
  );
}

export default LoginPage;
