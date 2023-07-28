export interface ILogin {
  username: string;
  password: string;
}

export interface IRegister {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface IUser {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface ICreateFriendRequest {
  senderId: string;
  recipientUsername: string;
}

export interface IUpdateFriendRequest {
  status: string;
}
