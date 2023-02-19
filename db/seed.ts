import { PrismaClient, User } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

async function main(): Promise<void> {
  // create an initial user
  await prisma.$connect();
  const user: User = await prisma.user.create({
    data: {
      username: "newUser1234",
      email: "email2@gmail.com",
      password: "pass1234",
      profile_img: "none",
    },
  });

  console.log(user);
}

main().then(async (): Promise<void> => {
  await prisma.$disconnect();
});
