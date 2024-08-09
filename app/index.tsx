import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "./components/CustomButton";
import 'react-native-url-polyfill/auto'
import { useGlobalContext } from "../context/GlobalProvider";
import { Wave } from "react-native-animated-spinkit";

export default function App() {

  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoading && !isLoggedIn) {
    return (
      <SafeAreaView className="bg-background h-full flex justify-center items-center">
        <Image source={images.logo} className="w-[150px] h-[90px]" resizeMode="contain" />
        <Wave size={50} color='#000' />
      </SafeAreaView>
    )
  }

  if (!isLoading && isLoggedIn ) {
     return <Redirect href="/home"/>
  }
  return (
    <SafeAreaView className="bg-background h-full flex justify-center items-center">
      <ScrollView contentContainerStyle={{ height: "100%", justifyContent: "center" }}>
        <View className="w-full flex items-center justify-content min-h-[85vh] px-4 align-middle">
          <Image source={images.logo} className="w-[150px] h-[90px]" resizeMode="contain" />
          <Image source={images.cards} className="max-w-[350px] w-full h-[300px]" resizeMode="contain" />
          <View className="relative mt-5">
            <Text className="text-gray-100 font-bold text-2xl text-center">Descubra novas possibilidades com <Text className="text-secondary">Prism</Text></Text>
            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Embarque nessa jornada de criatividade e inovação e compartilhe suas ideias com o mundo.</Text>
            
            <CustomButton title={"Continuar com Email"} containerSyles={"mt-7"} handlePress={() => router.push("/(auth)/sign-in")}/>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#FFFFFF" style="light"/>
    </SafeAreaView>
  );
}

