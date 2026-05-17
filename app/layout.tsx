import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/lib/ThemeContext"

export const metadata: Metadata = {
  title:       "Monitor Climático Perú",
  description: "Dashboard de estaciones automáticas meteorológicas — OpenWeatherMap",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
