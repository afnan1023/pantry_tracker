import "./globals.css";
import SessionProvider from "./SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-full">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
