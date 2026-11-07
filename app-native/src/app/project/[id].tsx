import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinnedImage } from '../../components/PinnedImage';
import { Avatar, Button, Empty, IconButton } from '../../components/ui';
import { photoUri } from '../../lib/files';
import { countPins, relativeTime, useProjects } from '../../lib/store';
import { colors, radius } from '../../lib/theme';
import type { Photo, Pin, Project } from '../../lib/types';

export default function ProjectScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProject, updateProject, deleteProject } = useProjects();
  const project = getProject(id);
  const [active, setActive] = useState(0);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project?.name ?? '');
  const [address, setAddress] = useState(project?.address ?? '');

  if (!project) return <Empty icon="folder-open-outline" title="Projekt nicht gefunden" text="Es wurde vielleicht gelöscht." />;

  const roots = project.rootPhotoIds.map((pid) => project.photos[pid]).filter(Boolean);
  const current = roots[Math.min(active, roots.length - 1)];
  const allPins = collectPins(project);

  const openMaps = () => {
    const { location, address: addr } = project;
    const q = location ? `${location.latitude},${location.longitude}` : encodeURIComponent(addr);
    const url = Platform.OS === 'ios' ? `https://maps.apple.com/?q=${q}` : `geo:0,0?q=${q}`;
    Linking.openURL(url).catch(() => {});
  };

  const menu = () =>
    Alert.alert(project.name, undefined, [
      { text: 'Name & Adresse bearbeiten', onPress: () => setEditing(true) },
      {
        text: 'Projekt löschen',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Projekt wirklich löschen?', 'Alle Fotos, Pins und Notizen werden entfernt.', [
            { text: 'Abbrechen', style: 'cancel' },
            {
              text: 'Löschen',
              style: 'destructive',
              onPress: () => {
                router.back();
                setTimeout(() => deleteProject(project.id), 300);
              },
            },
          ]),
      },
      { text: 'Abbrechen', style: 'cancel' },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconButton icon="share-social-outline" size={38} onPress={() => router.push({ pathname: '/share', params: { projectId: project.id } })} />
              <IconButton icon="ellipsis-horizontal" size={38} onPress={menu} />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        {/* Titel */}
        <View style={styles.headBlock}>
          {editing ? (
            <View style={{ gap: 8 }}>
              <TextInput value={name} onChangeText={setName} style={styles.editName} placeholder="Projektname" placeholderTextColor={colors.textFaint} />
              <TextInput value={address} onChangeText={setAddress} style={styles.editAddr} placeholder="Adresse" placeholderTextColor={colors.textFaint} />
              <Button
                label="Speichern"
                icon="checkmark"
                onPress={() => {
                  updateProject(project.id, { name: name.trim() || project.name, address: address.trim() });
                  setEditing(false);
                }}
              />
            </View>
          ) : (
            <>
              <Text style={styles.name}>{project.name}</Text>
              <Pressable onPress={project.address || project.location ? openMaps : () => setEditing(true)} style={styles.addrRow}>
                <Ionicons name={project.location ? 'navigate' : 'location-outline'} size={14} color={colors.teal} />
                <Text style={styles.addr} numberOfLines={1}>
                  {project.address || (project.location ? 'GPS-Standort' : 'Adresse hinzufügen')}
                </Text>
              </Pressable>
            </>
          )}

          <View style={styles.stats}>
            <Stat value={Object.keys(project.photos).length} label="Fotos" />
            <Stat value={countPins(project)} label="Pins" />
            <Pressable style={styles.team} onPress={() => router.push({ pathname: '/share', params: { projectId: project.id } })}>
              {project.members.length > 0 ? (
                <View style={{ flexDirection: 'row' }}>
                  {project.members.slice(0, 4).map((m, i) => (
                    <Avatar key={m.id} name={m.name} index={i} size={30} />
                  ))}
                </View>
              ) : (
                <View style={styles.addTeam}>
                  <Ionicons name="person-add" size={14} color={colors.text} />
                  <Text style={styles.addTeamText}>Team</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Hauptfoto mit Pins */}
        <View style={{ paddingHorizontal: 16 }}>
          {current ? (
            <>
              <PinnedImage
                photo={current}
                onPressPin={(pin) => router.push({ pathname: '/pin', params: { projectId: project.id, photoId: current.id, pinId: pin.id } })}
              />
              <View style={styles.underImage}>
                <Text style={styles.underText}>
                  {current.pins.length > 0 ? 'Tippe auf einen Pin, um die Detailfotos zu sehen' : 'Noch keine Pins auf diesem Foto'}
                </Text>
                <Pressable onPress={() => router.push({ pathname: '/photo', params: { projectId: project.id, photoId: current.id } })} style={styles.editLink}>
                  <Ionicons name="create-outline" size={14} color={colors.accent} />
                  <Text style={styles.editLinkText}>Pins & Notizen</Text>
                </Pressable>
              </View>
              {!!current.notes && (
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>{current.notes}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noPhoto}>
              <Empty icon="camera-outline" title="Noch kein Foto" text="Mach das erste Foto – es wird zum Titelbild des Projekts." />
            </View>
          )}
        </View>

        {/* Weitere Hauptfotos */}
        {roots.length > 1 && (
          <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionLabel, { paddingHorizontal: 16 }]}>Hauptfotos ({roots.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
              {roots.map((ph, i) => (
                <Pressable key={ph.id} onPress={() => setActive(i)} style={[styles.rootThumb, i === active && styles.rootThumbActive]}>
                  <Image source={{ uri: photoUri(ph.fileName) }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  {ph.pins.length > 0 && (
                    <View style={styles.thumbBadge}>
                      <Text style={styles.thumbBadgeText}>{ph.pins.length}</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Alle Pins im Projekt */}
        {allPins.length > 0 && (
          <View style={{ marginTop: 28, paddingHorizontal: 16, gap: 8 }}>
            <Text style={styles.sectionLabel}>Alle Markierungen</Text>
            {allPins.map(({ pin, photo, depth }) => {
              const first = pin.photoIds[0] ? project.photos[pin.photoIds[0]] : undefined;
              return (
                <Pressable
                  key={pin.id}
                  onPress={() => router.push({ pathname: '/pin', params: { projectId: project.id, photoId: photo.id, pinId: pin.id } })}
                  style={({ pressed }) => [styles.pinRow, { marginLeft: depth * 18 }, pressed && { backgroundColor: colors.surfaceHigh }]}
                >
                  {depth > 0 && <Ionicons name="return-down-forward" size={14} color={colors.textFaint} />}
                  <View style={[styles.pinDot, { backgroundColor: pin.color }]} />
                  <Text style={styles.pinLabel} numberOfLines={1}>
                    {pin.label}
                  </Text>
                  {first ? (
                    <Image source={{ uri: photoUri(first.fileName) }} style={styles.pinThumb} contentFit="cover" />
                  ) : (
                    <Text style={styles.pinEmpty}>kein Foto</Text>
                  )}
                  <Text style={styles.pinCount}>{pin.photoIds.length}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={styles.footer}>Zuletzt geändert {relativeTime(project.updatedAt)}</Text>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label={roots.length ? 'Weiteres Hauptfoto' : 'Erstes Foto aufnehmen'}
          icon="camera"
          big
          onPress={() => router.push({ pathname: '/camera', params: { projectId: project.id } })}
        />
      </View>
    </View>
  );
}

/** Alle Pins des Projekts als Baum (Pin → Detailfoto → Unter-Pin …) in Lesereihenfolge. */
function collectPins(project: Project) {
  const out: { pin: Pin; photo: Photo; depth: number }[] = [];
  const seen = new Set<string>();
  const walk = (photo: Photo, depth: number) => {
    if (seen.has(photo.id)) return;
    seen.add(photo.id);
    photo.pins.forEach((pin) => {
      out.push({ pin, photo, depth });
      pin.photoIds.forEach((pid) => project.photos[pid] && walk(project.photos[pid], depth + 1));
    });
  };
  project.rootPhotoIds.forEach((pid) => project.photos[pid] && walk(project.photos[pid], 0));
  return out;
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headBlock: { paddingHorizontal: 16, paddingBottom: 16, gap: 6 },
  name: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addr: { color: colors.teal, fontSize: 14, fontWeight: '600', flexShrink: 1 },
  editName: { color: colors.text, fontSize: 24, fontWeight: '800', borderBottomWidth: 2, borderBottomColor: colors.accent, paddingVertical: 4 },
  editAddr: { color: colors.text, fontSize: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 6, marginBottom: 6 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: { backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 16, minWidth: 80 },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textDim, fontSize: 12 },
  team: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  addTeam: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addTeamText: { color: colors.text, fontWeight: '700' },
  underImage: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  underText: { color: colors.textDim, fontSize: 12, flex: 1 },
  editLink: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 },
  editLinkText: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  noteBox: { marginTop: 10, backgroundColor: colors.surface, padding: 12, borderRadius: radius.md, borderLeftWidth: 3, borderLeftColor: colors.accent },
  noteText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  noPhoto: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  sectionLabel: { color: colors.textDim, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  rootThumb: { width: 72, height: 96, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent' },
  rootThumbActive: { borderColor: colors.accent },
  thumbBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: colors.accent, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  thumbBadgeText: { color: colors.black, fontWeight: '800', fontSize: 10 },
  pinRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: radius.md, backgroundColor: colors.surface },
  pinDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.white },
  pinLabel: { flex: 1, color: colors.text, fontWeight: '600', fontSize: 15 },
  pinThumb: { width: 36, height: 36, borderRadius: 8 },
  pinEmpty: { color: colors.textFaint, fontSize: 12 },
  pinCount: { color: colors.textDim, fontSize: 13, fontWeight: '700', minWidth: 14, textAlign: 'right' },
  footer: { color: colors.textFaint, fontSize: 12, textAlign: 'center', marginTop: 28 },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 12, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
});
