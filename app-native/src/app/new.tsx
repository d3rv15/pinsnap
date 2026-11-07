import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { useProjects } from '../lib/store';
import { colors, radius } from '../lib/theme';
import type { GeoPoint } from '../lib/types';

function formatAddress(a: Location.LocationGeocodedAddress): string {
  const street = [a.street, a.streetNumber].filter(Boolean).join(' ');
  const city = [a.postalCode, a.city ?? a.subregion].filter(Boolean).join(' ');
  return [street || a.name, city].filter(Boolean).join(', ');
}

export default function NewProject() {
  const insets = useSafeAreaInsets();
  const { createProject } = useProjects();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<GeoPoint | undefined>();
  const [locating, setLocating] = useState(false);

  const locate = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Kein Standortzugriff', 'Erlaube den Standort in den Einstellungen, um GPS zu nutzen.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const point = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setLocation(point);
      try {
        const [hit] = await Location.reverseGeocodeAsync(point);
        if (hit && !address.trim()) setAddress(formatAddress(hit));
      } catch {
        // Adresssuche optional – Koordinaten reichen
      }
    } catch {
      Alert.alert('GPS nicht verfügbar', 'Der Standort konnte nicht ermittelt werden. Versuche es im Freien erneut.');
    } finally {
      setLocating(false);
    }
  };

  const start = (skip = false) => {
    const project = createProject(skip ? { name: '', address: '' } : { name, address, location });
    router.replace({ pathname: '/camera', params: { projectId: project.id } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.lead}>Gib deinem Projekt einen Namen – oder leg einfach direkt mit der Kamera los.</Text>

        <Field label="Projektname" icon="folder-open-outline">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="z. B. Hausrenovierung"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            autoFocus
            returnKeyType="next"
          />
        </Field>

        <Field label="Adresse" icon="home-outline">
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Straße Nr., PLZ Ort"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
          />
        </Field>

        <View style={styles.gpsCard}>
          <View style={[styles.gpsIcon, location && { backgroundColor: colors.teal }]}>
            <Ionicons name={location ? 'checkmark' : 'navigate'} size={20} color={location ? colors.black : colors.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.gpsTitle}>{location ? 'Standort erfasst' : 'GPS-Standort (optional)'}</Text>
            <Text style={styles.gpsText}>
              {location
                ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                : 'Erfasst deine Position und füllt die Adresse automatisch.'}
            </Text>
          </View>
          {location ? (
            <Button label="Entfernen" variant="ghost" onPress={() => setLocation(undefined)} />
          ) : (
            <Button label="Erfassen" variant="secondary" loading={locating} onPress={locate} />
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <Button label="Start – Kamera öffnen" icon="camera" big onPress={() => start()} />
        <Button label="Ohne Angaben direkt zur Kamera" variant="ghost" onPress={() => start(true)} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, icon, children }: { label: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Ionicons name={icon} size={18} color={colors.textDim} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.textDim, fontSize: 15, lineHeight: 21 },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 54,
  },
  input: { flex: 1, color: colors.text, fontSize: 16 },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: 'rgba(46,211,183,0.3)',
  },
  gpsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  gpsTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  gpsText: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  bottom: { paddingHorizontal: 20, paddingTop: 12, gap: 6, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
});
