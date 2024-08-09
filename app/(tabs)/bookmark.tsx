import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import { getBookmarkedPosts } from "../../lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import VideoCard from "../components/VideoCard";
import { Wave } from "react-native-animated-spinkit";

const Bookmark = () => {
  const { query } = useLocalSearchParams();
  const {
    data: posts,
    isLoading,
    refetchData,
  } = useAppwrite(getBookmarkedPosts, query);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRefreshing(true);
    refetchData();
    setRefreshing(false);
  }, [query]);

  const onRefresh = () => {
    setRefreshing(true);
    refetchData();
    setRefreshing(false);
  };

  if (!posts && !refreshing) return <Wave color="white" size={200} />;

  return (
    <SafeAreaView className="bg-background h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View className=" justify-between items-start flex-row">
              <View>
                <Text className="text-2xl mt-4 text-gray-100 font-psemibold">
                  Favoritos
                </Text>
                <Text className=" font-psemibold text-2xl text-gray-100"></Text>
              </View>
            </View>
            <SearchBar initialQuery={query} />
          </View>
        )}
        ListEmptyComponent={() =>
          isLoading ? (
            <View className="h-full items-center justify-center">
              <Wave size={50} color="#000" />
            </View>
          ) : (
            <EmptyState
              title="Nenhum vídeo favoritado"
              subtitle="Adicione vídeos aos favoritos e eles aparecerão aqui"
            />
          )
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
