import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 Find My Recipe</Text>
      <Button
        title="Get Random Recipe"
        onPress={() => {
          // Navigate to Random screen or handle it here later
          alert("Random recipe feature coming soon!");
        }}
      />
      <View style={{ height: 20 }} />
      <Button
        title="Find Recipes by Ingredients"
        onPress={() => navigation.navigate('Ingredients')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
  },
});
