// screens/LandingScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/images/restaurant-background.png')}
      style={styles.background}
    >
      {/* Transparent Status Bar */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Lovely Place Restaurant</Text>
        <Text style={styles.subtitle}>Discover delicious meals and place your order easily</Text>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF', // Ensure contrast with background
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#EFEFEF',
  },
  roundButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LandingScreen;
