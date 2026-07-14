"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border !border-border !bg-white !shadow-lg !text-ink",
          title: "!font-semibold",
          icon: "!text-success",
        },
      }}
      {...props}
    />
  );
}
