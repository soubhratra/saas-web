'use client';

import React  from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyEmailForm() {

  return (
    <form className='space-y-3 items-center justify-center'>
      <Card className='flex-1 rounded-lg px-6 pb-4 pt-8'>
        <CardHeader>
          <CardTitle className='lg:pl-24 items-center justify-center'>Verify your email</CardTitle>
        </CardHeader>
        <CardContent className='w-full'>
          <div className='mt-4'>
            <p className='lg:text-lg'>Check your email.</p>
            <p className='lg:text-lg'>We have sent a verification link to email.</p>
          </div>
        </CardContent>
        <div className='lg:pl-40'>
          <Link href = "/login">
            <Button className="cursor-pointer rounded-lg py-4 px-6 mt-4 self-stretch h-12 lg:mb-6 flex flex-row items-center justify-center box-border gap-[8px]">
              <b className="relative lg:text-lg leading-[28px] text-center">
                Login
              </b>
            </Button>
          </Link>
        </div>
      </Card>
   </form>
  );
}