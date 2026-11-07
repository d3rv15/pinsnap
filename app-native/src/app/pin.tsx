import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PinnedImage } from '../components/PinnedImage';
import { Button, Empty, IconButton } from '../components/ui';
import { photoUri } from '../lib/files';
import { useProjects } from '../lib/store';
import { colors, radius } from '../lib/theme';

const TILE = (Dimensions.get('window').width - 16 * 2 - 10) / 2;

export default function PinScreen() {
  const insets = useSafeAreaInsets();
  const { projectId, photoId, pinId } = useLocalSearchParams<{ projectId: string; photoId: string; pinId: string }>();
  const { getProject, updatePin, deletePin } = useProjects();
  const project = getProject(projectId);
  const host = project?.photos[photoId];
  const pin = host?.pins.find((p) => p.id === pinId);
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(pin?.label ?? '');

  if (!project || !host || !pin) {
    return <Empty icon="pin-outline" title="Pin nicht gefunden" text="Er wurde vielleicht gelöscht." />;
  }

  const index = host.pins.findIndex((p) => p.id === pin.id) + 1;
  const detailPhotos = pin.photoIds.map((id) => project.photos[id]).filter(Boolean);

  const remove = () =>
    Alert.alert(`„${pin.label}“ löschen?`, 'Alle zugehörigen Detailfotos und Unter-Pins werden ebenfalls gelöscht.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          router.back();
          setTimeout(() => deletePin(projectId, photoId, pinId), 300);
        },
      },
    ]);

  const shoot = () => router.push({ pathname: '/camera', params: { projectId, parentPhotoId: photoId, parentPinId: pinId } });

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: pin.label,
          headerRight: () => <IconButton icon="trash-outline" size={36} tint={colors.danger} bg="transparent" onPress={remove} />,
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 130, gap: 18 }}>
        <Breadcrumbs project={project} photoId={photoId} pinLabel={pin.label} />

        {/* Kopf mit Pin-Name */}
        <View style={styles.head}>
          <View style={[styles.bigDot, { backgroundColor: pin.color }]}>
            <Text style={styles.bigDotText}>{index}</Text>
          </View>
          {editing ? (
            <TextInput
              value={label}
              onChangeText={setLabel}
              autoFocus
              style={styles.titleInput}
              onBlur={() => {
                updatePin(projectId, photoId, pinId, { label: label.trim() || pin.label });
                setEditing(false);
              }}
              onSubmitEditing={() => {
                updatePin(projectId, photoId, pinId, { label: label.trim() || pin.label });
                setEditing(false);
              }}
            />
          ) : (
            <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }} onPress={() => setEditing(true)}>
              <Text style={styles.title} numberOfLines={2}>
                {pin.label}
              </Text>
              <Ionicons name="pencil" size={16} color={colors.textFaint} />
            </Pressable>
          )}
        </View>

        {/* Position auf dem Ausgangsfoto */}
        <Pressable onPress={() => router.push({ pathname: '/photo', params: { projectId, photoId } })}>
          <PinnedImage photo={host} highlightPinId={pin.id} showLabels={false} maxHeight={220} />
          <Text style={styles.caption}>Position auf dem Ausgangsfoto · antippen zum Öffnen</Text>
        </Pressable>

        {/* Detailfotos */}
        <Text style={styles.sectionLabel}>
          {detailPhotos.length} {detailPhotos.length === 1 ? 'Detailfoto' : 'Detailfotos'}
        </Text>
        {detailPhotos.length === 0 ? (
          <Empty icon="camera-outline" title="Noch keine Detailfotos" text="Fotografiere diese Stelle aus der Nähe. Auf Detailfotos kannst du wieder Unter-Pins setzen." />
        ) : (
          <View style={styles.grid}>
            {detailPhotos.map((ph) => (
              <Pressable
                key={ph.id}
                onPress={() => router.push({ pathname: '/photo', params: { projectId, photoId: ph.id } })}
                style={({ pressed }) => [styles.tile, pressed && { opacity: 0.8 }]}
              >
                <Image source={{ uri: photoUri(ph.fileName) }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <View style={styles.tileInfo}>
                  {ph.pins.length > 0 && (
                    <View style={styles.tag}>
                      <Ionicons name="pin" size={11} color={colors.accent} />
                      <Text style={styles.tagText}>{ph.pins.length} Unter-Pins</Text>
                    </View>
                  )}
                  {!!ph.notes && (
                    <Text numberOfLines={2} style={styles.tileNote}>
                      {ph.notes}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <Button label="Foto an dieser Stelle aufnehmen" icon="camera" big onPress={shoot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bigDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigDotText: { color: colors.black, fontWeight: '900', fontSize: 18 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', letterSpacing: -0.5, flexShrink: 1 },
  titleInput: {
    flex: 1,
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    paddingVertical: 4,
  },
  caption: { color: colors.textFaint, fontSize: 12, textAlign: 'center', marginTop: 8 },
  sectionLabel: { color: colors.textDim, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: TILE, height: TILE * 1.25, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surface },
  tileInfo: { position: 'absolute', left: 8, right: 8, bottom: 8, gap: 6 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(11,12,16,0.8)',
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 11,
  },
  tagText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  tileNote: {
    color: colors.white,
    fontSize: 12,
    backgroundColor: 'rgba(11,12,16,0.8)',
    padding: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
