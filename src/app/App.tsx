import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AppStateProvider } from './state/AppState';

export default function App() {
  return (
    <AppStateProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AppStateProvider>
  );
}
