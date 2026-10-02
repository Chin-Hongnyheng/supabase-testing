import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { HabitListScreen } from "./src/screens/HabitListScreen"
import { AddHabitScreen } from "./src/screens/AddHabitScreen"
import type { RootStackParamList } from "./src/screens/HabitListScreen"

import "./global.css"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="HabitList"
        screenOptions={{
          headerStyle: { backgroundColor: "#1e293b" },
          headerTintColor: "#f8fafc",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#0f172a" },
        }}
      >
        <Stack.Screen
          name="HabitList"
          component={HabitListScreen}
          options={{
            title: "My Habits",
            headerRight: () => null,
          }}
        />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ title: "New Habit" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
