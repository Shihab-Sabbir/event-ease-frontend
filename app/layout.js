
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/UserContext";

export const metadata = {
  title: "EventEase",
  description: "Simplified event management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Toaster richColors
            duration={3000}
            position="top-right"
            expand={false}
            reverseOrder={false}
          />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
