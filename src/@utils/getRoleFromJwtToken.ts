import _ from "lodash";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/@types/storage";
import { UserRoles } from "@/@enums/storage.enum";

// Function to decode a JWT and extract its payload
export const getRoleFromJwtToken = (token: string): UserRoles => {
  try {
    // Decode the JWT with the expected type
    const decodedJwtJson = jwtDecode<JwtPayload>(token);

    const roleKey = _.find(_.keys(decodedJwtJson), (key: string) =>
      _.includes(key, "role")
    );
    return roleKey ? decodedJwtJson[roleKey] : UserRoles.BLOGGER;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw new Error("Invalid JWT");
  }
};

export const getUserIdFromJwtToken = (
  token: string | null
): string | undefined => {
  try {
    if (!token) {
      throw new Error("Token not found");
    }
    // Decode the JWT with the expected type
    const decodedJwtJson = jwtDecode<JwtPayload>(token);

    const roleKey = _.find(_.keys(decodedJwtJson), (key: string) =>
      _.includes(key, "nameidentifier")
    );
    return roleKey ? decodedJwtJson[roleKey] : undefined;
  } catch (error) {
    console.error("Error decoding JWT:", error);
  }
};
