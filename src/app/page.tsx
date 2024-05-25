import { redirect } from 'next/navigation';
import { Navbar } from './components/Navbar';
import { auth } from '@/auth';
import { Card, CardContent } from "@/components/ui/card";
import { simpleBlogCard } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData() {
  const query = `
  *[_type == 'blog'] | order(_createdAt desc) {
    title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function Home() {
  const isAuthenticated = await auth();
  if (isAuthenticated) {
    return redirect('/dashboard');
  }

  const blogData: simpleBlogCard[] = await getData();

  return (
    <>
      <Navbar/>
      <section className="flex items-center justify-center bg-background h-[90vh]">
        <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div>
              <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
                Welcome
              </h1>
              <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground"></p>
            </div>
            <div className="flex justify-center max-w-sm mx-auto mt-10"></div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1  md:grid-cols-2 mt-5 gap-5">
      {blogData.map((post, idx) => (
        <Card key={idx}>
          <Image
            src={urlFor(post.titleImage).url()}
            alt="image"
            width={500}
            height={500}
            className="rounded-t-lg h-[200px] object-cover"
          />

          <CardContent className="mt-5">
            <h3 className="text-lg line-clamp-2 font-bold">{post.title}</h3>
            <p className="line-clamp-3 text-sm mt-2 text-gray-600 dark:text-gray-300">
              {post.smallDescription}
            </p>
            <Button asChild className="w-full mt-7">
              <Link href={`/blog/${post.currentSlug}`}>Read More</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  );
}