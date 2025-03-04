import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Signup({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const handleSignup = async () => {
    if (name.length > 0 && email.length > 0 && password.length > 0 && gender.length > 0) {
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await user.updateProfile({
          displayName: name,
        });

        await firestore().collection('users').doc(user.uid).set({
          displayName: name,
          email: email,
          gender: gender,
          dateOfBirth: dob.toISOString().split('T')[0],
          profilePic: '',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        alert('Signup successful! You can now log in.');
        navigation.navigate('Login');
      } catch (error) {
        console.error(error);
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('The email address is already in use.');
            break;
          case 'auth/invalid-email':
            alert('The email address is not valid.');
            break;
          case 'auth/weak-password':
            alert('The password is too weak.');
            break;
          default:
            alert('An error occurred. Please try again.');
        }
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const genderOptions = ['Male', 'Female', 'Rather Not Say'];

  return (
    <View style={styles.container}>
      <View style={styles.SignupHeader}>
        <View  style={styles.linearGradient}>
       
          <Text style={styles.HeadText}>SignUp to your Account</Text>
          <Text style={styles.HeadSubtext}>Create a new account</Text>
        </View>
        
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={name}
          onChangeText={value => setName(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => setShowGenderPicker(true)} style={styles.input}>
          <Text style={{ color: gender ? '#000' : '#888' }}>
            {gender || 'Select Gender'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: '#000' }}>{dob.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleSignup}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
            Signup
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginView}>
        <View>
          <Text style={{color: '#000000'}}>Already have an account?</Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.login}
            onPress={() => navigation.navigate('Login')}>
            <Text style={{color: '#8A4FFF', fontWeight: 'bold'}}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={showGenderPicker}
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setGender(item);
                    setShowGenderPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
  },
  inputView: {
    paddingTop: '16%',
    width: '100%',
  },
  input: {
    alignSelf: 'center',
    width: '80%',
    borderRadius: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1C1C1C',
    padding: 14,
    paddingLeft: 28,
  },
  addButton: {
    backgroundColor: '#8A4FFF',
    padding: 14,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 4,
  },
  loginView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: '8%',
  },
  login: {
    fontSize: 14,
    marginHorizontal: 5,
  },
  HeadText: {
    paddingTop: '30%',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
    paddingLeft: 16,
  },
  HeadSubtext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5F1EB',
    textAlign: 'left',
    paddingLeft: 16,
    paddingBottom: 16,
  },
  SignupHeader: {
    backgroundColor: '#8A4FFF',
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'flex-start', // Fixed
    paddingVertical: 10,
  },
  linearGradient: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 18,
  },
  modalCancel: {
    marginTop: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 18,
    color: 'red',
  },
});