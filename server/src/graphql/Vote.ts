import { User } from '@prisma/client';
import {
  extendType, intArg, nonNull, objectType,
} from 'nexus';
import { NexusGenObjects } from '../../nexus-typegen';
import { pubsub } from '../context';

const Vote = objectType({
  name: 'Vote',
  definition(t) {
    t.id('id');
    t.nonNull.field('link', { type: 'Link' });
    t.nonNull.field('user', { type: 'User' });
  },
});

const VoteMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('vote', {
      type: 'Vote',
      args: {
        linkId: nonNull(intArg()),
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

        const vote = {
          link,
          user: user as User,
        };

        context.pubsub.publish('NEW_VOTE', {
          id: `new-vote:${linkId}:${userId}`,
          vote,
        });

        return {
          id: `vote:${linkId}:${userId}`,
          ...vote,
        };
      },
    });
  },
});

const VoteSubscriptionPayload = objectType({
  name: 'VoteSubscriptionPayload',
  definition(t) {
    t.id('id');
    t.field('vote', {
      type: 'Vote',
    });
  },
});

type Event<TID, TVote> = {
  id: TID;
  vote: TVote;
}

const VoteSubscription = extendType({
  type: 'Subscription',
  definition(t) {
    t.field('newVote', {
      type: 'VoteSubscriptionPayload',
      subscribe() {
        return pubsub.asyncIterator(['NEW_VOTE']);
      },
      resolve(payload: Event<string, NexusGenObjects['Vote']>) {
        return payload;
      },
    });
  },
});

export {
  Vote, VoteMutation, VoteSubscription, VoteSubscriptionPayload,
};
