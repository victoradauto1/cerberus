import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/user.controller';
import { authServiceMock } from '../../test/auth/auth.service.mock';
import { activeUserMock, userServiceMock } from './user.service.mock';
import { UserDTO } from '../../src/user/user.dto';
import { AuthService } from '../../src/auth/auth.service';


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

   it('should get user', async () => {
    const result = await userController.getUser("authorization", activeUserMock.address);
    expect(userController).toBeDefined();
    expect(result!.address).toEqual(activeUserMock.address);
  });
   
    it('should update user', async () => {
  console.log('=== DEBUG INFO ===');
  console.log('activeUserMock.address:', activeUserMock.address);
  console.log('activeUserMock.id:', activeUserMock.id);
  
  // Testar o mock diretamente
  const mockResult = authService.decodeToken("authorization");
  console.log('authService.decodeToken result:', mockResult);
  console.log('mockResult.address:', mockResult?.address);
  
  const result = await userController.updateUser(activeUserMock.address, "authorization", {...activeUserMock} as UserDTO);
  expect(userController).toBeDefined();
  expect(result!.id).toEqual(activeUserMock.id);
});
  
  it('should pay', () => {
    expect(userController).toBeDefined();
  });
   
});
