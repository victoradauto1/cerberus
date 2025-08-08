import { Test, TestingModule } from '@nestjs/testing';
import { authServiceMock, JwtMock } from './auth.service.mock';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../src/auth/auth.controller';
import { bannedUserMock, userServiceMock } from '../../test/user/user.service.mock';
import { mailerServiceMock } from './mailer.service.mock';
import { AuthDTO } from '../../src/auth/auth.dto';
import { UserDTO } from '../../src/user/user.dto';
import { Status } from 'commons/models/status';
import { ChainId } from 'commons/models/chainId';

jest.mock("ethers", ()=>{
    return {
        ethers: {
            verifyMessage: (message: string, secret:string )=>{
                if(!message || !secret) throw new Error();
                return "0x123"
            }
        }
    }
})

describe('AuthController tests', () => {


    const authDto = {
        secret: "abc123",
        wallet: "0x123",
        timestamp: Date.now()
        
    } as AuthDTO;

    const userDto = {
      address: '0x123',
      name: 'Victor',
      id: 'abc123',
      email: 'victor@contato.com',
      status: Status.NEW,
      network: ChainId.POLYGON_MAINNET,
      planId: 'Gold',
      privateKey: 'abc123',
      activateCode: '123456',
      activateDate: new Date(),
    } as UserDTO;

  let authController: AuthController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [userServiceMock, mailerServiceMock, authServiceMock],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should sign in', async () => {
    const result = await authController.singin(authDto);
    expect(result).toEqual("abc123");
  });

   it('should NOT sign in (outdated)', async () => {
    const oldTimestampAuthDto = {
        timestamp: Date.now() -  (2 * 60 * 1000)
    } as AuthDTO;
    await expect(authController.singin(oldTimestampAuthDto)).rejects.toEqual(new BadRequestException('timestamp too old.'))
  });

  it('should NOT sign in (invalid secret)', async () => {

    await expect(authController.singin({...authDto, secret: null!})).rejects.toEqual(new BadRequestException('Invalid secret.'))
  });

  it('should NOT sign in (wrong wallet)', async () => {

    await expect(authController.singin({...authDto, wallet:"0x987"})).rejects.toEqual(new UnauthorizedException("Wallet and secret doesn't match."))
  });

  it('should NOT sign in (banned)', async () => {

    userServiceMock.useValue.getUserByWallet.mockResolvedValue(bannedUserMock)
    await expect(authController.singin({...authDto})).rejects.toEqual(new UnauthorizedException('Banned user.'))
  });


  it('should sign up', async () => {
    const result = await authController.singup(userDto);
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.NEW);
  });
  
  it('should activate', async () => {
    const result = await authController.activate(userDto.address, "123456");
    expect(result).toEqual("abc123");
  });
});
