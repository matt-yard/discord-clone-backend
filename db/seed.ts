import { Channel, Server, User, Prisma } from "@prisma/client";
import {
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getUserByEmail,
} from "./User";

import prisma from "./index";
import { addMemberToServer, removeMemberFromServer } from "./Server";

async function main(): Promise<void> {
  await prisma.$connect();

  try {
    console.log("Deleting data to re-seed...");
    await prisma.message.deleteMany();
    await prisma.channel.deleteMany();
    await prisma.member.deleteMany();
    await prisma.role.deleteMany();
    await prisma.server.deleteMany();
    await prisma.user.deleteMany();

    console.log("Creating users...");
    const newUser: User = await prisma.user.create({
      data: {
        username: "matt123",
        email: "test@mail.com",
        password: "pass1234",
      },
    });

    const newUser2: User = await prisma.user.create({
      data: {
        username: "wittyloc",
        email: "witty@mail.com",
        password: "pass1234",
      },
    });

    console.log("Successfully created users!");
    console.log("Creating server...");

    const newServer: Server = await prisma.server.create({
      data: {
        name: "matts-awesome-server",
      },
    });

    console.log("Successfully created server!");
    console.log("creating channel...");

    const newChannel: Channel = await prisma.channel.create({
      data: {
        name: "general",
        type: "text",
        serverId: newServer.id,
      },
    });

    console.log("succesfully created channel!");

    //add users to the server
    console.log("Adding users to the serve...");

    await prisma.server.update({
      where: {
        id: newServer.id,
      },
      data: {
        members: {
          create: [{ userId: newUser.id }, { userId: newUser2.id }],
        },
      },
    });

    console.log("Succesfully added users!");

    // // making some messages

    console.log("Creating some initial messages...");
    const newMessages: Prisma.BatchPayload = await prisma.message.createMany({
      data: [
        {
          content: "Hello world!",
          authorId: newUser.id,
          channelId: newChannel.id,
        },
        {
          content: "Thanks for adding me",
          authorId: newUser2.id,
          channelId: newChannel.id,
        },
        {
          content: "test message 13",
          authorId: newUser2.id,
          channelId: newChannel.id,
        },
        {
          content: "goodbye world!",
          authorId: newUser.id,
          channelId: newChannel.id,
        },
      ],
    });

    console.log("succesfully created messages!");
    // testing querying
    // selecting newUser, testing for server list and messages list

    console.log("Testing querying for a user...");
    const selectedUser = await prisma.user.findFirst({
      where: { id: newUser.id },
      select: {
        username: true,
        id: true,
        profileImage: true,
        servers: {
          include: {
            server: true,
          },
        },
      },
    });

    await prisma.user.findFirst({
      select: {
        username: true,
        id: true,
        profileImage: true,
      },
      where: {
        id: newUser.id,
      },
    });

    // testing selection of server and it's data, should give list of members and channels along with it.
    console.log("Testing querying for a server...");
    const selectedServer = await prisma.server.findFirst({
      where: { id: newServer.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                username: true,
                profileImage: true,
                id: true,
              },
            },
          },
        },
        channels: true,
      },
    });

    // on frontend, upon navigating to a specific channel in the server, messages
    // will be fetched, along with information about the user that sent it

    console.log("Testing querying for a channel...");
    const selectedChannel = await prisma.channel.findFirst({
      where: { id: newChannel.id },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
      },
    });

    console.log("Results..");
    console.log("--------------------");
    console.log("Here is the selected user!", selectedUser);
    console.log("--------------------");
    console.log("Here is the selected server", selectedServer);
    console.log(
      "first member in the members array of selectedServer",
      selectedServer?.members[0].user
    );
    console.log("--------------------");
    console.log("Here is the selected channel", selectedChannel);
  } catch (error) {
    console.log(error);
  }
}

//// Creating a new seed function to test user methods

async function seed(): Promise<void> {
  const newUser: UserCreateFields = {
    username: "testUser123",
    password: "pass1234",
    email: "testmail@email.com",
  };

  console.log("creating user...");
  const createdUser: User = await createUser(newUser);
  console.log("created User: ", createdUser);
  //adding user to a server to test if delete also takes them out:

  // await addMemberToServer(createdUser.id, "63f2b771456e3126204a62f2");

  // await prisma.server.update({
  //   where: {
  //     id: "63f27d64e1f25d86f9912ca1",
  //   },
  //   data: {
  //     members: {
  //       create: [{ userId: createdUser.id }],
  //     },
  //   },
  // });

  console.log("updating user...");
  const updateFields: UserUpdateFields = {
    username: "updatedUsernam",
  };

  const updatedUser: User = await updateUser(createdUser.id, updateFields);

  console.log("user after update: ", updatedUser);

  console.log("changing user password");

  const newPasswordUser: User = await changeUserPassword(
    updatedUser.id,
    "mynewPass123"
  );
  console.log("user after changing password: ", newPasswordUser);

  // console.log("deleting user...");
  // const deletedUser: User = await deleteUser(createdUser.id);

  // console.log("return value from delete user function: ", deletedUser);
}

// main();

async function test(): Promise<void> {
  const user: UserPublicInfo | null = await getUserByEmail("test@mail.com");
  console.log(user);
}

// seed();
test();
