"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkMutation = exports.LinkQuery = exports.Link = exports.Feed = exports.LinkOrderByInput = exports.Sort = void 0;
const nexus_1 = require("nexus");
const Link = (0, nexus_1.objectType)({
    name: 'Link',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('description');
        t.nonNull.string('url');
        t.nonNull.dateTime('createdAt');
        t.field('postedBy', {
            type: 'User',
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
        t.nonNull.list.nonNull.field('voters', {
            type: 'User',
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .voters();
            },
        });
    },
});
exports.Link = Link;
exports.Sort = (0, nexus_1.enumType)({
    name: 'Sort',
    members: ['asc', 'desc'],
});
exports.LinkOrderByInput = (0, nexus_1.inputObjectType)({
    name: 'LinkOrderByInput',
    definition(t) {
        t.field('description', { type: exports.Sort });
        t.field('url', { type: exports.Sort });
        t.field('createdAt', { type: exports.Sort });
    },
});
const LinkQuery = (0, nexus_1.extendType)({
    type: 'Query',
    definition(t) {
        t.nonNull.field('feed', {
            type: 'Feed',
            args: {
                filter: (0, nexus_1.stringArg)(),
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.intArg)(),
                orderBy: (0, nexus_1.arg)({ type: (0, nexus_1.list)((0, nexus_1.nonNull)(exports.LinkOrderByInput)) }),
            },
            async resolve(parent, args, context) {
                const where = args.filter
                    ? {
                        OR: [
                            { description: { contains: args.filter } },
                            { url: { contains: args.filter } },
                        ],
                    }
                    : {};
                const links = await context.prisma.link.findMany({
                    where,
                    skip: (args === null || args === void 0 ? void 0 : args.skip) || undefined,
                    take: (args === null || args === void 0 ? void 0 : args.take) || undefined,
                    orderBy: args === null || args === void 0 ? void 0 : args.orderBy,
                });
                const count = await context.prisma.link.count({ where });
                const id = `main-feed:${JSON.stringify(args)}`;
                return {
                    links,
                    count,
                    id,
                };
            },
        });
        t.nullable.field('link', {
            type: 'Link',
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            // eslint-disable-next-line no-unused-vars
            resolve(parent, args, context, info) {
                const { id } = args;
                return context.prisma.link.findUnique({
                    where: {
                        id,
                    },
                });
            },
        });
    },
});
exports.LinkQuery = LinkQuery;
exports.Feed = (0, nexus_1.objectType)({
    name: 'Feed',
    definition(t) {
        t.nonNull.list.nonNull.field('links', { type: 'Link' });
        t.nonNull.int('count');
        t.id('id');
    },
});
const LinkMutation = (0, nexus_1.extendType)({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createLink', {
            type: 'Link',
            args: {
                description: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                url: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(parent, args, context) {
                const { description, url } = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error('Cannot post without logging in');
                }
                const newLink = context.prisma.link.create({
                    data: {
                        description,
                        url,
                        postedBy: { connect: { id: userId } },
                    },
                });
                return newLink;
            },
        });
        t.nonNull.field('updateLink', {
            type: 'Link',
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                url: (0, nexus_1.stringArg)(),
                description: (0, nexus_1.stringArg)(),
            },
            // eslint-disable-next-line no-unused-vars
            resolve(parent, args, context, info) {
                const { id, url, description } = args;
                const link = context.prisma.link.update({
                    where: {
                        id,
                    },
                    data: {
                        description: description || undefined,
                        url: url || undefined,
                    },
                });
                return link;
            },
        });
        t.nonNull.field('deleteLink', {
            type: 'Link',
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            // eslint-disable-next-line no-unused-vars
            resolve(parent, args, context, info) {
                const { id } = args;
                const deletedLink = context.prisma.link.delete({
                    where: {
                        id,
                    },
                });
                return deletedLink;
            },
        });
    },
});
exports.LinkMutation = LinkMutation;
//# sourceMappingURL=Link.js.map