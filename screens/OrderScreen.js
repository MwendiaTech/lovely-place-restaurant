// screens/OrderScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar
} from "react-native";
import mealImages from "../assets/images/meals";
import { saveOrder, readOrders, updateOrders } from "../data/orders";

const OrderScreen = ({ route, navigation }) => {
  const selectedMeals = route.params?.selectedMeals || [];
  const [savedOrders, setSavedOrders] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState([]);
  

  useEffect(() => {
    loadOrders();
    setSelectedMeal([]); // Reset selection on screen load
  }, []);

  // Load orders from AsyncStorage
  const loadOrders = async () => {
    const orders = await readOrders();
    setSavedOrders(orders);
  };

  // Auto-save order when proceeding to Checkout
  const proceedToCheckout = async () => {
    const order = {
      id: Date.now(),
      meals: selectedMeals,
      total: calculateTotal(),
      date: new Date().toLocaleString(),
    };
    await saveOrder(order);
    loadOrders();
    navigation.navigate("Checkout", { selectedMeals });
  };

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    const updatedOrders = savedOrders.filter((order) => order.id !== orderId);
    await updateOrders(updatedOrders);
    setSavedOrders(updatedOrders);
    Alert.alert("Deleted", "Order removed successfully.");
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedMeals.reduce((total, meal) => total + meal.price, 0);
  };

  // Helper function to get the correct image
  const getImage = (imageName: string) => {
    const key = imageName.replace(/\.[^.]+$/, "");
    return mealImages[key];
  };

  // Render selected order items before saving
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image source={getImage(item.image)} style={styles.orderItemImage} />
      <View style={styles.orderItemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  // Render saved orders
  const renderSavedOrder = ({ item, index }) => (
    <View style={styles.savedOrderContainer}>
      <Text style={styles.orderTitle}>
        Order #{index + 1} - {item.date}
      </Text>
      <FlatList
        data={item.meals}
        renderItem={({ item }) => (
          <View style={styles.savedOrderItem}>
            <Image
              source={getImage(item.image)}
              style={styles.savedOrderImage}
            />
            <Text style={styles.savedItemText}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(meal) => meal.id.toString()}
      />
      <Text style={styles.totalText}>Total: ${item.total.toFixed(2)}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteOrder(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Transparent Status Bar */}
      <StatusBar translucent backgroundColor="#888" barStyle="light-content" />
      {selectedMeals.length > 0 ? (
        <>
          <Text style={styles.title}>Your Order</Text>
          <FlatList
            data={selectedMeals}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: ${calculateTotal().toFixed(2)}
            </Text>
          </View>
          <Button title="Proceed to Checkout" onPress={proceedToCheckout} />
        </>
      ) : (
        <Text style={styles.noOrdersText}>🚫 No order or meal selected.</Text>
      )}

      <Text style={styles.title}>Saved Orders</Text>
      {savedOrders.length > 0 ? (
        <FlatList
          data={savedOrders}
          renderItem={renderSavedOrder}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noOrdersText}>No saved orders</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  orderItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
  },
  orderItemImage: { width: 80, height: 80, borderRadius: 5, marginRight: 15 },
  orderItemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 16, color: "#e91e63", marginTop: 5 },
  totalContainer: { alignItems: "flex-end", marginVertical: 20 },
  totalText: { fontSize: 18, fontWeight: "bold" },
  savedOrderContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 2,
  },
  orderTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  savedOrderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  savedOrderImage: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  savedItemText: { fontSize: 16 },
  deleteButton: {
    backgroundColor: "#e91e63",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: { color: "white", fontWeight: "bold" },
  noOrdersText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#888",
  },
});

export default OrderScreen;