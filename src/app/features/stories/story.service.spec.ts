import { Story, validateStories } from './story.service';
function pack(): { version: number; stories: Story[] } {
  const copy = (language: string) => ({
    title: 'A little story',
    theme: 'Sharing',
    question: 'What was shared?',
    questionAudio: `/assets/audio/${language}/stories/picnic-question.m4a`,
    options: [
      { id: 'apple', text: 'Apple' },
      { id: 'hat', text: 'Hat' },
    ],
  });
  return {
    version: 1,
    stories: [
      {
        id: 'picnic',
        art: 5,
        answerId: 'apple',
        en: copy('en'),
        hi: copy('hi'),
        pages: [
          {
            art: 5,
            en: {
              text: 'An apple for a friend.',
              audio: '/assets/audio/en/stories/picnic-1.m4a',
            },
            hi: {
              text: 'दोस्त के लिए एक सेब।',
              audio: '/assets/audio/hi/stories/picnic-1.m4a',
            },
          },
        ],
      },
    ],
  };
}
describe('Bilingual story content', () => {
  it('accepts matching text and local audio in both languages', () => {
    expect(validateStories(pack()).length).toBe(1);
  });
  it('rejects missing Hindi pages and audio from the wrong language', () => {
    const missing = pack();
    missing.stories[0].pages[0].hi.text = '';
    expect(() => validateStories(missing)).toThrow();
    const wrong = pack();
    wrong.stories[0].pages[0].hi.audio =
      '/assets/audio/en/stories/picnic-1.m4a';
    expect(() => validateStories(wrong)).toThrow();
  });
  it('rejects duplicate stories and questions without their answer', () => {
    const duplicate = pack();
    duplicate.stories.push(duplicate.stories[0]);
    expect(() => validateStories(duplicate)).toThrow();
    const question = pack();
    question.stories[0].answerId = 'missing';
    expect(() => validateStories(question)).toThrow();
  });
});
