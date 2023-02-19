import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "./index";

//create user
export async function createUser(newUser: UserCreateFields): Promise<User> {
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const createdUser: User = await prisma.user.create({
    data: { ...newUser, password: hashedPassword },
  });

  return createdUser;
}

// read user

// getUserForLogin returns the password so that it can be verified by the API on login
// return value of this function should NEVER be sent to the frontend by the API
export async function getUserForLogin(username: string): Promise<User | null> {
  const user: User | null = await prisma.user.findFirst({
    where: { username: username },
  });

  return user;
}

// getById and getByUsername will only return public info about the user
export async function getUserById(
  userId: string
): Promise<UserPublicInfo | null> {
  const user: UserPublicInfo | null = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      profileImage: true,
      createdAt: true,
    },
  });

  return user;
}

export async function getUserByUsername(
  username: string
): Promise<UserPublicInfo | null> {
  const user: UserPublicInfo | null = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
      profileImage: true,
      createdAt: true,
    },
  });

  return user;
}

// get me
// Separate function to be used to get current user. this will include information about what
// servers the user is a member of, and should be protected on the API side, so that it is only
// ever called with the verified current user
export async function getMe(userId: string): Promise<UserAllInfo | null> {
  const me: UserAllInfo | null = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      username: true,
      id: true,
      email: true,
      createdAt: true,
      profileImage: true,
      servers: {
        include: {
          server: true,
        },
      },
    },
  });

  return me;
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

//Deleting user

export async function deleteUser(userId: string): Promise<User> {
  const deletedUser: User = await prisma.user.delete({ where: { id: userId } });

  return deletedUser;
}
