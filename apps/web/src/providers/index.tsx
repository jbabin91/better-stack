import { ThemeProvider, Toaster } from '@repo/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      enableSystem
      attribute="class"
      defaultTheme="system"
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
