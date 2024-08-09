import React from "react";
import { Tabs } from "expo-router";
import { Bookmark, CirclePlus, Home, User } from "lucide-react-native";

const tabIconColor = "#1F8EF1";
const tabIconInactiveColor = "#CDCDE0";

const TabsLayout = () => (
  <Tabs
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: tabIconColor,
      tabBarInactiveTintColor: tabIconInactiveColor,
      tabBarStyle: {
        backgroundColor: "#fff9fe",
        borderTopWidth: 1,
        height: 60,
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: "Início",
        tabBarIcon: ({ focused }) => (
          <Home color={focused ? tabIconColor : tabIconInactiveColor} />
        ),
      }}
    />
    <Tabs.Screen
      name="bookmark"
      options={{
        title: "Favoritos",
        tabBarIcon: ({ focused }) => (
          <Bookmark color={focused ? tabIconColor : tabIconInactiveColor} />
        ),
      }}
    />
    <Tabs.Screen
      name="create"
      options={{
        title: "Criar",
        tabBarIcon: ({ focused }) => (
          <CirclePlus
            color={focused ? tabIconColor : tabIconInactiveColor}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Perfil",
        tabBarIcon: ({ focused }) => (
          <User color={focused ? tabIconColor : tabIconInactiveColor} />
        ),
      }}
    />
  </Tabs>
);

export default TabsLayout;

