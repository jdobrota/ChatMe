import React from "react";
import { Poppins } from "next/font/google";
import styles from "./Wrapper.module.css";

const poppins = Poppins({ subsets: ["latin"], weight: "400", style: "italic" });

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className={poppins.className + " " + styles.main}>{children}</main>
  );
}

export default Wrapper;
