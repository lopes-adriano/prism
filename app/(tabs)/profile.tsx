import { View, FlatList, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import { searchPostsByUser, signOut } from "../../lib/appwrite";
import VideoCard from "../components/VideoCard";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../components/InfoBox";
import { LogOut } from "lucide-react-native";
import { Wave } from "react-native-animated-spinkit";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, isLoading } = useAppwrite(searchPostsByUser, user?.$id);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("(auth)/sign-in");
    } catch (error) {
      throw error;
    }
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full items-center justify-center mt-4 mb-12 px-4">
            <View className="w-full items-end mb-10 ">
              <Pressable 
                className="w-10 h-10 rounded-full bg-secondary-100 items-center justify-center"
                onPress={logout}
                android_ripple={{ color: "#15181a", radius: 100 }}
              >
                <LogOut className="w-6 h-6 color-accent" />
              </Pressable>
            </View>

            <View className="w-16 h-16 rounded-full border border-secondary-100">
              <Image
                source={{ uri: user?.avatar }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 w-full flex-row justify-around">
              <InfoBox
                title={posts.length.toString() || "0"}
                subtitle={posts.length === 1 ? "Vídeo" : "Vídeos"}
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.6k"
                subtitle="Seguidores"
                titleStyles="text-xl"
              />
            </View>
            <View className="h-[1px] w-[200] bg-gray-200 mt-4"></View>
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
              subtitle="Tente buscar por outros termos"
            />
          )
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
