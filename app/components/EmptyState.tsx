import React from "react";
import { View, Text, Image } from "react-native";
import { images } from "../../constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

const EmptyState = ({ title = "", subtitle = "", imageSource = images.empty}) => {
  return (
    <View className="flex-1 items-center justify-center px-4">
      <Image
        source={imageSource}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className=" font-psemibold text-base text-tertiary">{title}</Text>
      <Text className=" font-pmedium text-sm text-gray-100">{subtitle}</Text>

      <CustomButton title={"Criar vídeo"} containerSyles={"w-full mt-5"} handlePress={() => {router.push("/(tabs)/create")}}/>
    </View>
  );
};

export default EmptyState;
