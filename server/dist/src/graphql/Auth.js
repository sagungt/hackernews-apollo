"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMutation = exports.AuthPayload = void 0;
const nexus_1 = require("nexus");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const AuthPayload = (0, nexus_1.objectType)({
    name: 'AuthPayload',
    definition(t) {
        t.nonNull.string('token');
        t.nonNull.field('user', {
            type: 'User',
        });
    },
});
exports.AuthPayload = AuthPayload;
const AuthMutation = (0, nexus_1.extendType)({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('login', {
            type: 'AuthPayload',
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            async resolve(parent, args, context) {
                const user = await context.prisma.user.findUnique({
                    where: { email: args.email },
                });
                if (!user) {
                    throw new Error('No user found');
                }
                const valid = await bcrypt.compare(args.password, user.password);
                if (!valid) {
                    throw new Error('Invalid credentials');
                }
                const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
                return { token, user };
            },
        });
        t.nonNull.field('signup', {
            type: 'AuthPayload',
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            async resolve(parent, args, context) {
                const { email, name } = args;
                const password = await bcrypt.hash(args.password, 10);
                const user = await context.prisma.user.create({
                    data: {
                        name, email, password,
                    },
                });
                const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
                return { token, user };
            },
        });
    },
});
exports.AuthMutation = AuthMutation;
//# sourceMappingURL=Auth.js.map