import {
  FlatList,
  Pressable,
  Image,
  ImageBackground,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "../../constants";
import { ResizeMode, Video } from "expo-av";

const zoomIn = {
  0: {
    opacity: 0.8,
    scale: 0.9,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};

const zoomOut = {
  0: {
    opacity: 1,
    scale: 1,
  },
  1: {
    opacity: 0.8,
    scale: 0.9,
  },
};

const SlideItem = ({ item, activeItem }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={300}
    >
      {play ? (
        <Video
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          source={{ uri: item.video }}
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
          className="relative items-center justify-center"
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          ></ImageBackground>

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </Pressable>
      )}
    </Animatable.View>
  );
};

const Slides = ({ content }) => {
  const [activeItem, setActiveItem] = useState(content[1]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <View className="items-center justify-center">
      <FlatList
        data={content}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <SlideItem activeItem={activeItem} item={item} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        contentOffset={{ x: 170, y: 0 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <View className="h-[1px]  w-[50px] bg-gray-300 mt-2"></View>
    </View>
  );
};

export default Slides;
