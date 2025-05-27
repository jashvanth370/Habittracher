import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.email === email && user.password === password) {
                navigation.replace('HabitList');
            } else {
                Alert.alert('Error', 'Invalid credentials');
            }
        } else {
            Alert.alert('Error', 'No user found. Please register.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Habit Tracker</Text>

            <View style={styles.card}>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.registerBtn}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText}>Register Instead</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 24,
        borderRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        color: '#333',
    },
    loginBtn: {
        backgroundColor: '#1976d2',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerBtn: {
        marginTop: 16,
        alignItems: 'center',
    },
    registerText: {
        color: '#1976d2',
        fontSize: 14,
        fontWeight: '500',
    },
});