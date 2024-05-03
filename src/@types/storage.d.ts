import { UserRoles } from "@/@enums/storage.enum";

// Define the structure of the JWT payload
export type JwtPayload = {
  sub: string; // User's email (subject)
  jti: string; // User's roles (as an array, to handle multiple roles)
  exp: number; // Expiration time (UNIX timestamp)
  iss: string;
  aud: string;
  [role: string]: UserRoles;
};
