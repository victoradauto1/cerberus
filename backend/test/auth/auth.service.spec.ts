import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../../src/auth/auth.service";
import { jwtServiceMock } from "./jwt.service.mock";
import { JwtMock } from "./auth.service.mock";
import { UnauthorizedException } from "@nestjs/common";


describe('AuthService tests', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [AuthService, jwtServiceMock],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create Token', async () => {
    const result = await authService.createJwt(JwtMock);

    expect(result).toBeTruthy();
  });

   it('should decode Token',() => {
    const result = authService.decodeToken("123abc");
    expect(result).toBeDefined();
    expect(result.userId).toEqual(JwtMock.userId);
  });

  it('should check Token', async () => {
     const result = await authService.checkToken("123abc");
    expect(authService).toBeDefined();
  });

    it('should NOT check Token', async () => {
    await expect(authService.checkToken(null!)).rejects.toEqual(new UnauthorizedException("invalid JWT."))
  });

});
