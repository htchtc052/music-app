import { IPolicyHandler } from '../../casl/policies-handler.interface';
import { Action, AppAbility } from '../../casl/ability.factory';
import { subject } from '@casl/ability';
import { Track } from '@prisma/client';

export class ReadTrackHandler implements IPolicyHandler {
  constructor(private track: Track) {}

  handle(ability: AppAbility) {
    return ability.can(Action.Read, subject('Track', this.track));
  }
}
