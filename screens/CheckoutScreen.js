// screens/CheckoutScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import mealImages from '../assets/images/meals';
import { saveOrder, readOrders } from '../data/orders';

const CheckoutScreen = ({ route, navigation }) => {
  const selectedMeals = route.params?.selectedMeals || [];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: '',
  });

  const [errors, setErrors] = useState({});
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (orderCompleted) {
      loadOrders();
    }
  }, [orderCompleted]);

  // Load completed orders
  const loadOrders = async () => {
    const orders = await readOrders();
    if (orders.length > 0) {
      setCompletedOrder(orders[orders.length - 1]); // Show the latest completed order
    }
  };

  const calculateTotal = () => {
    return selectedMeals.reduce((total, meal) => total + meal.price, 0);
  };

  // Validate checkout form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
      isValid = false;
    }

    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = 'Payment method is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Confirm order and save it
  const handleConfirmOrder = async () => {
    if (validateForm()) {
      const orderDetails = {
        id: Date.now(),
        meals: selectedMeals,
        total: calculateTotal(),
        date: new Date().toLocaleString(),
        customer: { ...formData },
      };

      await saveOrder(orderDetails);
      setOrderCompleted(true);
      setCompletedOrder(orderDetails);

      Alert.alert('Order Confirmed', 'Your order has been successfully placed!', [{ text: 'OK' }]);

      // Clear form and selected meals after submission
      setFormData({ fullName: '', email: '', phone: '', address: '', paymentMethod: '' });
      setErrors({});
    }
  };

  const getImage = (imageName) => {
    if (!imageName) return null;
    const key = imageName.replace(/\.[^.]+$/, '');
    return mealImages[key] || null;
  };

  // Render ordered meals
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image source={getImage(item.image)} style={styles.orderItemImage} />
      <View style={styles.orderItemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Transparent Status Bar */}
      <StatusBar translucent backgroundColor="#888" barStyle="light-content" />
      {orderCompleted && completedOrder ? (
        // Show completed order details
        <>
          <Text style={styles.title}>Order Completed</Text>
          <Text style={styles.orderDate}>📅 Date: {completedOrder.date}</Text>

          <FlatList
            data={completedOrder.meals}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: £{completedOrder.total.toFixed(2)}</Text>
          </View>

          <View style={styles.customerDetails}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text>Name: {completedOrder.customer.fullName}</Text>
            <Text>Email: {completedOrder.customer.email}</Text>
            <Text>Phone: {completedOrder.customer.phone}</Text>
            <Text>Address: {completedOrder.customer.address}</Text>
            <Text>Payment: {completedOrder.customer.paymentMethod}</Text>
          </View>

          <TouchableOpacity style={styles.newOrderButton} onPress={() => navigation.navigate('Meals')}>
            <Text style={styles.newOrderButtonText}>Place a New Order</Text>
          </TouchableOpacity>
        </>
      ) : selectedMeals.length > 0 ? (
        // Show checkout form if order is not completed
        <>
          <Text style={styles.title}>Checkout</Text>

          <FlatList
            data={selectedMeals}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: £{calculateTotal().toFixed(2)}</Text>
          </View>

          <View style={styles.formContainer}>
            {Object.keys(formData).map((field) => (
              <View key={field}>
                <TextInput
                  style={styles.formInput}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                />
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleConfirmOrder}>
            <Text style={styles.submitButtonText}>Confirm Order</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>🚫 No order or meal selected.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  orderDate: { fontSize: 16, marginBottom: 10 },
  orderItem: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#f8f8f8', borderRadius: 10, padding: 10 },
  orderItemImage: { width: 80, height: 80, borderRadius: 5, marginRight: 15 },
  orderItemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, color: '#e91e63', marginTop: 5 },
  totalContainer: { alignItems: 'flex-end', marginVertical: 20 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  formContainer: { marginTop: 20 },
  formInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: 'white' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
  submitButton: { backgroundColor: '#e91e63', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  customerDetails: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  newOrderButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  newOrderButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  listContent: { flexGrow: 1 },
});

export default CheckoutScreen;