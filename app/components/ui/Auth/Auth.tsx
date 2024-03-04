import { getProviders } from "next-auth/react";
import ProviderButton from "./ProviderButton";
import styles from "./Auth.module.css";

function Auth({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) {
  return (
    <div className={styles.authContent}>
      <h3>Please login to participate!</h3>
      {Object.values(providers!).map((provider) => (
        <ProviderButton
          key={provider.id}
          name={provider.name}
          id={provider.id}
        />
      ))}
    </div>
  );
}

export default Auth;
