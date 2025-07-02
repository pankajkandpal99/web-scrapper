import { Router } from "express";
import { createApiHandler } from "../../../utils/api-factory.js";
import { UserController } from "../controllers/user.controller.js";

export default (router: Router) => {
  router.get(
    "/users/me",
    createApiHandler(UserController.getCurrentUser, {
      useTransaction: true,
      requireAuth: true,
    })
  );
};
