import { View, Text, ScrollView, Pressable, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { ImageUp, Upload } from "lucide-react-native";

const Create = () => {
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);

  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      } else {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setUploading(true);
    try {
      await createVideo({ ...form, userId: user.$id });
      Alert.alert("Sucesso", "Vídeo adicionado com sucesso");
      router.push("/home");
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setForm({ ...form, title: "", video: null, thumbnail: null, prompt: "" });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-background">
      <ScrollView className="px-4">
        <Text className="text-2xl mt-4 text-gray-100 font-psemibold">
          Adicionar Vídeo
        </Text>

        <FormField
          title="Nome do Vídeo"
          placeholder="Dê um nome para o seu vídeo"
          handleChangeText={(text) => setForm({ ...form, title: text })}
          value={form.title}
          otherStyles="mt-7"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Escolha o Vídeo
          </Text>

          <Pressable onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                className="w-full h-64 rounded-2xl "
                source={{ uri: form.video.uri }}
                resizeMode={ResizeMode.CONTAIN}
              ></Video>
            ) : (
              <View className="w-full h-40 px-4  rounded-2xl justify-center items-center border-2 border-black-200">
                <View className="w-14 h-14 border-2 border-dashed  border-accent justify-center items-center">
                  <Upload className="w-6 h-6 text-accent" />
                </View>
                <Text className="text-gray-100 mt-2 font-pmedium text-sm">
                  Selecionar vídeo
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Imagem de Thumbnail
          </Text>

          <Pressable onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-20 px-4 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <ImageUp className="w-6 h-6 text-accent" />
                <Text className="text-gray-100 font-pmedium text-sm">
                  Selecionar imagem
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <FormField
          title="Prompt"
          placeholder="O prompt usado para criar o vídeo"
          handleChangeText={(text) => setForm({ ...form, prompt: text })}
          value={form.prompt}
          otherStyles="mt-10"
        />

        <CustomButton
          title="Enviar"
          handlePress={submit}
          containerSyles="mt-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
