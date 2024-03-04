import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Initialize NextAuth

const google = authOptions();

function authOptions() {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID_PROD!,
        clientSecret: process.env.GOOGLE_SECRET_PROD!,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET!,
    pages: { signIn: "/auth/signin" },
  };
}

export default NextAuth(google);
