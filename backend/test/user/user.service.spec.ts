import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { users } from 'commons/data';
import { Status } from 'commons/models/status';
import { UserDTO } from 'src/user/user.dto';
import { UserService } from '../../src/user/user.service';
import { prismaMock } from '../db.mock';
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

  it('should NOT get user by wallet', async () => {
    prismaMock.users.findFirst.mockResolvedValue(null);

    await expect(
      userService.getUserByWallet(newUserMock.address),
    ).rejects.toEqual(
      new NotFoundException(
        `User with wallet address ${newUserMock.address} not found`,
      ),
    );
  });

  it('should get user by id', async () => {
    prismaMock.users.findUnique.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.getUserById(newUserMock.id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(newUserMock.id);
  });

  it('should NOT get user by id', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(userService.getUserById(newUserMock.id)).rejects.toEqual(
      new NotFoundException(`User with id ${newUserMock.id} not found`),
    );
  });

  it('should add user', async () => {
    prismaMock.users.create.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.addUser({ ...newUserMock } as UserDTO);
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
  });

  it('should NOT add user (update instead)', async () => {
    prismaMock.users.update.mockResolvedValue({
      ...newUserMock,
      activateCode: '654321',
      activateDate: new Date(),
    } as users);
    prismaMock.users.findFirst.mockResolvedValue({ ...newUserMock } as users);

    const result = await userService.addUser({ ...newUserMock } as UserDTO);
    expect(result).toBeDefined();
    expect(result.activateCode).not.toEqual(newUserMock.activateCode);
    expect(result.activateDate.getTime()).toBeGreaterThan(
      newUserMock.activateDate.getTime(),
    );
  });

  it('should NOT add user (conflict)', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...activeUserMock,
    } as users);
    await expect(
      userService.addUser({ ...newUserMock } as UserDTO),
    ).rejects.toEqual(
      new ConflictException(
        `User already exists with the same wallet or the same emnail.`,
      ),
    );
  });

  it('should pay user', async () => {
    prismaMock.users.update.mockResolvedValue({ ...activeUserMock } as users);
    prismaMock.users.findFirst.mockResolvedValue({
      ...blockedUserMock,
    } as users);

    const result = await userService.payUSer(blockedUserMock.address);
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.ACTIVE);
  });

  it('should NOT pay user', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...activeUserMock,
    } as users);

    await expect(userService.payUSer(activeUserMock.address)).rejects.toEqual(
      new ForbiddenException(),
    );
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

    const result = await userService.activateUser(
      newUserMock.address,
      newUserMock.activateCode,
    );
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.BLOCKED);
  });

  it('should NOT activate user (expired code))', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...newUserMock,
      activateDate: new Date(Date.now() - 11 * 60 * 1000),
    } as users);

    await expect(
      userService.activateUser(newUserMock.address, newUserMock.activateCode),
    ).rejects.toEqual(new UnauthorizedException(`activate code expired.`));
  });

  it('should NOT activate user (already activate))', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...activeUserMock,
    } as users);

    const result = await userService.activateUser(
      activeUserMock.address,
      activeUserMock.activateCode,
    );
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.ACTIVE);
  });

  it('should NOT activate user (wrong code)', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...newUserMock,
      activateCode: '654321',
    } as users);

    await expect(
      userService.activateUser(newUserMock.address, newUserMock.activateCode),
    ).rejects.toEqual(new UnauthorizedException(`Wrong activate code.`));
  });
});
