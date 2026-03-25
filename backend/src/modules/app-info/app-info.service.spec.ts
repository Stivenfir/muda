import { Test, TestingModule } from '@nestjs/testing';
import { AppInfoController } from './app-info.controller';
import { AppInfoService } from './app-info.service';

describe('AppInfoController', () => {
  let controller: AppInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppInfoController],
      providers: [AppInfoService], 
    }).compile();

    controller = module.get<AppInfoController>(AppInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});