import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { saveHabit, Habit } from '../utils/habbitStorage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    CreateHabit: undefined;
    HabitList: undefined;
};

const generateId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

const CreateHabitScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [habitName, setHabitName] = useState('');
    const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | ''>('');

    const handleSaveHabit = async () => {
        if (!habitName || !frequency) {
            Alert.alert('Missing Info', 'Please enter a habit name and choose frequency');
            return;
        }

        const newHabit: Habit = {
            id: generateId(),
            name: habitName.trim(),
            frequency,
            createdAt: new Date().toISOString(),
            completedDates: [],
        };

        await saveHabit(newHabit);
        Alert.alert('Success', 'Habit saved!');
        navigation.navigate('HabitList');
        setHabitName('');
        setFrequency('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📌 Create New Habit</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Habit Name"
                    placeholderTextColor="#888"
                    value={habitName}
                    onChangeText={setHabitName}
                />

                <Text style={styles.label}>Select Frequency</Text>
                <View style={styles.frequencyContainer}>
                    <TouchableOpacity
                        style={[styles.freqBtn, frequency === 'Daily' && styles.selected]}
                        onPress={() => setFrequency('Daily')}
                    >
                        <Text style={styles.freqText}>Daily</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.freqBtn, frequency === 'Weekly' && styles.selected]}
                        onPress={() => setFrequency('Weekly')}
                    >
                        <Text style={styles.freqText}>Weekly</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveHabit}>
                    <Text style={styles.saveText}>💾 Save Habit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateHabitScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3f51b5',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
        color: '#333',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
        fontWeight: '600',
    },
    frequencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    freqBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        backgroundColor: '#cfd8dc',
    },
    selected: {
        backgroundColor: '#4caf50',
    },
    freqText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: '#3f51b5',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});