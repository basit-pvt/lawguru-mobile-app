import React from "react";
import { Text as RNText, TextProps } from "react-native";
import clsx from "clsx";

interface BodyTextProps extends TextProps {
  className?: string;
  children: React.ReactNode;
}

export default function Text({
  className = "",
  children,
  ...props
}: BodyTextProps) {
  return (
    <RNText className={clsx("text-body text-color-body", className)} {...props}>
      {children}
    </RNText>
  );
}
