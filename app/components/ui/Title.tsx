import React from "react";
import { Text, TextProps } from "react-native";
import clsx from "clsx";

interface TitleProps extends TextProps {
  className?: string;
  children: React.ReactNode;
}

export default function Title({
  className = "",
  children,
  ...props
}: TitleProps) {
  return (
    <Text
      className={clsx("text-h2 text-color-heading font-bold", className)}
      {...props}
    >
      {children}
    </Text>
  );
}
