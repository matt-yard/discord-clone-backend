interface ServerCreateFields {
  name: string;
  serverImage?: string;
  ownerId: string;
}

interface ServerAllInfo {
  channels: Channel[];
  members: Member & {
    user: {
      id: string;
      username: string;
      profileImage: string;
      createdAt: Date;
    };
  };
}

interface ServerUpdateFields {
  name?: string;
  serverImage?: string;
}
