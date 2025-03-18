// screens/MealsScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { mealData } from '../data/mealData';
import mealImages from '../assets/images/meals';
import headerImage from '../assets/images/restaurant-header.png'; 

const MealsScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;


  useFocusEffect(
    React.useCallback(() => {
      setMeals(mealData);
      setSelectedMeals([]); // Reset selection on screen load
    }, [])
  );

  // Get image source
  const getImage = (imageName) => {
    const key = imageName.replace(/\.[^.]+$/, '');
    return mealImages[key];
  };

  // Toggle meal selection
  const toggleMealSelection = (meal) => {
    setSelectedMeals((prev) => {
      const isAlreadySelected = prev.some((m) => m.id === meal.id);
      if (isAlreadySelected) {
        return prev.filter((m) => m.id !== meal.id);
      } else {
        return [...prev, meal];
      }
    });
  };


  // Interpolations for parallax header
  const parallaxHeaderHeight = 250;
  const headerScrollDistance = parallaxHeaderHeight;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [0, -headerScrollDistance],
    extrapolate: 'clamp',
  });
  
  // Render meal item
  const renderMealItem = ({ item }) => {
    const isSelected = selectedMeals.some((meal) => meal.id === item.id);
    return (
      <View style={styles.mealItem}>
        <Image source={getImage(item.image)} style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.mealDescription}>{item.description}</Text>
          <Text style={styles.mealPrice}>£{item.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.selectButton, isSelected && styles.selected]}
          onPress={() => toggleMealSelection(item)}
        >
          <Text style={styles.buttonText}>{isSelected ? '✓ Selected' : 'Select'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Transparent Status Bar */}
      <StatusBar translucent backgroundColor="#888" barStyle="light-content" />
      {/* Header image */}
      <View style={[styles.header]}>
      <Image source={headerImage} style={styles.headerImage} />

      </View>
      <Text style={styles.title} type="title">
        Browse Our Menu
      </Text>
      {/* <Text style={styles.title}>Menu</Text> */}
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={[styles.proceedButton, selectedMeals.length === 0 && styles.disabledButton]}
        onPress={() => selectedMeals.length > 0 && navigation.navigate('Order', { selectedMeals })}
        disabled={selectedMeals.length === 0}
      >
        <Text style={styles.proceedText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: { fontSize: 22, marginBottom: 20 },
  mealItem: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center' },
  mealImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 18, fontWeight: 'bold' },
  mealDescription: { fontSize: 14, color: '#666', marginVertical: 5 },
  mealPrice: { fontSize: 16, fontWeight: 'bold', color: '#e91e63' },
  selectButton: { padding: 10, borderRadius: 5, backgroundColor: '#2196F3' },
  selected: { backgroundColor: '#4CAF50' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  proceedButton: { backgroundColor: '#e91e63', padding: 15, alignItems: 'center', borderRadius: 5, marginTop: 20 },
  disabledButton: { backgroundColor: '#ccc' },
  proceedText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  listContent: { flexGrow: 1 }, // Ensure the FlatList takes available space
});

export default MealsScreen;