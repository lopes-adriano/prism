import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchBar from "../components/SearchBar";
import Slides from "../components/Slides";
import EmptyState from "../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import VideoCard from "../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Wave } from "react-native-animated-spinkit";

const Home = () => {
  const { data: posts, refetchData: refetchData } = useAppwrite(getAllPosts);
  const { data: latestPosts, isLoading, refetchData: refetchLatest } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const { user } = useGlobalContext();
  const { username } = user || {};

  const onRefresh = async () => {
    setRefreshing(true);
    refetchData();
    refetchLatest();
    setRefreshing(false);
  };



  return (
    <SafeAreaView className="bg-background h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className=" justify-between items-start flex-row mb-6">
              <View>
                <Text className=" font-pmedium text-sm text-gray-100">
                  Bem Vindo
                </Text>
                <Text className=" font-psemibold text-2xl secondary">
                  {username}
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  className="w-10 h-12"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchBar initialQuery={""} />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg mb-4  text-primary font-psemibold">
                Vídeos recentes
              </Text>
              <Slides content={latestPosts}></Slides>
            </View>
          </View>
        )}
        ListEmptyComponent={() =>
          isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Wave size={50} color="#000" />
            </View>
          ) : (
            <EmptyState
              title="Nenhum vídeo encontrado"
              subtitle="Seja o primeiro a enviar um vídeo"
            />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
