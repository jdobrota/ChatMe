import React from "react";

function MyHead() {
  return (
    <head>
      <title>{process.env.app_name}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
    </head>
  );
}

export default MyHead;
