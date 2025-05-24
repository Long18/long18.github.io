'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultMode="system" defaultTheme="blue">
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}
