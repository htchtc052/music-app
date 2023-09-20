import { IPolicyHandler } from '../policies-handler.interface';
import { Track } from '@prisma/client';
import { Action, AppAbility } from '../ability.factory';
import { subject } from '@casl/ability';

export class EditTrackHandler implements IPolicyHandler {
  constructor(private track: Track) {}

  handle(ability: AppAbility) {
    return ability.can(Action.Edit, subject('Track', this.track));
  }
}
