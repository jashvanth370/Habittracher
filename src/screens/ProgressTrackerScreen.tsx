import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getHabits, Habit } from '../utils/habbitStorage';

const today = new Date().toISOString().split('T')[0];

const ProgressTrackerScreen = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completionRate, setCompletionRate] = useState(0);
    const [progressAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        const calculateProgress = async () => {
            const allHabits = await getHabits();
            setHabits(allHabits);

            if (allHabits.length === 0) {
                setCompletionRate(0);
                return;
            }

            const completedToday = allHabits.filter(habit =>
                habit.completedDates.includes(today)
            );

            const percentage = Math.round((completedToday.length / allHabits.length) * 100);
            setCompletionRate(percentage);

            Animated.timing(progressAnim, {
                toValue: percentage,
                duration: 800,
                useNativeDriver: false,
            }).start();
        };

        calculateProgress();
    }, []);

    const widthInterpolate = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📊 Today's Progress</Text>

            <View style={styles.card}>
                <Text style={styles.metric}>
                    Total Habits: <Text style={styles.bold}>{habits.length}</Text>
                </Text>
                <Text style={styles.metric}>
                    Completed Today:{' '}
                    <Text style={styles.bold}>
                        {habits.filter(h => h.completedDates.includes(today)).length}
                    </Text>
                </Text>
                <Text style={styles.metric}>
                    Completion Rate: <Text style={styles.bold}>{completionRate}%</Text>
                </Text>

                <View style={styles.progressBar}>
                    <Animated.View style={[styles.progressFill, { width: widthInterpolate }]} />
                </View>
                <Text style={styles.progressText}>{completionRate}% Complete</Text>
            </View>
        </View>
    );
};

export default ProgressTrackerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#3f51b5',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    metric: {
        fontSize: 18,
        marginBottom: 12,
        color: '#444',
    },
    bold: {
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    progressBar: {
        height: 20,
        backgroundColor: '#cfd8dc',
        borderRadius: 10,
        marginTop: 20,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#03a9f4',
        borderRadius: 10,
    },
    progressText: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#1976d2',
    },
});