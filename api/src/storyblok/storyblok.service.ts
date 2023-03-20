import axios from 'axios';
import { Injectable } from '@nestjs/common';

import { StoryContent, IGetStoryPayload, IGetStoriesResponse } from './types';

const BASE_URL = 'https://api.storyblok.com';
@Injectable()
export class StoryblokService {
  private httpclient = axios.create({
    baseURL: `${BASE_URL}/v2/cdn`,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  async checkTokenValidity(token: string) {
    try {
      const response = await this.httpclient.get<{
        space: {
          id: number;
        };
      }>('/spaces/me/', {
        params: {
          token,
        },
      });
      return response.data.space.id;
    } catch (e) {
      return false;
    }
  }

  async getStories({ token, searchTerm, page, perPage = 25 }: IGetStoryPayload) {
    const response = await this.httpclient.get<IGetStoriesResponse>('/stories', {
      params: {
        page,
        token,
        search_term: searchTerm,
        per_page: perPage,
      },
    });
    return response.data.stories;
  }

  async updateStory(storyId: number, spaceId: number, content: StoryContent) {
    const response = await axios.put(
      `${BASE_URL}/v1/spaces/${spaceId}/stories/${storyId}`,
      {
        story: {
          content,
          publish: 1,
        },
      },
      {
        headers: {
          Authorization: process.env.STORYBLOK_TOKEN,
        },
      },
    );
    return response.data;
  }
}
