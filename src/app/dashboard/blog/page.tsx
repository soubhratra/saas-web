import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { simpleBlogCard } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";


export const revalidate = 30; 

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

export default async function Blog() {

  const isAuthenticated = await auth();
  let data: simpleBlogCard[] = [];

  if (isAuthenticated) {
    data = await getData();
    console.log(data);
  } else {
    redirect("/");
  }
  
  return (
    <>
  <h1 className="text-4xl font-semibold pl-10 pt-10">Saas<span className="text-[#55B6BD]">Blog</span></h1>
 
    <div className="grid lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-2  items-center gap-4 p-10">
      {data.map((post, idx) => (
      // <Link key={idx} href={`blog/${post.currentSlug}`}>=
        <Card  className="max-w-sm hover:opacity-90" key={idx}>
          <Image
            src={urlFor(post.titleImage).url()}
            alt="image"
            width={500}
            height={500}
            className="rounded-t-lg  h-[200px] object-cover"
          />
          <CardContent className="">
            <CardTitle className="text-lg line-clamp-2 font-bold">{post.title}</CardTitle>
            <p className="line-clamp-3 text-sm  text-gray-600 dark:text-gray-300">
              {post.smallDescription}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`blog/${post.currentSlug}`}>
              <Button className="w-[300px] md:w-full lg:w-full">Read More</Button>
            </Link>
          </CardFooter>
        </Card>
        // </Link>
      ))}
    </div>
    
    </>
  );
}