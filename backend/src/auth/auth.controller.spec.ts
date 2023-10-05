import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AppModule } from '../app.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwtAuthGuard';
import { createMockUser } from '../users/mocks/createMockUser';
import { UserEntity } from '../users/entities/user.entity';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
  };

  const mockJwtAuthGuard = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    })
      .overrideGuard(JwtAuthGuard) // Переопределяем JwtAuthGuard
      .useValue(mockJwtAuthGuard) // Используем мок-объект для JwtAuthGuard
      .compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const mockUser: UserEntity = createMockUser();
    const token = randomStringGenerator();
    const refreshToken = randomStringGenerator();

    const mockAuthResponse = {
      token,
      refreshToken,
      user: mockUser,
    };

    jest.spyOn(mockAuthService, 'register').mockResolvedValue(mockAuthResponse);
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: mockUser.email,
        username: mockUser.username,
        password: mockUser.password,
        passwordConfirm: mockUser.password,
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBe(token);
    expect(response.body.refreshToken).toBe(refreshToken);
    expect(response.body.user).toEqual(mockUser);

    /*
    const result = await controller.register({
      email: mockUser.email,
      username: mockUser.username,
      password: mockUser.password,
      passwordConfirm: mockUser.password,
    });

    expect(result).toEqual({
      token,
      refreshToken,
      user: mockUser,
    });
    */
  });
});
