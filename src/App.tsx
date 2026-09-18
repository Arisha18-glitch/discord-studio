import React, { useEffect } from 'react';
import { ToastProvider } from './components/shared/Toast';
import { MainLayout } from './components/layout/MainLayout';
import { useBuilderStore } from './store/useBuilderStore';
import { decodeShareUrlToState } from './utils/shareUrl';

export const App: React.FC = () => {
  const { setPayload } = useBuilderStore();

  // On initial page load: Detect and parse shareable URL payload (?data=...)
  useEffect(() => {
    const sharedData = decodeShareUrlToState();
    if (sharedData) {
      setPayload(sharedData);

      // Clean the URL search params without triggering a page reload
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [setPayload]);

  return (
    <ToastProvider>
      <MainLayout />
    </ToastProvider>
  );
};

export default App;
