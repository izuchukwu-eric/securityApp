import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
// import { MMKV } from "react-native-mmkv";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";

// const storage = new MMKV({
//     id: "UserInActivity",
// });

const LOCK_TIME = 3000;

export const UserInActivityProvider = ({ childern }: any) => {
    const appState = useRef(AppState.currentState);
    const router = useRouter();

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        }
    }, []);

    const handleAppStateChange = async (nextAppState: any) => {
        if(nextAppState === "inactive") {
            router.push("/(modals)/white");
            console.log(nextAppState)
        } else {
            if(router.canGoBack()) {
                router.back();
            }
        } 

        if(nextAppState === "background") {
            console.log(nextAppState)
            recordStartTime();
        } else if(nextAppState === "active" && appState.current.match(/background/)) {
            const startTime = await SecureStore.getItemAsync("startTime");
            const elapsed = Date.now() - (JSON.parse(startTime as string) || 0);

            if(elapsed >= LOCK_TIME) {
                router.push("/(modals)/lock");
            }
        }

        appState.current = nextAppState;
    }

    const recordStartTime = async () => {
        AsyncStorage.setItem('startTime', JSON.stringify(Date.now()));
        await SecureStore.setItemAsync("startTime", JSON.stringify(Date.now()));
    }
    return childern
}