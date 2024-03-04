import Auth from "app/components/ui/Auth/Auth";
import { getProviders } from "next-auth/react";
import React from "react";

async function SignInPage() {
  const providers = await getProviders();

  return <Auth providers={providers} />;
}

export default SignInPage;
