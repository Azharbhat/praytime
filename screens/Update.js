import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard, Alert, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ref, update, push, onValue, off } from 'firebase/database';
import { database } from '../Firebase/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Update({ navigation }) {
  const [fajrTime, setFajrTime] = useState('');
  const [dhuhrTime, setDhuhrTime] = useState('');
  const [asrTime, setAsrTime] = useState('');
  const [maghribTime, setMaghribTime] = useState('');
  const [ishaTime, setIshaTime] = useState('');
  const [hadith, setHadith] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const prayerTimesRef = ref(database, 'prayerTimes');
      onValue(prayerTimesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFajrTime(data.fajr || '');
          setDhuhrTime(data.dhuhr || '');
          setAsrTime(data.asr || '');
          setMaghribTime(data.maghrib || '');
          setIshaTime(data.isha || '');
        }
      });
    };

    fetchData();

    return () => {
      off(ref(database, 'prayerTimes'));
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setScrollEnabled(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setScrollEnabled(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleUpdatePrayer = (prayer) => {
    const updates = {};
    updates[prayer.toLowerCase()] = getTimeValue(prayer);
    update(ref(database, 'prayerTimes'), updates);
    Alert.alert('Success', `${prayer} time updated successfully!`);
  };

  const handleUpdateHadith = () => {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const newHadithRef = push(ref(database, 'dailyHadith'));
    update(newHadithRef, { hadith, date: currentDate })
      .then(() => {
        setHadith('');
        Alert.alert('Success', 'Hadith updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating Hadith:', error);
        Alert.alert('Error', 'Failed to update Hadith');
      });
  };

  const getTimeValue = (prayer) => {
    switch (prayer) {
      case 'Fajr':
        return fajrTime;
      case 'Dhuhr':
        return dhuhrTime;
      case 'Asr':
        return asrTime;
      case 'Maghrib':
        return maghribTime;
      case 'Isha':
        return ishaTime;
      default:
        return '';
    }
  };

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
    <ScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={scrollEnabled}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Update Prayer Times and Hadith</Text>

      {/* Prayer Time Inputs */}
      <View style={styles.prayerTimeInputs}>
        <Text style={styles.prayerLabel}>Fajr</Text>
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={fajrTime}
          onChangeText={setFajrTime}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleUpdatePrayer('Fajr')}
        >
          <FontAwesome name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.prayerTimeInputs}>
        <Text style={styles.prayerLabel}>Dhuhr</Text>
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={dhuhrTime}
          onChangeText={setDhuhrTime}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleUpdatePrayer('Dhuhr')}
        >
          <FontAwesome name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.prayerTimeInputs}>
        <Text style={styles.prayerLabel}>Asr</Text>
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={asrTime}
          onChangeText={setAsrTime}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleUpdatePrayer('Asr')}
        >
          <FontAwesome name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.prayerTimeInputs}>
        <Text style={styles.prayerLabel}>Maghrib</Text>
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={maghribTime}
          onChangeText={setMaghribTime}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleUpdatePrayer('Maghrib')}
        >
          <FontAwesome name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.prayerTimeInputs}>
        <Text style={styles.prayerLabel}>Isha</Text>
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={ishaTime}
          onChangeText={setIshaTime}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleUpdatePrayer('Isha')}
        >
          <FontAwesome name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Hadith Input */}
      <TextInput
        style={[styles.hadithInput]}
        placeholder="Update Hadith"
        value={hadith}
        onChangeText={setHadith}
        multiline
      />
      <TouchableOpacity
        style={[styles.updateButton, styles.hadithUpdateButton]}
        onPress={handleUpdateHadith}
      >
        <Text style={styles.buttonText}>Upload Hadith</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.updateButton, styles.hadithUpdateButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgb(35, 59, 59)',
    paddingVertical: 50
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 5,
    marginRight: 5
  },
  prayerTimeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  prayerLabel: {
    color: 'white',
    fontSize: 16,
    width: 70
  },
  iconButton: {
    backgroundColor: 'rgb(35, 79, 59)',
    padding: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  hadithInput: {
    width: '100%',
    padding: 10,
    lineHeight: 25,
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 5,

  },
  hadithUpdateButton: {
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
