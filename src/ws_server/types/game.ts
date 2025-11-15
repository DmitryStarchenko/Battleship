import { IShips } from './typesReq';

export interface GameSession {
  idGame: number;
  roomId: number;
  players: GamePlayer[];
}

export interface GamePlayer {
  index: number;
  idPlayer: number;
  ships?: IShips[];
}
