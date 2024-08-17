'use client';
 
import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyPasswordForm() {

  return (
    <form className='space-y-3 items-center justify-center'>
      <Card className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <CardHeader>
          <CardTitle className='lg:pl-[80px] items-center justify-center'>Reset your password</CardTitle>
        </CardHeader>
        <CardContent className='w-full'>
          <div className='mt-4'>
            <p className='lg:text-lg'>Check your email.</p>
            <p className='lg:text-lg'>We have sent a password reset link to email.</p>
          </div>
        </CardContent>
        <div className='lg:pl-[140px]'>
          <Link href = "/login">
            <Button className="cursor-pointer rounded-lg py-4 px-6 mt-4 self-stretch h-12 lg:mb-6 flex flex-row items-center justify-center box-border gap-[8px]">
              <b className="relative lg:text-lg leading-[28px] text-center">
                Go to login
              </b>
            </Button>
          </Link>
        </div>
      </Card>
   </form>
  );
}