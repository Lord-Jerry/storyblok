export interface IFindTextJob {
  text: string;
  token: string;
  spaceId: number;
  replacement: string;
  page?: number;
}

type StoryContent = Record<string, unknown> | Record<string, unknown>[];

export interface IReplaceTextJob {
  text: string;
  token: string;
  spaceId: number;
  storyId: number;
  replacement: string;
  content: StoryContent;
}
