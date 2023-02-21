import prisma from "./index";
import { Member, Server } from "@prisma/client";

// create server

export async function createNewServer(
  newServer: ServerCreateFields,
  ownerId: string
): Promise<Server> {
  const createdServer = await prisma.server.create({
    data: newServer,
  });
  const owner = await prisma.member.create({
    data: {
      serverId: createdServer.id,
      userId: ownerId,
      isOwner: true,
    },
  });

  return createdServer;
}

// read server
export async function getServerById(
  serverId: string
): Promise<(Server & ServerAllInfo) | null> {
  const server: (Server & ServerAllInfo) | null = await prisma.server.findFirst(
    {
      where: { id: serverId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileImage: true,
                createdAt: true,
              },
            },
          },
        },
        channels: true,
      },
    }
  );

  return server;
}

// update server

export async function updateServer(
  serverId: string,
  updateFeilds: ServerUpdateFields
): Promise<Server> {
  const updatedServer: Server = await prisma.server.update({
    where: {
      id: serverId,
    },
    data: updateFeilds,
  });

  return updatedServer;
}

// adding members to the server

export async function addMemberToServer(
  userId: string,
  serverId: string
): Promise<void> {
  await prisma.server.update({
    where: {
      id: serverId,
    },
    data: {
      members: {
        create: [{ userId: userId }],
      },
    },
  });
}

export async function addMemberByUsername(
  username: string,
  serverId: string
): Promise<void> {
  const memberToAdd = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (memberToAdd) {
    await prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          create: [{ userId: memberToAdd.id }],
        },
      },
    });
  }
}

export async function removeMemberFromServer(
  userId: string,
  serverId: string
): Promise<void> {
  await prisma.server.update({
    where: {
      id: serverId,
    },
    data: {
      members: {
        delete: [{ userId_serverId: { userId, serverId } }],
      },
    },
  });
}

// delete server

export async function deleteServer(serverId: string): Promise<Server> {
  const deletedServer: Server = await prisma.server.delete({
    where: {
      id: serverId,
    },
  });

  return deletedServer;
}

// check if a user belongs to server

export async function userIsMember(
  userId: string,
  serverId: string
): Promise<boolean> {
  const member: Member | null = await prisma.member.findFirst({
    where: {
      userId: userId,
      serverId: serverId,
    },
  });
  console.log(member);
  let isMember = member !== null;

  return isMember;
}

// select server owner

export async function getServerOwner(serverId: string): Promise<Member | null> {
  const member: Member | null = await prisma.member.findFirst({
    where: {
      serverId: serverId,
      isOwner: true,
    },
  });

  return member;
}
