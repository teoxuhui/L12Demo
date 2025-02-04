import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { Gyroscope } from 'expo-sensors';

const App = () => {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [motionDetected, setMotionDetected] = useState(false);
    const [sound, setSound] = useState(null);

    // Function to play sound
    async function playSound() {
        const soundFile = require('./nep.mp3');
        const { sound } = await Audio.Sound.createAsync(soundFile);
        setSound(sound);
        await sound.playAsync();
    }

    // Detect motion and play sound
    useEffect(() => {
        const subscription = Gyroscope.addListener((data) => {
            setData(data); // Update x, y, z values

            // Detect rotational motion
            const isMoving = Math.abs(data.x) > 0 || Math.abs(data.y) > 0 || Math.abs(data.z) > 0;
            setMotionDetected(isMoving);

            if (isMoving) {
                playSound(); // Play sound when rotational motion is detected
            }
        });

        return () => subscription.remove();
    }, []);

    // Cleanup sound on unmount
    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text style={styles.heading}>Rotate the Device</Text>
            {motionDetected && <Text style={styles.motionText}>SHAKE!</Text>}
            <Text style={styles.xyzText}>X: {x.toFixed(2)}</Text>
            <Text style={styles.xyzText}>Y: {y.toFixed(2)}</Text>
            <Text style={styles.xyzText}>Z: {z.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    motionText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 20,
    },
    xyzText: {
        fontSize: 18,
        color: '#555',
    },
});

export default App;
