import { View, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { router, usePathname } from "expo-router";
import { Search } from "lucide-react-native";

const SearchBar = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const handleSearch = () => {
    if (query.length > 0) {
      pathname.startsWith("/home")
        ? router.push(`/search/${query}`)
        : router.setParams({ query });
    }
  };

  return (
    <View className="w-full h-12 border-2 flex-row rounded-xl border-black-200  focus:border-accent items-center px-4 space-x-4">
      <TextInput
        className="text-base pt-1  text-gray-100 font-pregular flex-1"
        cursorColor={"#15181a"}
        value={query}
        placeholder="Pesquisar"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        placeholderTextColor="#7b7b8b"
        onChangeText={(text) => setQuery(text)}
      ></TextInput>

      <Pressable onPress={handleSearch}>
        <Search size={24} color="#15181a" />
      </Pressable>
    </View>
  );
};

export default SearchBar;
