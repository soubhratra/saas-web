'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import prisma from "@/app/lib/db";

export async function createUserInAdmin(formData: FormData) {
//   const data = {
//     given_name: formData.get('given_name') as string,
//     family_name: formData.get('family_name') as string,
//     email: formData.get('email') as string,
//     stripeCustomerId: formData.get('stripeCustomerId') as string,
    // Subscription:
    //   formData.get('Subscription') != ''
    //     ? { connect: { id: formData.get('Subscription') as undefined } }
    //     : {},
//   }

//   const user = await prisma.user.create({ data })

//   if (user) {
//     redirect(`/dashboard/admin/users/${user.id}`)
//   }
}

export async function editUser(formData: FormData) {
  const id = formData.get('id') as string
  try {
    const data = {
      given_name: formData.get('given_name') as string,
      family_name: formData.get('family_name') as string,
      email: formData.get('email') as string,
      stripeCustomerId: formData.get('stripeCustomerId') as string,
    //   Subscription:
    //     formData.get('Subscription') != ''
    //       ? { connect: { id: formData.get('Subscription') as undefined } }
    //       : { disconnect: true },
    }

    await prisma.user.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error('[EDIT ACTION ERROR:', error)
    return { message: error }
  }

  redirect(`/dashboard/admin/users/${id}`)
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.user.delete({
      where: { id },
    })
  } catch (error) {
    console.error('DELETE ACTION ERROR:', error)
    return { message: 'Unable to delete user' }
  }

  revalidatePath(`/dashboard/admin/users`)
}
