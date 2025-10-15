import { Toaster } from 'sonner'
import { CartProvider } from '@/app/context/CartContext';
import Script from 'next/script';
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster 
          position="top-center"
          richColors
          closeButton
        />
      </body>
    </html>
  )
}
