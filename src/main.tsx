import './index.css'
import ReactDOM from 'react-dom/client'
import RollbarProvider from "./providers/RollbarProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from './providers/ToastProvider';
import ToastList from "./components/toast/ToastList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: true,
      retryDelay: 5000,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RollbarProvider slot={
    <QueryClientProvider client={queryClient}>
      <ToastProvider slot={
        <>
          <ToastList />
          <RouterProvider router={router} />
        </>
      } />
    </QueryClientProvider>
  } />
)
