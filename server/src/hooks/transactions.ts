import { RequestContext } from "../middleware/context.js";
import { ClientSession } from "mongoose";

export const TransactionHooks = {
  async startTransaction(context: RequestContext): Promise<ClientSession> {
    // If a session already exists, return it
    if (context.session) {
      return context.session;
    }

    const session = await context.db.startSession();

    await session.startTransaction();

    return session;
  },

  async commitTransaction(context: RequestContext): Promise<void> {
    if (context.session) {
      try {
        await context.session.commitTransaction();
      } finally {
        context.session.endSession(); // Always end the session
      }
    }
  },

  async rollbackTransaction(context: RequestContext): Promise<void> {
    if (context.session) {
      try {
        await context.session.abortTransaction();
      } finally {
        context.session.endSession(); // Always end the session
      }
    }
  },
};
