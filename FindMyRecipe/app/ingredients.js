import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import '../global.css'

export default function Ingredients({ navigation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  const searchIngredients = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/getIngredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    if (!cart.find((i) => i.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const goToRecipes = () => {
    // navigate to recipes screen with selected ingredients
    navigation.navigate("Recipes", { ingredients: cart });
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-4">
        Add ingredients to your cart!
      </Text>

      {/* Search */}
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-3"
        placeholder="Search ingredients e.g. apple"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchIngredients}
        returnKeyType="search"
      />

      {loading && <ActivityIndicator size="small" className="my-2" />}

      {/* Search results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center py-2 px-2 bg-gray-50 rounded mb-2"
            onPress={() => addToCart(item)}
          >
            <Image
              source={{
                uri: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`,
              }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <Text className="text-base flex-1">{item.name}</Text>
            <Text className="text-blue-500 font-semibold">Add</Text>
          </TouchableOpacity>
        )}
      />

      {/* Cart */}
      {cart.length > 0 && (
        <View className="border-t border-gray-200 mt-4 pt-2">
          <Text className="text-lg font-bold mb-2">Your Cart:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {cart.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2"
              >
                <Image
                  source={{
                    uri: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`,
                  }}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <Text className="mr-2">{item.name}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text className="text-red-500 font-bold">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {cart.length > 0 && (
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-full mt-4 items-center"
          onPress={goToRecipes}
        >
          <Text className="text-white font-bold text-lg">
            Search Recipes
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
