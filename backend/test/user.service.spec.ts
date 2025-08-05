import { Test, TestingModule } from '@nestjs/testing';
import { users } from 'commons/data';
import { Status } from 'commons/models/status';
import { UserDTO } from 'src/user/user.dto';
import { UserService } from '../src/user/user.service';
import { prismaMock } from './db.mock';
import {
  activeUserMock,
  blockedUserMock,
  newUserMock,
} from './user.service.mock';

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
    prismaMock.users.findFirst.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.getUserByWallet(newUserMock.address);
    expect(result).toBeDefined();
    expect(result.address).toEqual(newUserMock.address);
  });

  it('should get user by id', async () => {
    prismaMock.users.findUnique.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.getUserById(newUserMock.id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(newUserMock.id);
  });

  it('should add user', async () => {
    prismaMock.users.create.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.addUser({ ...newUserMock } as UserDTO);
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
  });

  it('should pay user', async () => {
    prismaMock.users.update.mockResolvedValue({ ...activeUserMock } as users);
    prismaMock.users.findFirst.mockResolvedValue({
      ...blockedUserMock
    } as users);

    const result = await userService.payUSer(blockedUserMock.address);
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.ACTIVE);
  });

  it('should update user', async () => {
    prismaMock.users.update.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.updateUser(newUserMock.id, {
      ...newUserMock,
    } as UserDTO);
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.NEW);
  });

  it('should activate user', async () => {
   prismaMock.users.update.mockResolvedValue({ ...blockedUserMock } as users);
   prismaMock.users.findFirst.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.activateUser(newUserMock.address, newUserMock.activateCode);
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.BLOCKED);
  });

});
