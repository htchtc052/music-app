import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GetTrackMiddleware } from './middlewares/getTrack.middleware';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [TracksController],

  providers: [TracksService],
})
export class TracksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetTrackMiddleware)
      .forRoutes(
        { path: 'tracks/:id', method: RequestMethod.GET },
        { path: 'tracks/:id', method: RequestMethod.PUT },
      );
  }
}
