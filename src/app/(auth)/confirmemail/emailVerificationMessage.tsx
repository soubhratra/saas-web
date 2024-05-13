import React from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const inter = Inter({ subsets: ["latin"] });

interface MessageComponentProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
}

const EmailVerificationMessageComponent: React.FC<MessageComponentProps> = ({ title, message, buttonText, buttonLink }) => (
  <form className='space-y-3 items-center justify-center'>
    <Card className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
      <CardHeader>
        <CardTitle className='lg:pl-[90px] items-center justify-center'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='w-full'>
        <div className='mt-4'>
          <p className='lg:text-lg'>{message}</p>
        </div>
      </CardContent>
      {buttonText && buttonLink && (
        <div className='lg:pl-[140px]'>
          <Link href = {buttonLink}>
            <Button className="cursor-pointer rounded-lg py-4 px-6 mt-4 self-stretch h-12 lg:mb-6 flex flex-row items-center justify-center box-border gap-[8px]">
              <b className="relative lg:text-lg leading-[28px] text-center">
                {buttonText}
              </b>
            </Button>
          </Link>
        </div>
      )}
    </Card>
  </form>
);

export default EmailVerificationMessageComponent;