import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ManagementController } from './management.controller';
import { ManagementProcessor } from './management.processor';

import { StoryblokModule } from '../storyblok/storyblok.module';

@Module({
  imports: [
    StoryblokModule,
    BullModule.registerQueue({
      name: 'replace-content-text',
    }),
  ],
  controllers: [ManagementController],
  providers: [ManagementProcessor],
})
export class ManagementModule {}
