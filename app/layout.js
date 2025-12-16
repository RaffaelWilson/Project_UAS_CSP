import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Jual Mobil Bekas Indonesia',
  description: 'Platform jual beli mobil bekas terpercaya di Indonesia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main className="container">
          {children}
        </main>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  )
}