import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthAuditService } from './auth-audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PrRefreshToken } from '../rrhh/entities/pr-refresh-token.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-token'),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: AuthAuditService,
          useValue: {
            register: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PrRefreshToken),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
