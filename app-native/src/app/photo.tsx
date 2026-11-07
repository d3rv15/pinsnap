import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinnedImage } from '../components/PinnedImage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button, Empty, IconButton } from '../components/ui';
import { relativeTime, useProjects } from '../lib/store';
import { colors, radius } from '../lib/theme';

export default function PhotoScreen() {
  const insets = useSafeAreaInsets();
  const { projectId, photoId, fresh } = useLocalSearchParams<{ projectId: string; photoId: string; fresh?: string }>();
  const { getProject, updatePhotoNotes, addPin, deletePhoto } = useProjects();
  const project = getProject(projectId);
  const photo = project?.photos[photoId];

  const [notes, setNotes] = useState(photo?.notes ?? '');
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState<{ x: number; y: number } | null>(null);
  const [label, setLabel] = useState('');
  const isFresh = fresh === '1';

  // Notizen automatisch speichern (kurz nach dem Tippen)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!photo || notes === photo.notes) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => updatePhotoNotes(projectId, photoId, notes), 500);
    return () => clearTimeout(saveTimer.current);
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!project || !photo) {
    return <Empty icon="image-outline" title="Foto nicht gefunden" text="Es wurde vielleicht gelöscht." />;
  }

  const confirmPin = (thenShoot: boolean) => {
    if (!draft) return;
    const pin = addPin(projectId, photoId, { ...draft, label });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setDraft(null);
    setLabel('');
    if (thenShoot) {
      setPlacing(false);
      router.push({ pathname: '/camera', params: { projectId, parentPhotoId: photoId, parentPinId: pin.id } });
    }
  };

  const remove = () =>
    Alert.alert('Foto löschen?', 'Alle Pins und Detailfotos dieses Fotos werden ebenfalls gelöscht.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          router.back();
          setTimeout(() => deletePhoto(projectId, photoId), 300);
        },
      },
    ]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <Stack.Screen
        options={{
          title: isFresh ? 'Neues Foto' : 'Foto',
          headerRight: () => <IconButton icon="trash-outline" size={36} tint={colors.danger} bg="transparent" onPress={remove} />,
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140, gap: 16 }} keyboardShouldPersistTaps="handled">
        <Breadcrumbs project={project} photoId={photoId} />

        {isFresh && !placing && photo.pins.length === 0 && (
          <View style={[styles.hint, { backgroundColor: colors.tealSoft }]}>
            <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
            <Text style={styles.hintText}>Foto gespeichert. Füge Notizen hinzu oder markiere Details mit „Pins hinzufügen“.</Text>
          </View>
        )}

        <PinnedImage
          photo={photo}
          onPlace={placing ? (x, y) => setDraft({ x, y }) : undefined}
          onPressPin={(pin) => router.push({ pathname: '/pin', params: { projectId, photoId, pinId: pin.id } })}
        />

        {placing ? (
          <View style={styles.hint}>
            <Ionicons name="finger-print" size={18} color={colors.accent} />
            <Text style={styles.hintText}>Tippe auf die Stelle im Bild, die du markieren möchtest.</Text>
          </View>
        ) : (
          <Text style={styles.meta}>
            Aufgenommen {relativeTime(photo.createdAt)} · {photo.pins.length} {photo.pins.length === 1 ? 'Pin' : 'Pins'}
          </Text>
        )}

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Ionicons name="create-outline" size={16} color={colors.textDim} />
            <Text style={styles.cardTitle}>Notizen</Text>
          </View>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            onBlur={() => updatePhotoNotes(projectId, photoId, notes)}
            multiline
            placeholder="Was ist auf dem Foto zu sehen? Mängel, Maße, To-dos …"
            placeholderTextColor={colors.textFaint}
            style={styles.notes}
          />
        </View>

        {photo.pins.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={styles.sectionLabel}>Pins auf diesem Foto</Text>
            {photo.pins.map((pin, i) => (
              <Pressable
                key={pin.id}
                onPress={() => router.push({ pathname: '/pin', params: { projectId, photoId, pinId: pin.id } })}
                style={({ pressed }) => [styles.pinRow, pressed && { backgroundColor: colors.surfaceHigh }]}
              >
                <View style={[styles.pinDot, { backgroundColor: pin.color }]}>
                  <Text style={styles.pinDotText}>{i + 1}</Text>
                </View>
                <Text style={styles.pinLabel} numberOfLines={1}>
                  {pin.label}
                </Text>
                <Text style={styles.pinCount}>
                  {pin.photoIds.length} {pin.photoIds.length === 1 ? 'Foto' : 'Fotos'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Aktionsleiste */}
      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label={placing ? 'Fertig' : 'Pins hinzufügen'}
          icon={placing ? 'checkmark' : 'pin'}
          variant={placing ? 'secondary' : 'primary'}
          onPress={() => setPlacing((p) => !p)}
          style={{ flex: 1 }}
        />
        <Button
          label={photo.parent ? 'Weiteres Detail' : 'Weiteres Foto'}
          icon="camera"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: '/camera',
              params: photo.parent
                ? { projectId, parentPhotoId: photo.parent.photoId, parentPinId: photo.parent.pinId }
                : { projectId },
            })
          }
          style={{ flex: 1 }}
        />
      </View>

      {/* Dialog: neuer Pin */}
      <Modal visible={!!draft} transparent animationType="fade" onRequestClose={() => setDraft(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Neuer Pin</Text>
            <Text style={styles.sheetText}>Wie heißt diese Stelle?</Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder={`z. B. Haustür, 1. Stock … (Pin ${photo.pins.length + 1})`}
              placeholderTextColor={colors.textFaint}
              style={styles.sheetInput}
              autoFocus
              onSubmitEditing={() => confirmPin(false)}
            />
            <Button label="Pin setzen & Detailfoto machen" icon="camera" onPress={() => confirmPin(true)} />
            <Button label="Nur Pin setzen" variant="secondary" onPress={() => confirmPin(false)} />
            <Button label="Abbrechen" variant="ghost" onPress={() => setDraft(null)} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  meta: { color: colors.textDim, fontSize: 13, textAlign: 'center' },
  hint: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    padding: 12,
    borderRadius: radius.md,
  },
  hintText: { color: colors.text, flex: 1, fontSize: 14, fontWeight: '600' },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, gap: 8, borderWidth: 1, borderColor: colors.border },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { color: colors.textDim, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8 },
  notes: { color: colors.text, fontSize: 16, minHeight: 90, textAlignVertical: 'top', lineHeight: 22 },
  sectionLabel: { color: colors.textDim, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8 },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  pinDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  pinDotText: { color: colors.black, fontWeight: '900', fontSize: 12 },
  pinLabel: { flex: 1, color: colors.text, fontWeight: '600', fontSize: 15 },
  pinCount: { color: colors.textDim, fontSize: 13 },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    paddingBottom: 36,
    gap: 10,
  },
  sheetTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  sheetText: { color: colors.textDim, fontSize: 14, marginBottom: 4 },
  sheetInput: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 6,
  },
});
