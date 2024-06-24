import prisma from '../../app/lib/db';

export default async function getUsersWithListings() {
  const users = await prisma.user.findMany({
    include: {
      listings: true,
    },
  });
  return JSON.parse(JSON.stringify(users));
}