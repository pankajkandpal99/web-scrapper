// import { RequestContext } from "../middleware/context";

// export const AuditHooks = {
//   async logOperation(context: RequestContext) {
//     if (context.user) {
//       await context.prisma.auditLog.create({
//         data: {
//           userId: context.user.id,
//           action: context.req.method,
//           endpoint: context.req.originalUrl,
//           status: context.res.statusCode,
//           params: JSON.stringify(context.params),
//           body: JSON.stringify(context.body),
//         },
//       });
//     }
//   },

//   async logError(context: RequestContext, error: Error) {
//     if (context.user) {
//       await context.prisma.auditLog.create({
//         data: {
//           userId: context.user.id,
//           action: context.req.method,
//           endpoint: context.req.originalUrl,
//           status: context.res.statusCode || 500,
//           params: JSON.stringify(context.params),
//           body: JSON.stringify(context.body),
//           error: JSON.stringify({
//             message: error.message,
//             stack: error.stack,
//             name: error.name,
//           }),
//         },
//       });
//     }
//   },
// };
