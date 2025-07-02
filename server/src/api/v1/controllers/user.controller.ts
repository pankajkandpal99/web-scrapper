import { NotFoundError } from "../../../error-handler/index.js";
import { RequestContext } from "../../../middleware/context.js";
import { User } from "../../../models/user.model.js";
import { HttpResponse } from "../../../utils/service-response.js";

export const UserController = {
  getCurrentUser: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const user = await User.findById(context.user?.id)
          .session(session)
          .select("-password -__v");

        if (!user) {
          throw new NotFoundError("User not found");
        }

        return user.toObject();
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },
};
