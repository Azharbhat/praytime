import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../Firebase/FirebaseConfig';

export default function Home({ navigation }) {
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: '',
    Dhuhr: '',
    Asr: '',
    Maghrib: '',
    Isha: '',
  });
  const [hadith, setHadith] = useState('');

  useEffect(() => {
    // Fetch prayer times from Firebase database
    const prayerTimesRef = ref(database, 'prayerTimes');
    onValue(prayerTimesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPrayerTimes(data);
      }
    });
console.log(prayerTimes)
    // Fetch Hadith from Firebase database
    const hadithRef = ref(database, 'dailyHadith');
    onValue(hadithRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Get the first child (random key) of the dailyHadith node
        const firstKey = Object.keys(data)[0];
        // Access the hadith property inside the object
        const hadithData = data[firstKey];
        // Set the Hadith state
        setHadith(hadithData.hadith);
      }
    }, (error) => {
      console.error("Error fetching Hadith:", error);
    });
  }, []);

  const handleLogoLongPress = () => {
    navigation.navigate('Login'); // Navigate to the login screen
  };

  return (
    <View style={styles.container}>
      {/* Logo with shadow */}
      <TouchableOpacity onLongPress={handleLogoLongPress}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/Logo.jpeg')} style={styles.logo} />
        </View>
      </TouchableOpacity>

      {/* Address */}
      <Text style={styles.address}>Supernaghama, Qaziabad, Kupwara, J&K</Text>

      {/* Date */}
      <Text style={styles.date}>Date: {new Date().toDateString()}</Text>

      {/* Prayer Times */}
      <Text style={styles.heading}>Prayer Times</Text>
      <View style={styles.prayerTimesContainer}>
        {/* Prayer Times List */}
        <View style={styles.prayerRow}>
          <Text style={styles.prayerName}>Fajr:</Text>
          <Text style={styles.prayerTime}>{prayerTimes.fajr}</Text>
        </View>
        <View style={styles.prayerRow}>
          <Text style={styles.prayerName}>Dhuhr:</Text>
          <Text style={styles.prayerTime}>{prayerTimes.dhuhr}</Text>
        </View>
        <View style={styles.prayerRow}>
          <Text style={styles.prayerName}>Asr:</Text>
          <Text style={styles.prayerTime}>{prayerTimes.asr}</Text>
        </View>
        <View style={styles.prayerRow}>
          <Text style={styles.prayerName}>Maghrib:</Text>
          <Text style={styles.prayerTime}>{prayerTimes.maghrib}</Text>
        </View>
        <View style={styles.prayerRow}>
          <Text style={styles.prayerName}>Isha:</Text>
          <Text style={styles.prayerTime}>{prayerTimes.isha}</Text>
        </View>
      </View>

      {/* Hadith Box */}
      <Text style={styles.heading}>Hadith Today</Text>
      <View style={styles.hadeesBox}>
        <Text style={styles.hadeesText}>{hadith}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgb(35, 59, 59)',
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  address: {
    marginTop: 20,
    fontSize: 18,
    color: 'white',
  },
  date: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  heading: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  prayerTimesContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '80%',
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  prayerName: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
  },
  prayerTime: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
  },
  hadeesBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    height: 150,
    backgroundColor: 'white',
  },
  hadeesText: {
    fontSize: 16,
  },
});
