import { View, Text } from "react-native";
import React from "react";

const InfoBox = ({
  title,
  subtitle,
  titleStyles,
  containerStyles,
}: {
  title: string;
  subtitle?: string;
  titleStyles?: string;
  containerStyles?: string;
}) => {
  return (
    <View className={`${containerStyles}`}>
      <Text className={`text-primary text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-center font-pregular text-tertiary">{subtitle}</Text>
    </View>
  );
};

export default InfoBox;
