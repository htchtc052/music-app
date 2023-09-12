import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export const seed = async (): Promise<void> => {
  const hashedPassword = await argon2.hash('1230');

  const user1 = await prisma.user.upsert({
    where: { email: 'alonecat@gmail.com' },
    update: {},
    create: {
      email: 'alonecat@gmail.com',
      username: 'Alonecat',
      firstname: 'Alex',
      lastname: 'Kotov',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'koshka@gmail.com' },
    update: {},
    create: {
      email: 'koshka@gmail.com',
      username: 'Koshka',
      firstname: 'Vera',
      lastname: 'Koshkina',
      password: hashedPassword,
      birthday: new Date(),
      hiddenDescription: 'Koshka hidden description',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'ruslanka@gmail.com' },
    update: {},
    create: {
      email: 'ruslanka@gmail.com',
      username: 'Ruslanka (hidden)',
      firstname: 'Ruslanka',
      lastname: 'Lebedeva',
      password: hashedPassword,
      private: true,
      birthday: new Date(),
    },
  });

  const track1 = await prisma.track.create({
    data: {
      title: 'Track 1',
      isAdult: false,
      keywords: ['music', 'track'],
      description: 'This is track 1',
      hiddenDescription: 'This is a hidden description for track 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user1.id,
    },
  });

  const file1 = await prisma.trackFile.create({
    data: {
      fileName: 'file1.mp3',
      bitrate: 320,
      fileSize: 1024,
      duration: 240,
      mime: 'audio/mp3',
      md5: 'abc123',
      trackId: track1.id,
      isActive: true,
    },
  });

  const fileInactive = await prisma.trackFile.create({
    data: {
      fileName: 'fileInactive.mp3',
      bitrate: 320,
      fileSize: 1024,
      duration: 240,
      mime: 'audio/mp3',
      md5: 'abc234',
      trackId: track1.id,
      isActive: false,
    },
  });

  const track2 = await prisma.track.create({
    data: {
      title: 'Track 2',
      isAdult: false,
      keywords: ['music', 'track'],
      description: 'This is track 2',
      private: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
    },
  });

  const file2 = await prisma.trackFile.create({
    data: {
      fileName: 'file2.mp3',
      bitrate: 320,
      fileSize: 1024,
      duration: 180,
      mime: 'audio/mp3',
      md5: 'def456',
      trackId: track2.id,
      isActive: true,
    },
  });

  console.log('Database seeded');
  process.exit(0);
};

seed();
