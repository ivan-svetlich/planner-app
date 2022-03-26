import Jwt from "./Jwt";

export default interface LoginResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  jwt: Jwt;
}
