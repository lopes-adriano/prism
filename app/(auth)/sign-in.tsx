import { View, Text, ScrollView, Image, Alert } from "react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const {setUser, setIsLoggedIn} = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);

      const result = await getCurrentUser();
      setUser(result);
      
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <ScrollView
        contentContainerStyle={{ height: "100%", justifyContent: "center" }}
      >
        <View className="w-full justify-center  px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />

          <Text className="text-xl text-tertiary font-psemibold mt-10">
            Acesse sua conta
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Digite seu email"
          />

          <FormField
            title="Senha"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            otherStyles="mt-7"
            secureTextEntry
            placeholder="Digite sua senha"
          />

          <CustomButton
            title="Entrar"
            isLoading={isSubmitting}
            handlePress={submit}
            containerSyles="mt-7"
          />

          <View className="flex-row items-center justify-center pt-5 gap-2">
            <Text className="text-gray-100 font-pmedium">
              Não possui uma conta?
            </Text>
            <Link
              href="/(auth)/sign-up"
              className="text-accent font-psemibold"
            >
              Cadastre-se
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
