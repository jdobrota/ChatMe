import React from "react";
import "@/styles/global.css";
import MyHead from "./components/ui/document/MyHead";
import Header from "./components/ui/Header/Header";
import Wrapper from "./components/ui/document/Wrapper";
import { getServerSession } from "next-auth";
import Providers from "./components/ui/document/Providers";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html>
      <MyHead />

      <body>
        <Wrapper>
          <Providers session={session}>
            <Header />
            {children}
          </Providers>
        </Wrapper>
      </body>
    </html>
  );
}

export default RootLayout;
