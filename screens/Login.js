import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../Firebase/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        // Check if user is logged in
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setLoggedIn(true);

          // Fetch user data from the database
          const userData = JSON.parse(user);
          const userRef = ref(database, 'users/' + userData.email.replace('.', '_'));
          onValue(userRef, (snapshot) => {
            const userDataFromDB = snapshot.val();
            if (userDataFromDB) {
              setIsAdmin(userDataFromDB.admin); // Set isAdmin state based on the value from the database
            }
          });
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    }

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      // Store user data in AsyncStorage
      const userData = { email, password, admin: false }; // Assuming user is not an admin by default
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // Set user data in the database
      const userRef = ref(database, 'users/' + email.replace('.', '_'));
      await set(userRef, userData);

      // Set loggedIn state to true
      setLoggedIn(true);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  useEffect(() => {
    // Navigate based on loggedIn and isAdmin states
    if (loggedIn && isAdmin) {
      navigation.navigate('Update');
    } else if (loggedIn && !isAdmin) {
      navigation.navigate('Profile');
    } else {
      // Stay on the login screen
    }
  }, [loggedIn, isAdmin]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgb(35, 59, 59)', // Same background color as the Home screen
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
