// 



import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';

// Simple hash function to convert UUID to short number
const hashToNumber = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash); // always positive
};

export const useDeviceId = () => {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [shortDeviceId, setShortDeviceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDeviceId = async () => {
            try {
                // Try to read the ID from secure storage
                let id = await SecureStore.getItemAsync('device_id');
                
                if (!id) {
                    // If not found, create a new UUID
                    id = Crypto.randomUUID();
                    await SecureStore.setItemAsync('device_id', id);
                }

                setDeviceId(id);

                // Convert to short numeric unique ID
                const shortId = hashToNumber(id).toString();
                setShortDeviceId(shortId);

            } catch (error) {
                console.error('❌ Error loading device ID:', error);
                
                // Fallback: timestamp + random number
                const tempId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                setDeviceId(tempId);
                setShortDeviceId(hashToNumber(tempId).toString());
            } finally {
                setIsLoading(false);
            }
        };

        loadDeviceId();
    }, []);

    return { deviceId, shortDeviceId, isLoading };
};
