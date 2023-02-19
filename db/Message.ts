import prisma from "./index";
import { Message } from "@prisma/client";

// create message (send)
export async function sendMessage(
  message: MessageCreateFields
): Promise<Message> {
  const newMessage: Message = await prisma.message.create({
    data: message,
  });

  return newMessage;
}

//read message (get Message by ID)

export async function getMsssageById(
  messageId: string
): Promise<Message | null> {
  const message: Message | null = await prisma.message.findFirst({
    where: {
      id: messageId,
    },
  });

  return message;
}

//edit message

export async function editMessageContent(
  messageId: string,
  newContent: string
): Promise<Message> {
  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      content: newContent,
      wasUpdated: true,
    },
  });

  return updatedMessage;
}

// delete message

export async function deleteMessage(messageId: string): Promise<Message> {
  const deletedMessage: Message = await prisma.message.delete({
    where: {
      id: messageId,
    },
  });

  return deletedMessage;
}
