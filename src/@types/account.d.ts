import { ChangeEvent } from "react";

// Base identity user type
type IdentityUser = {
  id: string; // Unique identifier, typically a GUID string
  email: string;
};

// User type inheriting from IdentityUser
type User = IdentityUser & {
  firstName: string; // Required field
  emailConfirmed: boolean;
  lastName?: string; // Optional field
  avatar?: string; // Optional field, represents an image URL or similar
};

// PopularBlogger type inheriting from User
type PopularBlogger = User & {
  totalBlogs: number; // Number of blogs
  totalUpvote: number; // Total upvotes received
  totalDownvote: number; // Total downvotes received
  totalComments: number; // Number of comments
  totalPopularityScore: number; // Popularity score
};

// Structure for authentication token
type AuthToken = {
  accessToken: string;
};

// Structure for admin registration data
type AccountRegister = {
  firstName: string; // Required field
  lastName?: string; // Optional field
  email: string; // Required field
};

// Structure for user registration data
type UserRegister = AccountRegister & {
  password: string; // Required field
  confirmPassword: string; // Required field
};

// Structure for user login data
type UserLogin = {
  email: string; // Required field, should be a valid email
  password: string; // Required field
};

// Structure for changing password
type ChangePassword = {
  newPassword: string; // Required field
  confirmPassword?: string; // Should match newPassword, optional
  currentPassword: string; // Required field
};

// Structure for a model with an email address
type EmailModel = {
  email: string; // Required field, expected to be a valid email
};

// Structure for the reset password model
type ConfirmPassword = {
  password: string; // Required field, should be a valid password
  confirmPassword?: string; // Should match password, optional
  email?: string; // Optional, represents the email of the user
  token?: string; // Optional, represents the reset token
};

// Structure for user update
type UserUpdate = {
  firstName: string; // Required field
  lastName?: string; // Optional field
  image?: ChangeEvent<HTMLInputElement>["target"]["files"][0]; // Optional field
  avatar?: string; // Optional field, for avatar URL or similar representation
};

// AccountModels type containing all other types
export type AccountModels = {
  User: User;
  PopularBlogger: PopularBlogger;
  AuthToken: AuthToken;
  UserRegister: UserRegister;
  AccountRegister: AccountRegister;
  UserLogin: UserLogin;
  ChangePassword: ChangePassword;
  EmailModel: EmailModel;
  ConfirmPassword: ConfirmPassword;
  UserUpdate: UserUpdate;
};
