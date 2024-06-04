// import AcmeLogo from '@/components/acme-logo';
// import { Box } from '@mui/material';
import Image from 'next/image';
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex h-20 w-full items-end rounded-lg p-3 md:h-20 max-w-[400px] mx-auto mt-9 lg:mt-12 mb-6 lg:mb-9">
      <div className="w-full text-white pl-20">
        {/* <Link href="/">Home</Link> */}
      </div>
    </div>
  );
}