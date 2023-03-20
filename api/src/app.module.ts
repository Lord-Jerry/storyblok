import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ManagementModule } from './management/management.module';
import { StoryblokModule } from './storyblok/storyblok.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ManagementModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    StoryblokModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
