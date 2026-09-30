'use client';

import React from 'react';
import { ChatProvider } from '../context/ChatContext';
import { AppLayout } from '../components/layout/AppLayout';

export default function Home() {
  return (
    <ChatProvider>
      <AppLayout />
    </ChatProvider>
  );
}
