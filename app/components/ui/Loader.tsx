import React from "react";
import { View, ActivityIndicator, ViewProps } from "react-native";
import clsx from "clsx";

interface LoaderProps extends ViewProps {
  className?: string;
  fullscreen?: boolean;
  color?: string;
  size?: "small" | "large";
}

const Loader: React.FC<LoaderProps> = ({
  className = "",
  fullscreen = false,
  color = "#0070f3",
  size = "large",
  ...props
}) => {
  if (fullscreen) {
    return (
      <View
        className={clsx(
          "absolute inset-0 z-50 bg-white/70 justify-center items-center",
          className
        )}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        {...props}
      >
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
  return (
    <View className={clsx("justify-center items-center", className)} {...props}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loader;
