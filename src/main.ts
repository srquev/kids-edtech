import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
bootstrapApplication(App, appConfig).catch(() => {
  // Bootstrap failures happen before the localized shell exists. Keep this fallback bilingual and text-only.
  const root = document.querySelector('app-root');
  if (!root) return;
  const message = document.createElement('p'); message.textContent = 'Let’s try that again. / चलो फिर कोशिश करें।';
  const button = document.createElement('button'); button.textContent = 'Try again / फिर कोशिश करें'; button.onclick = () => location.reload();
  root.replaceChildren(message, button);
});
