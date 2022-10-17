"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteMutation = exports.Vote = void 0;
const nexus_1 = require("nexus");
const Vote = (0, nexus_1.objectType)({
    name: 'Vote',
    definition(t) {
        t.nonNull.field('link', { type: 'Link' });
        t.nonNull.field('user', { type: 'User' });
    },
});
exports.Vote = Vote;
const VoteMutation = (0, nexus_1.extendType)({
    type: 'Mutation',
    definition(t) {
        t.field('vote', {
            type: 'Vote',
            args: {
                linkId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            async resolve(parent, args, context) {
                const { userId } = context;
                const { linkId } = args;
                if (!userId) {
                    throw new Error('Cannot vote without logging in');
                }
                const link = await context.prisma.link.update({
                    where: {
                        id: linkId,
                    },
                    data: {
                        voters: {
                            connect: {
                                id: userId,
                            },
                        },
                    },
                });
                const user = await context.prisma.user.findUnique({ where: { id: userId } });
                return {
                    link,
                    user: user,
                };
            },
        });
    },
});
exports.VoteMutation = VoteMutation;
//# sourceMappingURL=Vote.js.map