import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/600-italic.css';
import '@fontsource/nunito-sans/400.css';
import '@fontsource/nunito-sans/600.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'dayjs/locale/pt-br';
import './index.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
