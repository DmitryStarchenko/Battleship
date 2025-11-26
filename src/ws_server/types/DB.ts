export interface DBOnlineUsers {
  name: string;
  password: string;
  index: number;
}

export type DBRegUsers = DBOnlineUsers;

export interface DBRooms {
  roomId: number;
  roomUsers: RoomUsers[];
}

interface RoomUsers {
  name: string;
  index: number;
}

export interface DBWinner {
  name: string;
  wins: number;
}
