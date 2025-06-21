"use client";
import { Provider } from "jotai";
import Background from "./components/Background";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <Background />
      {children}
    </Provider>
  );
}
