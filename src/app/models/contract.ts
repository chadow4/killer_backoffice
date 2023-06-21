export interface Contract {
  weapons: Weapon[];
}

export interface Weapon {
  id: number;
  name: string;
}

export interface FinishContract {
  player_id : number;
  weapon_id : number;
}
