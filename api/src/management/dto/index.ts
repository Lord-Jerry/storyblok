import { IsNotEmpty, IsString } from 'class-validator';

export class ReplaceStoryTextDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  replacement: string;
}
