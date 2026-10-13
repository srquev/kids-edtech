import { BrowserSpeechAdapter } from './audio.service';

describe('Browser speech playback', () => {
  let adapter: BrowserSpeechAdapter;
  let speak: jasmine.Spy;
  let voices: jasmine.Spy;
  let utterance: SpeechSynthesisUtterance;
  beforeEach(() => {
    adapter = new BrowserSpeechAdapter();
    utterance = {} as SpeechSynthesisUtterance;
    spyOn(window, 'SpeechSynthesisUtterance').and.returnValue(utterance);
    speak = spyOn(speechSynthesis, 'speak');
    voices = spyOn(speechSynthesis, 'getVoices').and.returnValue([]);
    spyOn(speechSynthesis, 'cancel');
    spyOn(speechSynthesis, 'resume');
  });
  afterEach(() => adapter.stop());
  it('starts synchronously during a tap even when voices have not loaded', () => {
    adapter.speak('Elephant', 'en-IN', () => undefined);
    expect(speak).toHaveBeenCalledOnceWith(utterance);
    expect(utterance.lang).toBe('en-IN');
  });
  it('prefers an available local language voice over a remote exact-locale voice', () => {
    const local = {
      name: 'English',
      lang: 'en-US',
      localService: true,
    } as SpeechSynthesisVoice;
    const remote = {
      name: 'Natural English',
      lang: 'en-IN',
      localService: false,
    } as SpeechSynthesisVoice;
    voices.and.returnValue([remote, local]);
    adapter.speak('Elephant', 'en-IN', () => undefined);
    expect(utterance.voice).toBe(local);
    expect(utterance.lang).toBe('en-US');
  });
  it('reports blocked playback instead of treating it as successful', () => {
    const done = jasmine.createSpy('done');
    adapter.speak('Elephant', 'en-IN', done);
    utterance.onerror?.call(utterance, {
      error: 'not-allowed',
    } as SpeechSynthesisErrorEvent);
    expect(done).toHaveBeenCalledOnceWith('blocked');
  });
  it('ignores errors from cancelled speech', () => {
    const done = jasmine.createSpy('done');
    adapter.speak('Elephant', 'en-IN', done);
    adapter.stop();
    utterance.onerror?.call(utterance, {
      error: 'canceled',
    } as SpeechSynthesisErrorEvent);
    expect(done).not.toHaveBeenCalled();
  });
});
