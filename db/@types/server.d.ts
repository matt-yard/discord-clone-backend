interface ServerCreateFields {
  name: string;
  serverImage?: string;
}

interface ServerAdditionalInfo {
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
