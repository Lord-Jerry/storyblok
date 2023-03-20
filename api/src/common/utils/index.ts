import { isPlainObject } from 'lodash';

type Content = Record<string, unknown> | Record<string, unknown>[];

const AllowedToReplace = [
  'text',
  'title',
  'name',
  'label',
  'headline',
  'subheadline',
  'description',
  'content',
  'lead',
];
export const findTextAndReplace = (content: Content, text: string, replacement: string) => {
  if (Array.isArray(content)) {
    return content.map((item) => findTextAndReplace(item, text, replacement));
  }

  for (const [key, value] of Object.entries(content)) {
    if (Array.isArray(value)) {
      content[key] = findTextAndReplace(value, text, replacement);
    } else if (isPlainObject(value)) {
      content[key] = findTextAndReplace(value as Content, text, replacement);
    } else if (typeof value === 'string' && AllowedToReplace.includes(key)) {
      const regex = new RegExp(text, 'gi');
      content[key] = value.replace(regex, replacement);
    }
  }

  return content;
};
