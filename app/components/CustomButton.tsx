import { View, Text, Pressable } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress = () => {},
  containerSyles = {},
  textStyles = {},
  isLoading = false,
}) => {
  return (
    <Pressable
      onPress={handlePress}
      style={containerSyles}
      disabled={isLoading}
      className={`bg-primary rounded-xl min-h-[45px] items-center justify-center 
      ${containerSyles} ${isLoading ? "opacity-50" : ""}`} >
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;
