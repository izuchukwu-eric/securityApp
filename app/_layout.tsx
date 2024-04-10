import { Stack } from 'expo-router';
import { UserInActivityProvider } from '~/context/UserInActivity';

export default function Layout() {
  return (
    <UserInActivityProvider>
      <Stack>
        <Stack.Screen  
          name='(modals)/white'
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
        <Stack.Screen  
          name='(modals)/lock'
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
      </Stack>
    </UserInActivityProvider>
  );
}
