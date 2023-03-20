import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull-shared';
import { Queue } from 'bull';
import { BullModule } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';

import constants from '../common/constants';
import { ManagementController } from './management.controller';
import { StoryblokService } from '../storyblok/storyblok.service';

describe('ManagementController', () => {
  let controller: ManagementController;
  let storyblokService: StoryblokService;
  let replaceContentTextQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagementController],
      imports: [
        BullModule.registerQueue({
          name: 'replace-content-text',
        }),
      ],
      providers: [
        {
          provide: StoryblokService,
          useValue: {
            checkTokenValidity: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ManagementController>(ManagementController);
    storyblokService = module.get<StoryblokService>(StoryblokService);
    replaceContentTextQueue = module.get<Queue>(getQueueToken(constants.replaceContentQueue.name));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const dto = {
    token: 'mytoken',
    text: 'old text',
    replacement: 'new text',
  };

  it('should replace text and return 200 status', async () => {
    jest.spyOn(storyblokService, 'checkTokenValidity').mockResolvedValueOnce(1244);
    jest.spyOn(replaceContentTextQueue, 'add').mockResolvedValueOnce(undefined);

    const result = await controller.replaceText(dto);
    expect(result).toEqual(undefined);
    expect(replaceContentTextQueue.add).toHaveBeenCalledWith(constants.replaceContentQueue.jobs.findText, {
      spaceId: 1244,
      text: dto.text,
      token: dto.token,
      replacement: dto.replacement,
    });
  });

  it('should throw BadRequestException if token is invalid', async () => {
    jest.spyOn(storyblokService, 'checkTokenValidity').mockResolvedValueOnce(false);
    jest.spyOn(replaceContentTextQueue, 'add').mockResolvedValueOnce(undefined);

    await expect(controller.replaceText(dto)).rejects.toThrow(BadRequestException);
    expect(replaceContentTextQueue.add).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if dto is invalid', async () => {
    jest.spyOn(replaceContentTextQueue, 'add').mockResolvedValueOnce(undefined);

    await expect(
      controller.replaceText({
        text: undefined,
        replacement: undefined,
        token: undefined,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(replaceContentTextQueue.add).not.toHaveBeenCalled();
  });
});
