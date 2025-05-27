import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { getHabits, Habit } from '../utils/habbitStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const today = new Date().toISOString().split('T')[0];

const HabitListScreen = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [filter, setFilter] = useState<'All' | 'Daily' | 'Weekly'>('All');
    const navigation = useNavigation<any>();

    const loadHabits = async () => {
        const data = await getHabits();
        setHabits(data);
    };

    useEffect(() => {
        loadHabits();
    }, []);

    const markCompleted = async (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const updated = habits.map(habit =>
            habit.id === id && !habit.completedDates.includes(today)
                ? { ...habit, completedDates: [...habit.completedDates, today] }
                : habit
        );
        setHabits(updated);
        await AsyncStorage.setItem('habits', JSON.stringify(updated));
        Alert.alert('🎉 Success', 'Habit marked as completed!');
    };

    const deleteHabit = async (id: string) => {
        Alert.alert('🗑 Confirm Delete', 'Do you want to delete this habit?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    const updated = habits.filter(h => h.id !== id);
                    setHabits(updated);
                    await AsyncStorage.setItem('habits', JSON.stringify(updated));
                    Alert.alert('✅ Deleted', 'Habit removed successfully!');
                },
            },
        ]);
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.replace('Login');
    };

    const renderHabit = ({ item }: { item: Habit }) => {
        const isCompletedToday = item.completedDates.includes(today);
        return (
            <View style={styles.habitItem}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.habitName}>📌 {item.name}</Text>
                    <Text style={styles.habitInfo}>📅 Frequency: {item.frequency}</Text>
                    <Text style={styles.habitInfo}>
                        {isCompletedToday ? '✅ Completed Today' : '❌ Not Completed Yet'}
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    {!isCompletedToday && (
                        <TouchableOpacity
                            style={styles.completeBtn}
                            onPress={() => markCompleted(item.id)}
                        >
                            <Text style={styles.completeText}>✅ Done</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => deleteHabit(item.id)}
                    >
                        <Text style={styles.deleteText}>🗑 Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌟 My Habit Tracker</Text>

            <TouchableOpacity
                style={styles.createBtn}
                onPress={() => navigation.navigate('CreateHabit')}
            >
                <Text style={styles.createText}>➕ Add New Habit</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.progressBtn}
                onPress={() => navigation.navigate('progress')}
            >
                <Text style={styles.progressText}>📈 Track Progress</Text>
            </TouchableOpacity>

            <View style={styles.filterContainer}>
                {['All', 'Daily', 'Weekly'].map(type => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setFilter(type as 'All' | 'Daily' | 'Weekly')}
                        style={[
                            styles.filterButton,
                            filter === type && styles.selectedFilterButton,
                        ]}
                    >
                        <Text style={styles.filterText}>
                            {type === 'All' ? '🌍' : type === 'Daily' ? '📆' : '🗓'} {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={habits.filter(habit =>
                    filter === 'All' ? true : habit.frequency === filter
                )}
                keyExtractor={item => item.id}
                renderItem={renderHabit}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No habits found. Create one!</Text>
                }
            />

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HabitListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e8f5e9',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#2e7d32',
    },
    habitItem: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#bbb',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    habitName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
        color: '#1b5e20',
    },
    habitInfo: {
        fontSize: 14,
        color: '#555',
    },
    completeBtn: {
        backgroundColor: '#66bb6a',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 8,
    },
    completeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteBtn: {
        backgroundColor: '#e53935',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    createBtn: {
        backgroundColor: '#43a047',
        padding: 14,
        borderRadius: 30,
        marginBottom: 12,
        alignItems: 'center',
    },
    createText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBtn: {
        backgroundColor: '#1e88e5',
        padding: 14,
        borderRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    progressText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutBtn: {
        marginTop: 20,
        padding: 14,
        backgroundColor: '#8e24aa',
        borderRadius: 30,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    filterButton: {
        backgroundColor: '#c8e6c9',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
    },
    selectedFilterButton: {
        backgroundColor: '#43a047',
    },
    filterText: {
        color: '#fff',
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 40,
        color: '#777',
    },
});