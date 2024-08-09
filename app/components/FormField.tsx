import { View, Text, TextInput, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";

const FormField = ({
  title = "",
  value = "",
  handleChangeText = (text) => {},
  placeholder = "",
  otherStyles = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="w-full h-12 border-2 flex-row rounded-xl border-black-200  focus:border-accent items-center px-4">
        <TextInput
          className="flex-1 text-gray-100 font-psemibold pt-1"
          cursorColor={"#7b7b8b"}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          secureTextEntry={!showPassword && title == "Senha"}
        ></TextInput>

        {title === "Senha" && (
          <Pressable
            className="absolute right-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            ></Image>
          </Pressable> 
        )}
      </View>
    </View>
  );
};

export default FormField;
