import { IShips } from './typesReq';

export interface GameSession {
  idGame: number;
  roomId: number;
  players: GamePlayer[];
  currentPlayerIndex: number;
}

export interface GamePlayer {
  index: number;
  idPlayer: number;
  ships?: IShips[];
  hits?: Set<string>;
}
