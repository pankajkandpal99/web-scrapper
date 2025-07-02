import { StatusCodes } from "../config/constants.js";
import { AppError } from "./app-error.js";

export class ValidationError extends AppError {
  constructor(message: string = "Validation Error", details?: any) {
    super(message, StatusCodes.BAD_REQUEST, "ValidationError", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication Failed", details?: any) {
    super(message, StatusCodes.UNAUTHORIZED, "AuthenticationError", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource Not Found", details?: any) {
    super(message, StatusCodes.NOT_FOUND, "NotFoundError", details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource Already Exists", details?: any) {
    super(message, StatusCodes.CONFLICT, "ConflictError", details);
  }
}
