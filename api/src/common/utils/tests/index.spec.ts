import { findTextAndReplace } from '../';

describe('findTextAndReplace', () => {
  test('Replaces text in nested content objects and arrays', () => {
    const content = {
      title: 'Welcome to My Example Site',
      description: 'This is a example site.',
      sections: [
        {
          headline: 'Example Section 1',
          content: 'This is example content for section 1.',
          image: {
            url: 'https://example.com/image.jpg',
          },
          items: [
            {
              name: 'Item 1',
              label: 'Example Item 1',
            },
            {
              name: 'Item 2',
              label: 'Example Item 2',
            },
          ],
        },
        {
          headline: 'Example Section 2',
          content: 'This is example content for section 2.',
          image: {
            url: 'https://example.com/image.jpg',
          },
          items: [
            {
              name: 'Item 3',
              label: 'Example Item 3',
            },
          ],
        },
      ],
    };

    const expectedResult = {
      title: 'Welcome to My Modified Site',
      description: 'This is a Modified site.',
      sections: [
        {
          headline: 'Modified Section 1',
          content: 'This is Modified content for section 1.',
          image: {
            url: 'https://example.com/image.jpg',
          },
          items: [
            {
              name: 'Item 1',
              label: 'Modified Item 1',
            },
            {
              name: 'Item 2',
              label: 'Modified Item 2',
            },
          ],
        },
        {
          headline: 'Modified Section 2',
          content: 'This is Modified content for section 2.',
          image: {
            url: 'https://example.com/image.jpg',
          },
          items: [
            {
              name: 'Item 3',
              label: 'Modified Item 3',
            },
          ],
        },
      ],
    };

    const result = findTextAndReplace(content, 'Example', 'Modified');
    expect(result).toEqual(expectedResult);
  });
});
