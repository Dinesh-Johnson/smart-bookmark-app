import './globals.css'

export const metadata = {
  title: 'Smart Bookmark App',
  description: 'A real-time bookmark manager with Google OAuth',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  )
}
