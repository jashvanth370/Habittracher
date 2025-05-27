import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { saveUser } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('All fields are required');
            return;
        }
        await saveUser({ name, email, password });
        Alert.alert('Success', 'User registered');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📝 Register</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
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

                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
                    <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.loginText}>← Back to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e1f5fe',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#0277bd',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 24,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    registerBtn: {
        backgroundColor: '#0288d1',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginBtn: {
        marginTop: 16,
        alignItems: 'center',
    },
    loginText: {
        color: '#0288d1',
        fontSize: 14,
        fontWeight: '600',
    },
});