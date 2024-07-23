import "@/styles/globals.css"

import type {Metadata, Viewport} from "next"
import {Inter} from "next/font/google"

import {siteConfig} from "@/config/site"
import {cn} from "@/lib/utils"
import {ThemeProvider} from "@/components/theme-provider"
import ReactQueryProvider from "@/components/provider/provider";
import {Suspense} from "react";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({subsets: ["latin"]})

interface RootLayoutProps {
    children: React.ReactNode
}

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url.base),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [
        {
            name: siteConfig.author,
            url: siteConfig.url.author,
        },
    ],
    creator: siteConfig.author,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url.base,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: "@_rdev7",
    },
    icons: {
        icon: "/favicon.ico",
    },
}

export const viewport: Viewport = {
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "white"},
        {media: "(prefers-color-scheme: dark)", color: "black"},
    ],
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head/>
        <body
            className={cn(
                "min-h-screen bg-background antialiased",
                inter.className
            )}
        >

        <ReactQueryProvider>
            <Suspense>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster/>
                </ThemeProvider>
            </Suspense>
        </ReactQueryProvider>

        </body>
        </html>
    )
}
