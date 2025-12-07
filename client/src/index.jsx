import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found');
} else {
  createRoot(root).render(<App />);
}