import { ThemeProvider, Toaster } from '@repo/ui';
import { TanstackQueryProvider } from '@web/providers/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      enableSystem
      attribute="class"
      defaultTheme="system"
    >
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
      <Toaster />
    </ThemeProvider>
  );
}
