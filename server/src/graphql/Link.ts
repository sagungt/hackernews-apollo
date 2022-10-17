import { Prisma } from '@prisma/client';
import {
  arg,
  enumType,
  extendType, inputObjectType, intArg, list, nonNull,
  objectType, stringArg,
} from 'nexus';
import { NexusGenObjects } from '../../nexus-typegen';

const Link = objectType({
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

export const Sort = enumType({
  name: 'Sort',
  members: ['asc', 'desc'],
});

export const LinkOrderByInput = inputObjectType({
  name: 'LinkOrderByInput',
  definition(t) {
    t.field('description', { type: Sort });
    t.field('url', { type: Sort });
    t.field('createdAt', { type: Sort });
  },
});

const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('feed', {
      type: 'Feed',
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }),
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
          skip: args?.skip as number || undefined,
          take: args?.take as number || undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined,
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
        id: nonNull(intArg()),
      },
      resolve(parent, args, context) {
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

export const Feed = objectType({
  name: 'Feed',
  definition(t) {
    t.nonNull.list.nonNull.field('links', { type: 'Link' });
    t.nonNull.int('count');
    t.id('id');
  },
});

const LinkMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createLink', {
      type: 'Link',
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;
        if (!userId) {
          throw new Error('Cannot post without logging in');
        }

        const newLink = await context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } },
          },
        });
        context.pubsub.publish('NEW_LINK', {
          id: `new-link:${newLink.id}`,
          newLink,
        });
        return newLink;
      },
    });
    t.nonNull.field('updateLink', {
      type: 'Link',
      args: {
        id: nonNull(intArg()),
        url: stringArg(),
        description: stringArg(),
      },
      resolve(parent, args, context) {
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
        id: nonNull(intArg()),
      },
      resolve(parent, args, context) {
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

const LinkSubscriptionPayload = objectType({
  name: 'LinkSubscriptionPayload',
  definition(t) {
    t.id('id');
    t.field('newLink', {
      type: 'Link',
    });
  },
});

type Event<TID, TLink> = {
  id: TID;
  newLink: TLink;
}

const LinkSubscription = extendType({
  type: 'Subscription',
  definition(t) {
    t.field('newLink', {
      type: 'LinkSubscriptionPayload',
      resolve(payload: Event<string, NexusGenObjects['Link']>) {
        const { id, newLink } = payload;
        return { id, newLink };
      },
      subscribe(parent, args, context) {
        return context.pubsub.asyncIterator('NEW_LINK');
      },
    });
  },
});

export {
  Link, LinkQuery, LinkMutation, LinkSubscription, LinkSubscriptionPayload,
};
