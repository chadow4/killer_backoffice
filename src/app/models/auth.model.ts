export interface Register{
  username: string;
  email : string;
  password: string;

}

export interface Login{
  email : string;
  password: string;
  persistent_session : boolean
}

export interface JwtToken{
  token : string;
}

export interface RefreshToken{
  refresh_token : string;
}

export interface JwtTokenContent{
  sub: number;
  exp: number;
}
