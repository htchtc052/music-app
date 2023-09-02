import { IPolicyHandler } from '../../casl/policies-handler.interface';
import { Action, AppAbility } from '../../casl/ability.factory';
import { User } from '@prisma/client';
import { subject } from '@casl/ability';

export class ReadUserProfileHandler implements IPolicyHandler {
  constructor(private userProfile: User) {}

  handle(ability: AppAbility) {
    console.debug(this.userProfile);
    console.debug(ability.can(Action.Read, subject('User', this.userProfile)));
    //return ability.can(Action.Read, subject('User', this.userProfile));

    return true;
  }
}
