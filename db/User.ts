import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "./index";

//Creating user
export async function createUser(newUser: UserCreateFields): Promise<User> {
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const createdUser: User = await prisma.user.create({
    data: { ...newUser, password: hashedPassword },
  });

  return createdUser;
}

//Deleting user

export async function deleteUser(userId: string): Promise<User> {
  const deletedUser: User = await prisma.user.delete({ where: { id: userId } });

  return deletedUser;
}

//updating user

export async function updateUser(
  userId: string,
  fieldsToUpdate: UserUpdateFields
): Promise<User> {
  const updatedUser: User = await prisma.user.update({
    where: {
      id: userId,
    },
    data: fieldsToUpdate,
  });

  return updatedUser;
}

//change password
export async function changeUserPassword(
  userId: string,
  newPassword: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return updatedUser;
}
