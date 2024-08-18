// import AcmeLogo from '@/components/acme-logo';
// import { Box } from '@mui/material';
import Image from 'next/image';
import Link from "next/link";

export default function Header() {
  return (
    <>
      <Link href="/">
        <div className="border-b h-[10vh] flex justify-center items-center flex-grow mt-2 mb-3">
          <h2 className="text-2xl font-extrabold tracking-tighter ">
            SaaS Accelerator
          </h2>
        </div>
      </Link>
    </>
  );
}