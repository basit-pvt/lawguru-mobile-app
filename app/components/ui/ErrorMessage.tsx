import React from "react";
import { View, Text, TouchableOpacity, ViewProps } from "react-native";
import clsx from "clsx";

interface ErrorMessageProps extends ViewProps {
  className?: string;
  fullscreen?: boolean;
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className = "",
  fullscreen = false,
  message = "Something went wrong. Please try again.",
  onRetry,
  ...props
}) => {
  const content = (
    <>
      <Text className="text-h3 text-red-600 text-center mb-2">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          className="mt-2 px-4 py-2 bg-primary rounded-full"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      )}
    </>
  );

  if (fullscreen) {
    return (
      <View
        className={clsx(
          "absolute inset-0 z-50 bg-white/70 justify-center items-center px-8",
          className
        )}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        {...props}
      >
        {content}
      </View>
    );
  }
  return (
    <View
      className={clsx("justify-center items-center px-8", className)}
      {...props}
    >
      {content}
    </View>
  );
};

export default ErrorMessage;
