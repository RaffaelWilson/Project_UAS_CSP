import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Used Car Sales',
  description: 'Find your perfect used car',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}