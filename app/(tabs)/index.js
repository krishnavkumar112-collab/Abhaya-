import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [contact, setContact] = useState('');
  const [savedContact, setSavedContact] = useState('');

  // App thurakkumpol saved contact load cheyyan
  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    const stored = await AsyncStorage.getItem('emergencyContact');
    if (stored) setSavedContact(stored);
  };

  // Contact save cheyyan
  const saveContact = async () => {
    if (contact.length < 10) {
      Alert.alert("Error", "Valid aaya oru phone number enter cheyyuka.");
      return;
    }
    await AsyncStorage.setItem('emergencyContact', contact);
    setSavedContact(contact);
    setContact('');
    Alert.alert("Success", "Emergency contact save aayi!");
  };

  // SOS Message ayaykkan
  const triggerSOS = async () => {
    if (!savedContact) {
      Alert.alert("Contact Illa", "Aadyam oru emergency contact save cheyyuka.");
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Error", "Location permission nalkiyaale ithu work aavu.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const message = `EMERGENCY! I need help. My location: ${mapsUrl}`;
    const smsUrl = `sms:${savedContact}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(message)}`;
    
    Linking.openURL(smsUrl);
  };

  // 112-ilekk call cheyyan
  const callEmergencyServices = () => {
    Linking.openURL('tel:112');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ABHAYA</Text>

      {/* Main SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* 112 Button */}
      <TouchableOpacity style={styles.callButton} onPress={callEmergencyServices}>
        <Text style={styles.callText}>📞 Call 112</Text>
      </TouchableOpacity>

      {/* Settings Area */}
      <View style={styles.settings}>
        <Text style={styles.label}>Saved: {savedContact || "None"}</Text>
        <TextInput
          style={styles.input}
          placeholder="New Phone Number"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveContact}>
          <Text style={styles.saveButtonText}>SAVE CONTACT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  title: { fontSize: 30, fontWeight: 'bold', color: '#d32f2f', marginTop: 40 },
  sosButton: {
    backgroundColor: '#ff1744',
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#ffcdd2',
    elevation: 15,
  },
  sosText: { color: 'white', fontSize: 45, fontWeight: '900' },
  callButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  callText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  settings: { width: '100%', padding: 20, backgroundColor: '#f5f5f5', borderRadius: 20 },
  label: { marginBottom: 10, fontSize: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  saveButton: { backgroundColor: '#424242', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold' }
});