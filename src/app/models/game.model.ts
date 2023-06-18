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

export interface createMessage {
  title: string;
  body: string;
};

export interface Message{
    body: string;
    date: string;
    id: number;
    title: string;
    type: number;
}
