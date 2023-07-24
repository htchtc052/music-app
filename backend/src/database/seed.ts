import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export const seed = async (): Promise<void> => {
  const hashedPassword = await argon2.hash('1230');

  await prisma.user.upsert({
    where: { email: 'alonecat@gmail.com' },
    update: {},
    create: {
      email: 'alonecat@gmail.com',
      username: 'Alonecat',
      slug: 'alonecat',
      firstname: 'Alex',
      lastname: 'Kotov',
      password: hashedPassword,
      //hiddenDescription: 'Alonecat hidden description',
    },
  });

  await prisma.user.upsert({
    where: { email: 'koshka@gmail.com' },
    update: {},
    create: {
      email: 'koshka@gmail.com',
      username: 'Koshka',
      slug: 'koshka',
      firstname: 'Vera',
      lastname: 'Koshkina',
      password: hashedPassword,
      //hiddenDescription: 'Koshka hidden description',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user.private@gmail.com' },
    update: {},
    create: {
      email: 'user.private@gmail.com',
      username: 'User private',
      slug: 'user_private',
      firstname: 'Ivan',
      lastname: 'Petrenko',
      password: hashedPassword,
      private: true,
    },
  });

  console.log('Database seeded');
  process.exit(0);
};
void seed();
