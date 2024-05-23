import { User } from '@prisma/client/edge';
import { unstable_noStore as noStore } from 'next/cache';
import prisma from '@/app/lib/db';
import { hash } from 'bcryptjs';

export async function getUserById(id: string): Promise<User | null> {
  noStore();
  try{
    return await prisma.user.findUnique({ where: { id: id } });
  } catch (error){
    console.log("error", error);
    return null;
  }
}

export async function getUserByEmail(email: string){
  noStore();
  try {
    return await prisma.user.findFirst({ 
      where: { email: email } 
    });
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getUserprofileByEmail(email: string): Promise<User | null> {
  noStore();
  try{
    return await prisma.user.findFirst({ where: { email: email } });
  }catch (error){
    console.log("error", error);
    return null;
  }
}

export async function getVerifiedUserByEmail(email: string): Promise<User | null> {
  noStore();
  try {
    return await prisma.user.findFirst({
      where: { 
        email: email, 
        accountStatus: 'Active'
      }
    });
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function createUser(given_name: string, family_name:string, email: string, password: string) : Promise<User> {
  // Hash the password
  const hashedPassword = await hash(password, 10)
  const user = await prisma.user.create({
    data: {
      given_name: given_name,
      family_name: family_name,
      email: email,
      password: hashedPassword,
    },
  });
  
  return user;
}