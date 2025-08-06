import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/use.controller';
import { userServiceMock } from './user.service.mock';
import { authServiceMock } from '../../test/auth/auth.service.mock';

describe('UserController tests', () => {
  let userController: UserController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock, authServiceMock],
    }).compile();

    userController = moduleFixture.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
