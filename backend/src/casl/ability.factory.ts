import { User } from '@prisma/client';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  ReadPrivateFields = 'read-private-fields',
  Edit = 'update',
}

type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
    }>;

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

export class AbilityFactory {
  createForUser(user: User | null) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user?.isAdmin) {
      builder.can(Action.Manage, 'all');
    } else {
      builder.can(Action.Read, 'User', { private: false });

      if (user) {
        builder.can(Action.Read, 'User', {
          private: true,
          id: user.id,
        });

        builder.can(Action.ReadPrivateFields, 'User', {
          id: user.id,
        });

        builder.can(Action.Edit, 'User', { id: user.id });
      }
    }

    return builder.build();
  }
}
