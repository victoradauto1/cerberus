import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/user.controller';
import { authServiceMock } from '../../test/auth/auth.service.mock';
import { activeUserMock, userServiceMock } from './user.service.mock';
import { UserDTO } from '../../src/user/user.dto';
import { AuthService } from '../../src/auth/auth.service';
import { Status } from 'commons/models/status';
import { ForbiddenException } from '@nestjs/common';

describe('UserController tests', () => {
  let userController: UserController;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock, authServiceMock],
    }).compile();

    userController = moduleFixture.get<UserController>(UserController);
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should get user (by wallet)', async () => {
    const result = await userController.getUser(
      'authorization',
      activeUserMock.address,
    );
    expect(userController).toBeDefined();
    expect(result!.address).toEqual(activeUserMock.address);
  });

  it('should get user (by id)', async () => {
    const result = await userController.getUser(
      'authorization',
      activeUserMock.id,
    );
    expect(userController).toBeDefined();
    expect(result!.id).toEqual(activeUserMock.id);
  });

  it('should NOT get user (by wallet))', async () => {

    await expect (userController.getUser(
      'authorization',
      '0x987',
    )).rejects.toEqual(new ForbiddenException())
    
  });

  it('should NOT get user (by id))', async () => {

    await expect (userController.getUser(
      'authorization',
      activeUserMock.name,
    )).rejects.toEqual(new ForbiddenException())
    
  });

  it('should update user', async () => {
    const result = await userController.updateUser(
      'authorization',
      activeUserMock.address,
      { ...activeUserMock } as UserDTO,
    );
    expect(userController).toBeDefined();
    expect(result!.id).toEqual(activeUserMock.id);
  });

  it('should NOT update user', async () => {
    await expect(userController.updateUser(
      'authorization',
      activeUserMock.name,
      { ...activeUserMock } as UserDTO,
    )).rejects.toEqual(new ForbiddenException());
  });

  it('should pay', async () => {
    const result = await userController.pay(
      'authorization'
    );
    expect(userController).toBeDefined();
    expect(result!.status).toEqual(Status.ACTIVE);
  });
});
