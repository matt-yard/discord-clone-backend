import prisma from "./index";
import { Server } from "@prisma/client";

// create server

export async function createServer(
  newServer: ServerCreateFields
): Promise<Server> {
  const createdServer = await prisma.server.create({
    data: newServer,
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
        delete: [{ userId_serverId: { userId: userId, serverId: serverId } }],
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
