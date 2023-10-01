import { PrismaClient, Track, TrackFile, User } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export const seed = async (): Promise<void> => {
  const hashedPassword = await argon2.hash('1230');

  const user1: User = await prisma.user.upsert({
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

  const user2: User = await prisma.user.upsert({
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

  const user3: User = await prisma.user.upsert({
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

  const track1: Track = await prisma.track.create({
    data: {
      title: 'Track 1',
      keywords: ['music', 'track'],
      description: 'This is track 1',
      hiddenDescription: 'This is a hidden description for track 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user1.id,
    },
  });

  const file1: TrackFile = await prisma.trackFile.create({
    data: {
      fileName: 'file1.mp3',
      filePath: 'file1.mp3',
      fileSize: 1024,
      mimetype: 'audio/mp3',
      trackId: track1.id,
    },
  });

  const track2: Track = await prisma.track.create({
    data: {
      title: 'Track private 2',
      keywords: ['track private', 'track'],
      private: true,
      description: 'This is private track 2',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user1.id,
    },
  });

  const file2: TrackFile = await prisma.trackFile.create({
    data: {
      fileName: 'file2.mp3',
      filePath: 'file2.mp3',
      fileSize: 2048,
      mimetype: 'audio/mp3',
      trackId: track2.id,
    },
  });

  console.log('Database seeded');
  process.exit(0);
};

seed();
