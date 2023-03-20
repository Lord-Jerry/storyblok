export type StoryContent = Record<string, unknown> | Record<string, unknown>[];

export interface IStories {
  name: string;
  id: number;
  content: StoryContent;
}

export interface IGetStoriesResponse {
  stories: IStories[];
}

export interface IGetStoryPayload {
  page?: number;
  token: string;
  perPage?: number;
  searchTerm: string;
}
