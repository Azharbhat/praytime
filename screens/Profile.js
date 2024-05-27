import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../Firebase/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState('');

  useEffect(() => {
    let userRef; // Declare userRef variable outside the try block

    async function fetchUserData() {
      try {
        // Retrieve the logged-in user's email from AsyncStorage
        const loggedInUser = await AsyncStorage.getItem('user');
        const loggedInEmail = JSON.parse(loggedInUser).email;

        // Fetch user data from the database using the logged-in user's email
        userRef = ref(database, 'users/' + loggedInEmail.replace('.', '_')); // Adjust the path according to your database structure
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          console.log(userData);
          if (userData) {
            setUserData(userData);
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();

    // Cleanup function
    return () => {
      // Detach the listener when the component unmounts to avoid memory leaks
      if (userRef) {
        onValue(userRef, null);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      // Navigate back to the Home screen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center' }}>Email: {userData.email}</Text>
      <Text style={{ textAlign: 'center' }}>Password: {userData.password}</Text>
      <Text style={{ textAlign: 'center' }}>Admin: {userData.admin ? 'Yes' : 'No'}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
