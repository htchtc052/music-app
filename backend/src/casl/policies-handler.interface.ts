import { AppAbility } from './ability.factory';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}
