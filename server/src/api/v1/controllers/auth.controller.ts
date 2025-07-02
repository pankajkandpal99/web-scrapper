import { compare, hash } from "bcryptjs";
import { env } from "../../../config/env.js";
import { RequestContext } from "../../../middleware/context.js";
import jwt from "jsonwebtoken";
import { User } from "../../../models/user.model.js";
import { HttpResponse } from "../../../utils/service-response.js";
import { ROLE } from "../../../config/constants.js";
import {
  AuthenticationError,
  ConflictError,
} from "../../../error-handler/index.js";

const generateToken = (userId: string, role: ROLE) =>
  jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: "7d" });

const hashPassword = (password: string) => hash(password, 12);

export const AuthController = {
  register: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { email, password, phoneNumber } = context.body;

        const existingUser = await User.findOne({ phoneNumber }).session(
          session
        );
        if (existingUser) {
          throw new ConflictError("Phone number already registered", {
            field: "phoneNumber",
            value: phoneNumber,
          });
        }

        if (email) {
          const existingEmail = await User.findOne({ email }).session(session);
          if (existingEmail) {
            throw new ConflictError("Email already registered", {
              field: "email",
              value: email,
            });
          }
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({
          phoneNumber,
          password: hashedPassword,
          role: "USER",
          ...(email && { email }),
        });

        await user.save({ session });

        return {
          id: user._id.toString(),
          phoneNumber: user.phoneNumber,
          role: user.role,
          ...(user.email && { email: user.email }),
        };
      });

      return HttpResponse.send(context.res, result, 201);
    } catch (error) {
      throw error;
    }
  },

  // login: async (context: RequestContext) => {
  //   try {
  //     const result = await context.withTransaction(async (session) => {
  //       const { email, phoneNumber, password } = context.body;

  //       if (email && phoneNumber) {
  //         throw new AuthenticationError(
  //           "Provide either email or phone number, not both"
  //         );
  //       }

  //       const user = await User.findOne({
  //         $or: [
  //           ...(email ? [{ email: email.toLowerCase() }] : []),
  //           ...(phoneNumber ? [{ phoneNumber }] : []),
  //         ],
  //       })
  //         .select("+password")
  //         .session(session);

  //       if (!user) {
  //         throw new AuthenticationError("Invalid credentials");
  //       }

  //       const isPasswordValid = await compare(password, user.password);
  //       if (!isPasswordValid) {
  //         throw new AuthenticationError("Invalid credentials");
  //       }

  //       const token = generateToken(user._id.toString(), user.role as ROLE);
  //       context.res.cookie("token", token, getAuthCookieSettings());

  //       const userObject = user.toObject();

  //       delete (userObject as { password?: string }).password;
  //       delete (userObject as { __v?: any }).__v;

  //       return {
  //         user: userObject,
  //       };
  //     });

  //     return HttpResponse.send(context.res, result, 200);
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  login: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { email, phoneNumber, password } = context.body;

        if (email && phoneNumber) {
          throw new AuthenticationError(
            "Provide either email or phone number, not both"
          );
        }

        const user = await User.findOne({
          $or: [
            ...(email ? [{ email: email.toLowerCase() }] : []),
            ...(phoneNumber ? [{ phoneNumber }] : []),
          ],
        })
          .select("+password")
          .session(session);

        if (!user) {
          throw new AuthenticationError("Invalid credentials");
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          throw new AuthenticationError("Invalid credentials");
        }

        const token = generateToken(user._id.toString(), user.role as ROLE);

        const userObject = user.toObject();
        delete (userObject as { password?: string }).password;
        delete (userObject as { __v?: any }).__v;

        return {
          user: userObject,
          token,
        };
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },
};
