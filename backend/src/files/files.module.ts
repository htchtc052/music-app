import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req: any, file: any, cb: any) => {
          const generatedName = uuid() + extname(file.originalname);
          //console.debug(generatedName);
          cb(null, generatedName);
        },
      }),
    }),
  ],
  controllers: [],

  providers: [],
  exports: [MulterModule],
})
export class FilesModule {}
