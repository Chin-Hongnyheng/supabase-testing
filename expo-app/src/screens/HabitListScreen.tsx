import React, { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ListRenderItem,
} from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { supabase } from "../lib/supabase"
import { shareHabits } from "../lib/share"
import type { Habit } from "../types/habits"

export type RootStackParamList = {
  HabitList: undefined
  AddHabit: undefined
}

type Props = NativeStackScreenProps<RootStackParamList, "HabitList">

export function HabitListScreen({ navigation }: Props) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from("habits")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    if (err) {
      setError(err.message)
    } else {
      setHabits(data as Habit[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchHabits()
  }, [fetchHabits])

  // Re-fetch when returning from AddHabit screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchHabits)
    return unsubscribe
  }, [navigation, fetchHabits])

  const renderHabit: ListRenderItem<Habit> = ({ item }) => (
    <View className="bg-card border border-card-border rounded-2xl mx-4 mb-3 p-4 flex-row items-center gap-4">
      {/* Circle indicator */}
      <View className="w-10 h-10 rounded-full border-2 border-primary items-center justify-center">
        <Text className="text-primary text-lg">✓</Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-foreground font-semibold text-base">{item.title}</Text>
        <View className="flex-row items-center gap-2 mt-1">
          <View className="bg-primary/20 px-2 py-0.5 rounded-full">
            <Text className="text-primary text-xs font-medium">{item.category}</Text>
          </View>
          <Text className="text-muted-foreground text-xs">
            {item.frequency} · {item.target_count} {item.unit}
          </Text>
        </View>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-red-400 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchHabits}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-4">
        <View>
          <Text className="text-foreground text-2xl font-bold">My Habits</Text>
          <Text className="text-muted-foreground text-sm mt-1">
            Track your daily learning rituals
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => shareHabits("https://supabase-testing-nu.vercel.app/habits")}
          className="w-10 h-10 rounded-full bg-card border border-card-border items-center justify-center"
        >
          <Text className="text-primary text-lg">↑</Text>
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      <View className="flex-row gap-3 px-4 mb-6">
        <View className="flex-1 bg-card border border-card-border rounded-xl p-3">
          <Text className="text-foreground text-xl font-bold">{habits.length}</Text>
          <Text className="text-muted-foreground text-xs mt-0.5">Total Habits</Text>
        </View>
        <View className="flex-1 bg-card border border-card-border rounded-xl p-3">
          <Text className="text-foreground text-xl font-bold">0/{habits.length}</Text>
          <Text className="text-muted-foreground text-xs mt-0.5">Done Today</Text>
        </View>
        <View className="flex-1 bg-card border border-card-border rounded-xl p-3">
          <Text className="text-foreground text-xl font-bold">—</Text>
          <Text className="text-muted-foreground text-xs mt-0.5">Streak</Text>
        </View>
      </View>

      {/* Habit list */}
      {habits.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-4xl mb-4">🌱</Text>
          <Text className="text-foreground font-semibold text-lg mb-2">No habits yet</Text>
          <Text className="text-muted-foreground text-sm text-center mb-6">
            Start building your learning routine — add your first habit.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddHabit")}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Add your first habit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderHabit}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}

      {/* Add button */}
      {habits.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddHabit")}
          className="absolute bottom-8 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-white text-3xl font-light">+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

export default HabitListScreen
