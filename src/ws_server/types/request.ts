export interface IRequest {
  type: string;
  data: IRegReq | IAddUser | IAddShips | IAttack | IRandomAttack | string;
  id: 0;
}

export interface IRegReq {
  name: string;
  password: string;
}

export interface IAddUser {
  indexRoom: number | string;
}

export interface IAddShips {
  gameId: number | string;
  ships: IShips[];
  indexPlayer: number | string;
}

export interface IShips {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface IAttack {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
}

export interface IRandomAttack {
  gameId: number | string;
  indexPlayer: number | string;
}

export interface AttackData {
  gameId: string;
  indexPlayer: string;
  x: number;
  y: number;
}

export interface RandomAttackData {
  gameId: string;
  indexPlayer: string;
}
