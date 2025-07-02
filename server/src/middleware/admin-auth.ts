import { NextFunction, Request, Response } from "express";
import { ApiResponseService } from "../services/response.service.js";

export const requireAdmin = (
  req: Request & { context: { user: any } },
  res: Response,
  next: NextFunction
) => {
  if (!req.context?.user) {
    return ApiResponseService.error(res, "Authentication required", 401);
  }

  // console.log("User role:", req.context.user);

  if (req.context.user.role !== "ADMIN") {
    // console.log("User is not an admin");
    return ApiResponseService.error(res, "Admin access required", 403);
  }

  // console.log("Admin access granted");

  next();
};
