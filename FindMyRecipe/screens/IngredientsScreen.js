import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function IngredientsScreen() {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [results, setResults] = useState([]);

  const addIngredient = () => {
    if (input.trim()) {
      setIngredients([...ingredients, input.trim()]);
      setInput('');
    }
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter(ing => ing !== item));
  };

  const searchRecipes = async () => {
    try {
      const response = await fetch(`https://fakeapi.com/recipes?ingredients=${ingredients.join(',')}`);
      const data = await response.json();
      setResults(data.recipes || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Ingredients</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., eggs"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={addIngredient}
      />
      <Button title="Add Ingredient" onPress={addIngredient} />
      <View style={styles.ingredientList}>
        {ingredients.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => removeIngredient(item)}>
            <Text style={styles.ingredientChip}>{item} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Search Recipes" onPress={searchRecipes} />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.title || 'Untitled Recipe'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
  ingredientList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  ingredientChip: {
    backgroundColor: '#eee',
    padding: 8,
    margin: 4,
    borderRadius: 20,
  },
  recipeCard: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    marginVertical: 6,
  },
  recipeTitle: {
    fontSize: 16,
  },
});
