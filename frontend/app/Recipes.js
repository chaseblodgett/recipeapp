import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import "../global.css";

export default function Recipes() {
  const { ingredients } = useLocalSearchParams();
  const parsedIngredients = JSON.parse(ingredients);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:5000/getRecipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            ingredients: parsedIngredients.map(item => item.name) 
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setRecipes(data);
        } else {
          console.error("Error fetching recipes:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredients]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Recipes</Text>
      {recipes.length === 0 ? (
        <Text>No recipes found.</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity className="mb-4 p-3 bg-gray-100 rounded-xl shadow">
              <Image
                source={{ uri: item.image }}
                className="w-full h-48 rounded-xl mb-2"
                resizeMode="cover"
              />
              <Text className="text-lg font-bold">{item.title}</Text>
              <Text className="text-sm text-gray-600">
                Used Ingredients: {item.usedIngredientCount} | Missing Ingredients:{" "}
                {item.missedIngredientCount}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
