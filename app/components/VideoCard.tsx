import { View, Text, Image, Pressable,  } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import { ResizeMode, Video } from "expo-av";
import { Bookmark } from "lucide-react-native";
import { addBookmark, removeBookmark } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

interface VideoCardProps {
  video: {
    $id: string;
    title: string;
    thumbnail: string;
    video: string;
    prompt: string;
    saved_by: string[];
    creator: {
      username: string;
      avatar: string;
    };
  };
}

const VideoCard = ({ video }: VideoCardProps) => {


  const { user } = useGlobalContext();
  
  const [play, setPlay] = useState(false);
  const [saved, setSaved] = useState(video?.saved_by.includes(user?.$id) || false); 

  const handleBookmark = () => {
    if (saved) {
      removeBookmark(video.$id);
     
  }

    if (!saved) {
      addBookmark(video.$id);
      
  }

    setSaved(!saved);
  };



  return (
    <View className="flex-col items-center px-4 mb-2">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center flex-center flex-row flex-1">
          <View className="w-[40px] h-[40px] rounded-full  overflow-hidden">
            <Image
              source={{ uri: video.creator.avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 self-start gap-y-1 ml-3">
            <Text className="text-gray-100 font-psemibold text-sm">{video.title}</Text>
            <Text className="text-gray-100 text-xs font-pregular">
              {video.creator.username}
            </Text>
          </View>
        </View>
        <View className="pt-2 justify-end">
        <Pressable onPress={handleBookmark}>
        <Bookmark color={saved ? "#1F8EF1" : '#7b7b8b'} fill= {saved ? "#1F8EF1" : 'transparent'} />
        </Pressable>
        </View>
        
      </View>

      {play ? (
        <Video
        className="w-full h-[220px] rounded-[35px] mt-3 bg-white/10"
        source={{ uri: video.video }}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onPlaybackStatusUpdate={(playbackStatus) => {
          if (playbackStatus.isLoaded && playbackStatus.didJustFinish)
            setPlay(false);
        }}
      />
      ) : (
        <Pressable
          className="w-full h-[220px] rounded-xl mt-3 relative items-center justify-center"
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-[220px] rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </Pressable>
      )}
      <View className=" w-full mt-4 items-start justify-start">
        <Text className="text-gray-100 font-plight text-xs" >
          <Text className="text-primary font-psemibold">prompt: </Text>
          {video.prompt}
        </Text>
      </View>
      <View className="h-[1px] w-[100%] bg-gray-300 mt-2"></View>
    </View>
  );
};

export default VideoCard;
