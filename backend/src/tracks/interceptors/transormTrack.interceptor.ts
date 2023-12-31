import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { classToPlain } from 'class-transformer';
import { Action, AppAbility } from '../../casl/ability.factory';
import { subject } from '@casl/ability';
import { RequestWithAuthUser } from '../../users/types/requestsWithUsers.type';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformTrackInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request: RequestWithAuthUser = context
      .switchToHttp()
      .getRequest<RequestWithAuthUser>();
    const ability: AppAbility = request.authUserAbility;

    return next.handle().pipe(
      map((data) => {
        //in case there is TrackEntity[]
        if (Array.isArray(data)) {
          data = data.map((track) => {
            const isOwner = ability.can(
              Action.IsOwner,
              subject('Track', track),
            );

            return classToPlain(track, { groups: [isOwner ? 'isOwner' : ''] });
          });
        } else {
          const isOwner = ability.can(Action.IsOwner, subject('Track', data));

          data = classToPlain(data, { groups: [isOwner ? 'isOwner' : ''] });
        }

        return data;
      }),
    );
  }
}
