export interface PersonalInformation {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  games: {
    as_player: any[];
    as_staff: StaffGameSummary[];
  };
}
export interface StaffGameSummary {
  id: string;
  name: string;
  status: number;
  permission_level: number;
}
