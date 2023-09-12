import { Track, User } from '@prisma/client';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  IsOwner = 'is-owner',
  Edit = 'update',
}

type AppSubjects = { User: User; Track: Track };

export type AppAbility = PureAbility<
  [Action, Subjects<AppSubjects>],
  PrismaQuery
>;

export class AbilityFactory {
  createForUser(user: User | null) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user?.isAdmin) {
      builder.can(Action.Manage, 'User');
      builder.can(Action.Manage, 'Track');
    } else {
      builder.can(Action.Read, 'Track', { private: false });

      if (user) {
        builder.can(Action.Read, 'Track', {
          private: true,
          userId: user.id,
        });

        builder.can(Action.IsOwner, 'User', { id: user.id });
        builder.can(Action.IsOwner, 'Track', {
          userId: user.id,
        });

        builder.can(Action.Edit, 'Track', { userId: user.id });
      }
    }

    return builder.build();
  }
}
