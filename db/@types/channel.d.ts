interface ChannelCreateFields {
  name: string;
  type: string;
  serverId: string;
}

interface ChannelWithMessages {
  id: string;
  name: string;
  type: string;
  messages: {
    createdAt: Date;
    author: {
      id: string;
      username: string;
      profileImage: string;
    };
    content: string;
  }[];
}
