import { Job, Queue } from 'bull';
import { Process, InjectQueue, Processor } from '@nestjs/bull';
import { StoryblokService } from '../storyblok/storyblok.service';
import { findTextAndReplace } from '../common/utils';
import constants from '../common/constants';

import { IFindTextJob, IReplaceTextJob } from './types';

@Processor(constants.replaceContentQueue.name)
export class ManagementProcessor {
  constructor(
    private storyblokService: StoryblokService,
    @InjectQueue(constants.replaceContentQueue.name) private replaceContentTextQueue: Queue,
  ) {}

  async queueFailedFindTextJob({ page, text, token, replacement }: IFindTextJob) {
    console.log('queueing failed job');
    await this.replaceContentTextQueue.add('find-text', { text, token, replacement, page }, { delay: 5000 });
  }

  @Process(constants.replaceContentQueue.jobs.findText)
  async findContentWithText(job: Job) {
    const payload = job.data as IFindTextJob;
    const { text, token, spaceId, replacement, page: lastPage }: IFindTextJob = job.data;

    let page = lastPage || 1;
    let updateStoryJobs = [];
    try {
      let stories = await this.storyblokService.getStories({ token, searchTerm: text });
      updateStoryJobs = [...updateStoryJobs, ...stories];

      while (stories.length > 0) {
        page += 1;
        stories = await this.storyblokService.getStories({ token, searchTerm: text, page });
        updateStoryJobs = [...updateStoryJobs, ...stories];
      }
    } catch (err) {
      this.queueFailedFindTextJob({ ...payload, page });
    }

    for (const story of updateStoryJobs) {
      this.replaceContentTextQueue.add(constants.replaceContentQueue.jobs.replaceText, {
        text,
        spaceId,
        replacement,
        storyId: story.id,
        content: story.content,
      });
    }
  }

  async queueFailedReplaceTextJob({ storyId, spaceId, text, replacement, content }: IReplaceTextJob) {
    console.log('queueing failed replace job');
    await this.replaceContentTextQueue.add(
      constants.replaceContentQueue.jobs.replaceText,
      { storyId, spaceId, text, replacement, content },
      { delay: 5000 },
    );
  }

  @Process(constants.replaceContentQueue.jobs.replaceText)
  async replaceText(job: Job) {
    try {
      const { storyId, spaceId, text, replacement, content }: IReplaceTextJob = job.data;
      findTextAndReplace(content, text, replacement);
      await this.storyblokService.updateStory(storyId, spaceId, content);
      console.log(`Replaced text in story ${storyId}`);
    } catch (err) {
      this.queueFailedReplaceTextJob(job.data as IReplaceTextJob);
    }
  }
}
