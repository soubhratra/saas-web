"use server";

import prisma from "@/app/lib/db";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '../../../auth';
import { getVerifiedUserByEmail } from "./data";
import { LoginSchema, ProfileUpdateSchema } from '@/app/api/auth/authValidationSchema';
import { AuthError } from "next-auth";
import { client } from "@/app/lib/sanity";
import { z } from "zod";
import { type CategoryTypes } from "@prisma/client";
import { digitalMarketPlaceStripe, stripe } from "@/app/lib/stripe";
import { auth } from "@/auth";
import { getUserByEmail } from "@/app/api/auth/data";

export async function authenticate(
  prevState: string | undefined,
  formData: { email: string; password: string; },
) { 
  try {
    if(formData){
      //server-side validations
      const result = LoginSchema.safeParse(formData);
      if(!result.success){
        let errorMessage = "";
        result.error.issues.forEach((issue: any) => {
          errorMessage = errorMessage + issue.path[0] + ":" + issue.message + ". ";
        });
        console.log(errorMessage);
        return 'Something went wrong';
      }

      const email = formData.email;
      const password = formData.password;
      let res = await getVerifiedUserByEmail(email);
      
      if (res == null){
        return 'Verify your email first'
      }
      const formUserData = new FormData();
      formUserData.append('email', email);
      formUserData.append('password', password);
      await signIn('credentials', Object.fromEntries(formUserData));
    }
  }
   catch (error: any) {
    console.log("true");
    if(error instanceof AuthError){
      console.log("Credentials Invalid");
      return 'CredentialSignin';
    }
    throw error;
  }
}

const UpdateProfile = ProfileUpdateSchema.omit({ email: true });

export async function updateProfile(email: string, formData: { name: string, email: string }) {
  //server-side validations
  const result = ProfileUpdateSchema.safeParse(formData);
  if(!result.success){
    let errorMessage = "";
    result.error.issues.forEach((issue: any) => {
      errorMessage = errorMessage + issue.path[0] + ":" + issue.message + ". ";
    });
    console.log(errorMessage);
    return 'Something went wrong';
  }
  const { given_name } = UpdateProfile.parse({
    name: formData.name,
  });

  try {
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { given_name: given_name },
    })
  } catch (error) {
    console.log(error);
    return { message: 'Database Error: Failed to Update Profile.' };
  }
  revalidatePath('/dashboard/profile');
  redirect('/dashboard/profile');
}

export async function getBlogData() {
  try {
    console.log('Fetching blog data...');
    const blogQuery = `*[_type == 'blog'] | order(_createdAt desc) {
      title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage
    }`;

    const data = await client.fetch(blogQuery);
    console.log('Data fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
}

export type State = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The name has to be a min charackter length of 5" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(1, { message: "The Price has to be bigger then 1" }),
  smallDescription: z
    .string()
    .min(10, { message: "Please summerize your product more" }),
  description: z.string().min(10, { message: "Description is required" }),
  images: z.array(z.string(), { message: "Images are required" }),
  productFile: z
    .string()
    .min(1, { message: "Pleaes upload a zip of your product" }),
});

const userSettingsSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),

  lastName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),
});

export async function SellProduct(prevState: any, formData: FormData) {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Something went wrong");
  }

  const validateFields = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    smallDescription: formData.get("smallDescription"),
    description: formData.get("description"),
    images: JSON.parse(formData.get("images") as string),
    productFile: formData.get("productFile"),
  });

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const data = await prisma.product.create({
    data: {
      name: validateFields.data.name,
      category: validateFields.data.category as CategoryTypes,
      smallDescription: validateFields.data.smallDescription,
      price: validateFields.data.price,
      images: validateFields.data.images,
      productFile: validateFields.data.productFile,
      userId: user.id,
      description: JSON.parse(validateFields.data.description),
    },
  });

  return redirect(`/product/${data.id}`);
}

export async function UpdateUserSettings(prevState: any, formData: FormData) {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("something went wrong");
  }

  const validateFields = userSettingsSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const data = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      given_name: validateFields.data.firstName,
      family_name: validateFields.data.lastName,
    },
  });

  const state: State = {
    status: "success",
    message: "Your Settings have been updated",
  };

  return state;
}

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      smallDescription: true,
      price: true,
      images: true,
      productFile: true,
      User: {
        select: {
          connectedAccountId: true,
        },
      },
    },
  });

  const session = await digitalMarketPlaceStripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((data?.price as number) * 100),
          product_data: {
            name: data?.name as string,
            description: data?.smallDescription,
            images: data?.images,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      link: data?.productFile as string,
    },

    payment_intent_data: {
      application_fee_amount: Math.round((data?.price as number) * 100) * 0.1,
      transfer_data: {
        destination: data?.User?.connectedAccountId as string,
      },
    },
    success_url:
      process.env.NODE_ENV === "production"
        ? (process.env.PRODUCTION_URL as string)
        : "https://localhost:3000/dashboard/sell/payment/success",
    cancel_url:
      process.env.NODE_ENV === "production"
      ? (process.env.PRODUCTION_URL as string)
      : "https://localhost:3000/dashboard/sell/payment/cancelled",
  });

  return redirect(session.url as string);
}

export async function CreateStripeAccoutnLink() {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error();
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const accountLink = await digitalMarketPlaceStripe.accountLinks.create({
    account: data?.connectedAccountId as string,
    refresh_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/sell/billing`
        : (process.env.PRODUCTION_URL as string),
    return_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/dashboard/sell/return/${data?.connectedAccountId}`
        :  (process.env.PRODUCTION_URL as string),
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error();
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const loginLink = await stripe.accounts.createLoginLink(
    data?.connectedAccountId as string
  );

  return redirect(loginLink.url);
}