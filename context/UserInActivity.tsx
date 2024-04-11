import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
    id: "UserInActivity",
});

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

    const handleAppStateChange = (nextAppState: any) => {
        if(nextAppState === "inactive") {
            router.push('/(modals)/white');
        } else {
            if(router.canGoBack()) {
                router.back();
            }
        } 

        if(nextAppState === "background") {
            recordStartTime();
        } else if(nextAppState === "active" && appState.current.match(/background/)) {
            const elapsed = Date.now() - (storage.getNumber('startTime') || 0);

            if(elapsed >= LOCK_TIME) {
                router.push("/(modals)/lock");
            }
        }

        appState.current = nextAppState;
    }

    const recordStartTime = () => {
        storage.set('startTime', Date.now());
    }
    return childern
}