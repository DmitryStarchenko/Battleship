export interface IResponse {
  type: string;
  data:
    | IRegRes
    | IUpdateWin[]
    | ICreateGame
    | IUpdateRoom[]
    | IStartGame
    | IAttackRes
    | ITurn
    | IFinish
    | string;
  id: 0;
}

export interface IRegRes {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

export interface IUpdateWin {
  name: string;
  wins: number;
}

export interface ICreateGame {
  idGame: number | string;
  idPlayer: number | string;
}

export interface IUpdateRoom {
  roomId: number | string;
  roomUsers: RoomUsers[];
}

interface RoomUsers {
  name: string;
  index: number | string;
}

export interface IStartGame {
  ships: Ships[];
  currentPlayerIndex: number | string;
}

interface Ships {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface IAttackRes {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number | string;
  status: 'miss' | 'killed' | 'shot';
}

export interface ITurn {
  currentPlayer: number | string;
}

export interface IFinish {
  winPlayer: number | string;
}
