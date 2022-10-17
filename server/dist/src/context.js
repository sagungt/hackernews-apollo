"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const auth_1 = require("./utils/auth");
exports.prisma = new client_1.PrismaClient();
const context = ({ req }) => {
    const token = req && req.headers.authorization
        ? (0, auth_1.decodeAuthHeader)(req.headers.authorization)
        : null;
    return {
        prisma: exports.prisma,
        userId: token === null || token === void 0 ? void 0 : token.userId,
    };
};
exports.context = context;
//# sourceMappingURL=context.js.map