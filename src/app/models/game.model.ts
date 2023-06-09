export interface GameCreate {
  name: string;
}

export interface GameDetailed {
  id: string;
  name: string;
  status: number;
  players: {
    alive: number;
    total: number;
  };
}
