import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProjectsProvider } from '../lib/store';
import { colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <ProjectsProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new" options={{ title: 'Neues Projekt', presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="camera" options={{ headerShown: false, animation: 'fade', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="project/[id]" options={{ title: '' }} />
        <Stack.Screen name="photo" options={{ title: 'Foto' }} />
        <Stack.Screen name="pin" options={{ title: 'Pin' }} />
        <Stack.Screen name="share" options={{ title: 'Teilen & Team', presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </ProjectsProvider>
  );
}
