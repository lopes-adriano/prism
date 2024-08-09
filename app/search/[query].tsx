import { View,Text,FlatList,Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import {  searchPosts } from "../../lib/appwrite";
import VideoCard from "../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {

  const {query} = useLocalSearchParams();

  const {data: posts,  refetchData} = useAppwrite(searchPosts, query);

  useEffect(() => {
    refetchData();
  }, [query]);

  return (
    <SafeAreaView className="bg-background h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View className=" justify-between items-start flex-row mb-6">
              <View>
                <Text className=" font-pmedium text-sm text-gray-100">
                  Resultados da busca
                </Text>
                <Text className=" font-psemibold text-2xl text-gray-100">
                  {query}
                </Text>
              </View>
            </View>
            <SearchBar initialQuery={query} />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Nenhum vídeo encontrado"
            subtitle="Tente buscar por outros termos"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
