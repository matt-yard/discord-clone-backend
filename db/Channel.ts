import prisma from "./index";
import { Channel } from "@prisma/client";

// create channel

export async function createChannel(
  newChannel: ChannelCreateFields
): Promise<Channel> {
  const createdChannel: Channel = await prisma.channel.create({
    data: newChannel,
  });

  return createdChannel;
}

//read channel

// get serverby channel id

export async function getServerByChannelId(
  channelId: string
): Promise<string | null> {
  const channel: Channel | null = await prisma.channel.findFirst({
    where: {
      id: channelId,
    },
  });

  if (channel) {
    return channel.serverId;
  }

  return null;
}

export async function getChannelById(
  channelId: string
): Promise<ChannelWithMessages | null> {
  const selectedChannel: ChannelWithMessages | null =
    await prisma.channel.findFirst({
      where: { id: channelId },
      select: {
        id: true,
        name: true,
        type: true,
        messages: {
          select: {
            author: {
              select: {
                id: true,
                username: true,
                profileImage: true,
              },
            },
            content: true,
            createdAt: true,
            wasUpdated: true,
          },
        },
      },
    });

  return selectedChannel;
}

//update channel

export async function updateChannelName(
  newName: string,
  channelId: string
): Promise<Channel> {
  const updatedChannel: Channel | null = await prisma.channel.update({
    where: {
      id: channelId,
    },
    data: {
      name: newName,
    },
  });

  return updatedChannel;
}

//delete channel

export async function deleteChannel(channelId: string): Promise<Channel> {
  const deletedChannel: Channel = await prisma.channel.delete({
    where: { id: channelId },
  });
  return deletedChannel;
}
