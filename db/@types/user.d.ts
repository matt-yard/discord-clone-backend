interface UserUpdateFields {
  username?: string;
  email?: string;
  profileImage?: string;
}

interface UserCreateFields {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
}

interface UserEssentialInfo {
  username: string;
  id: string;
  createdAt: Date;
  profileImage: string;
}

interface UserAllInfo {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: Date;
  servers: (Member & {
    server: Server;
  })[];
}
