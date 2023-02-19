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
