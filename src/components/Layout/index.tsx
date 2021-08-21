import * as React from "react";
import { Header } from "./Header";

interface Props {
  children: React.ReactNode;
}

export const Layout = (props: Props) => {
  return (
    <div>
      <Header />
      <div
        style={{
          overflowY: "scroll",
          position: "absolute",
          top: 50,
          minHeight: "calc(100vh - 50px)",
          width: "100vw",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
