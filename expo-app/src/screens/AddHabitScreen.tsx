import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { supabase } from "../lib/supabase"
import type { RootStackParamList } from "./HabitListScreen"

type Props = NativeStackScreenProps<RootStackParamList, "AddHabit">

const CATEGORIES = ["Learning", "Coding", "Focus", "Health", "Reading"]

export function AddHabitScreen({ navigation }: Props) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Learning")
  const [saving, setSaving] = useState(false)
  const [titleError, setTitleError] = useState("")

  async function handleSave() {
    if (!title.trim()) {
      setTitleError("Habit title is required.")
      return
    }
    setTitleError("")
    setSaving(true)

    const { error } = await supabase.from("habits").insert({
      title: title.trim(),
      category,
      frequency: "daily",
      target_count: 1,
      unit: "times",
      is_active: true,
    })

    setSaving(false)

    if (error) {
      Alert.alert("Error", error.message)
    } else {
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-foreground text-2xl font-bold mb-6">New Habit</Text>

        {/* Title */}
        <View className="mb-4">
          <Text className="text-foreground text-sm font-medium mb-1">
            Title <Text className="text-red-400">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={(v) => {
              setTitle(v)
              if (v.trim()) setTitleError("")
            }}
            placeholder="e.g. Read 20 pages"
            placeholderTextColor="#64748b"
            className="bg-card border border-card-border rounded-xl px-4 py-3 text-foreground"
          />
          {titleError ? (
            <Text className="text-red-400 text-xs mt-1">{titleError}</Text>
          ) : null}
        </View>

        {/* Category picker */}
        <View className="mb-6">
          <Text className="text-foreground text-sm font-medium mb-2">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full border ${
                  category === cat
                    ? "bg-primary border-primary"
                    : "bg-card border-card-border"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    category === cat ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`bg-primary rounded-xl py-4 items-center ${saving ? "opacity-60" : ""}`}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Save Habit</Text>
          )}
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-3 py-3 items-center"
        >
          <Text className="text-muted-foreground">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddHabitScreen
