import { Test, TestingModule } from '@nestjs/testing';
import { Job, Queue } from 'bull';
import { ManagementProcessor } from './management.processor';
import { StoryblokService } from '../storyblok/storyblok.service';
import { getQueueToken } from '@nestjs/bull';
import constants from '../common/constants';

describe('ManagementProcessor', () => {
  let managementProcessor: ManagementProcessor;
  let storyblokService: StoryblokService;
  let replaceContentTextQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagementProcessor,
        {
          provide: StoryblokService,
          useValue: {
            getStories: jest.fn(),
            updateStory: jest.fn(),
          },
        },
        {
          provide: getQueueToken(constants.replaceContentQueue.name),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    managementProcessor = module.get<ManagementProcessor>(ManagementProcessor);
    storyblokService = module.get<StoryblokService>(StoryblokService);
    replaceContentTextQueue = module.get<Queue>(getQueueToken(constants.replaceContentQueue.name));
  });

  it('findContentWithText should add replaceText jobs for each story', async () => {
    const jobData = {
      text: 'Example',
      token: 'test_token',
      spaceId: 1,
      replacement: 'Modified',
    };

    const jobMock = {
      data: jobData,
    };

    const stories = [
      { id: 1, name: 'test 1', content: {} },
      { id: 2, name: 'test 1', content: {} },
    ];

    jest.spyOn(storyblokService, 'getStories').mockResolvedValueOnce(stories).mockResolvedValueOnce([]);

    await managementProcessor.findContentWithText(jobMock as Job);

    expect(replaceContentTextQueue.add).toHaveBeenCalledTimes(stories.length);
  });

  it('replaceText should call updateStory with modified content', async () => {
    const jobData = {
      storyId: 1,
      spaceId: 1,
      text: 'Example',
      replacement: 'Modified',
      content: { title: 'Example Title' },
    };

    const jobMock = {
      data: jobData,
    };

    const modifiedContent = { title: 'Modified Title' };

    jest.spyOn(storyblokService, 'updateStory').mockResolvedValue(undefined);

    await managementProcessor.replaceText(jobMock as Job);

    expect(storyblokService.updateStory).toHaveBeenCalledWith(jobData.storyId, jobData.spaceId, modifiedContent);
  });
});
