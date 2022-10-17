import { objectType } from 'nexus';

// eslint-disable-next-line import/prefer-default-export
export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.nonNull.list.nonNull.field('links', {
      type: 'Link',
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .links();
      },
    });
    t.nonNull.list.nonNull.field('votes', {
      type: 'Link',
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
  },
});
