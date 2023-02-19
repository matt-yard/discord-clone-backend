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
): Promise<(Server & ServerAdditionalInfo) | null> {
  const server: (Server & ServerAdditionalInfo) | null =
    await prisma.server.findFirst({
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
    });

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

// delete server

export async function deleteServer(serverId: string): Promise<Server> {
  const deletedServer: Server = await prisma.server.delete({
    where: {
      id: serverId,
    },
  });

  return deletedServer;
}
