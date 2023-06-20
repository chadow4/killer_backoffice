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

export interface GamePlayer{
  id: number;
  first_name: string;
  last_name: string;
  is_alive: boolean;
  private_key : string;
}

export interface KillAdmin{
  participant_id: number;
}

export interface KillPlayer{
  kill_key: string;
}

export interface MessageCreate {
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
