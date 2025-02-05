import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ['latin'] });

const appearance = {
  layout: {
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton",
    termsPageUrl: "https://your-terms-page",
    privacyPageUrl: "https://your-privacy-page",
  },
  variables: {
    colorPrimary: "#000000",
    colorText: "#000000",
    colorTextSecondary: "#666666",
    colorBackground: "#ffffff",
    colorInputBackground: "#f3f4f6",
    colorInputText: "#000000",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
  },
  elements: {
    formButtonPrimary: 
      "bg-black hover:bg-gray-800 text-white text-sm normal-case py-2.5 px-4",
    card: "bg-white shadow-none",
    headerTitle: "text-2xl font-semibold",
    headerSubtitle: "text-gray-600",
    socialButtons: "gap-y-4",
    socialButtonsBlockButton: 
      "border border-gray-300 hover:bg-gray-50 text-gray-600 justify-center",
    dividerLine: "bg-gray-200",
    dividerText: "text-gray-400 text-sm",
    formFieldLabel: "text-gray-700 font-medium",
    formFieldInput: 
      "rounded-lg border-gray-300 bg-gray-50 focus:ring-black focus:border-black",
    footerActionLink: "text-black hover:text-gray-600",
    identityPreviewText: "text-gray-600",
    identityPreviewEditButton: 
      "text-black hover:text-gray-600 hover:bg-transparent",
  },
};

export const metadata: Metadata = {
  title: 'FinanceValley',
  description: 'The connected workspace where better, faster work happens.',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={appearance}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ConvexClientProvider>
            <EdgeStoreProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="financehub-theme"
              >
                <Toaster />
                <ModalProvider />
                {children}
              </ThemeProvider>
            </EdgeStoreProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
