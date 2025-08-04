import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { newUserMock } from './user.service.mock';

describe('UserService tests', () => {
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should get user by wallet', async () => {
    const result = await userService.getUserByWallet(newUserMock.address);
  });

  it('should get user by id', () => {});

  it('should add user', () => {});

  it('should pay user', () => {});

  it('should update user', () => {});

  it('should activate user', () => {});
});
