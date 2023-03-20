import { Put, HttpCode, HttpStatus, Controller, Body, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { ReplaceStoryTextDto } from './dto';
import constants from '../common/constants';
import { StoryblokService } from '../storyblok/storyblok.service';

@Controller('content/management')
export class ManagementController {
  constructor(
    private storyblokService: StoryblokService,
    @InjectQueue(constants.replaceContentQueue.name) private replaceContentTextQueue: Queue,
  ) {}

  @Put('replace')
  @HttpCode(HttpStatus.OK)
  async replaceText(@Body() dto: ReplaceStoryTextDto) {
    const spaceId = await this.storyblokService.checkTokenValidity(dto.token);
    if (!spaceId) throw new BadRequestException('Invalid token');

    await this.replaceContentTextQueue.add(constants.replaceContentQueue.jobs.findText, {
      spaceId,
      text: dto.text,
      token: dto.token,
      replacement: dto.replacement,
    });
  }
}
