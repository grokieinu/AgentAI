export const metadata = {
  title: 'AI Trading Agent',
  description: 'AI-powered trading analysis agent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
