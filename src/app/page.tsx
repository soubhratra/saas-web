import { redirect } from "next/navigation";
import { Navbar } from "./components/Navbar";
import { auth } from "@/auth";
import { client  } from "./lib/sanity";

async function getBlogData() {
  console.log("entered");
  const blogQuery = `*[_type == 'blog'] | order(_createdAt desc) {
    title,
      smallDescription,
      "currentSlug": slug.current
  }`;

  const data = await client.fetch(blogQuery);
  console.log("data", data);

  return data;
}

export default async function Home() {

  if (await auth()) {
    const blogData = await getBlogData();
    console.log("blogData", blogData);

    return redirect("/dashboard");
  }
  
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
    </>
  );
}