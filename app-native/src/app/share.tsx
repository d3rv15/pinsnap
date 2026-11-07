import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, Button, Empty } from '../components/ui';
import { photoUri } from '../lib/files';
import { countPins, coverPhoto, useProjects } from '../lib/store';
import { colors, radius } from '../lib/theme';
import type { Member, Project } from '../lib/types';

/** Textbericht mit allen Pins und Notizen – zum Versenden per Mail, WhatsApp, Teams … */
function buildReport(project: Project): string {
  const lines: string[] = [`📁 ${project.name}`];
  if (project.address) lines.push(`📍 ${project.address}`);
  if (project.location) lines.push(`🗺️ https://maps.google.com/?q=${project.location.latitude},${project.location.longitude}`);
  lines.push(`${Object.keys(project.photos).length} Fotos · ${countPins(project)} Pins`, '');
  const walk = (photoId: string, depth: number) => {
    const ph = project.photos[photoId];
    if (!ph) return;
    if (ph.notes) lines.push(`${'  '.repeat(depth)}📝 ${ph.notes}`);
    ph.pins.forEach((pin, i) => {
      lines.push(`${'  '.repeat(depth)}📌 ${i + 1}. ${pin.label} (${pin.photoIds.length} Fotos)`);
      pin.photoIds.forEach((pid) => walk(pid, depth + 1));
    });
  };
  project.rootPhotoIds.forEach((pid, i) => {
    lines.push(`— Hauptfoto ${i + 1} —`);
    walk(pid, 0);
  });
  lines.push('', 'Erstellt mit PinSnap');
  return lines.join('\n');
}

export default function ShareScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { getProject, addMember, removeMember } = useProjects();
  const project = getProject(projectId);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState<Member['role']>('Bearbeiten');

  if (!project) return <Empty icon="share-outline" title="Projekt nicht gefunden" text="" />;

  const invite = async () => {
    if (!name.trim()) {
      Alert.alert('Name fehlt', 'Wie heißt dein Kollege oder deine Kollegin?');
      return;
    }
    addMember(project.id, { name: name.trim(), contact: contact.trim(), role });
    await Share.share({
      message: `Hallo ${name.trim()}, ich habe dich zum Projekt „${project.name}“ in PinSnap eingeladen (${role}).\n\n${buildReport(project)}`,
    }).catch(() => {});
    setName('');
    setContact('');
  };

  const shareReport = () => Share.share({ message: buildReport(project), title: project.name }).catch(() => {});

  const shareCover = async () => {
    const cover = coverPhoto(project);
    if (!cover) return Alert.alert('Kein Foto', 'Das Projekt hat noch kein Foto.');
    if (!(await Sharing.isAvailableAsync())) return Alert.alert('Teilen nicht verfügbar');
    await Sharing.shareAsync(photoUri(cover.fileName), { mimeType: 'image/jpeg', dialogTitle: project.name }).catch(() => {});
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 22 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <QuickAction icon="document-text-outline" label="Bericht senden" onPress={shareReport} />
          <QuickAction icon="image-outline" label="Titelbild senden" onPress={shareCover} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kollegen einladen</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={colors.textFaint} style={styles.input} />
          <TextInput
            value={contact}
            onChangeText={setContact}
            placeholder="E-Mail oder Telefon (optional)"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.roles}>
            {(['Bearbeiten', 'Ansehen'] as const).map((r) => (
              <Pressable key={r} onPress={() => setRole(r)} style={[styles.role, role === r && styles.roleActive]}>
                <Ionicons name={r === 'Bearbeiten' ? 'create-outline' : 'eye-outline'} size={16} color={role === r ? colors.black : colors.textDim} />
                <Text style={[styles.roleText, role === r && { color: colors.black }]}>Darf {r.toLowerCase()}</Text>
              </Pressable>
            ))}
          </View>
          <Button label="Einladen & senden" icon="paper-plane" onPress={invite} />
        </View>

        <View style={{ gap: 10 }}>
          <Text style={styles.sectionLabel}>Team ({project.members.length})</Text>
          {project.members.length === 0 ? (
            <Text style={styles.muted}>Noch niemand eingeladen.</Text>
          ) : (
            project.members.map((m, i) => (
              <View key={m.id} style={styles.member}>
                <Avatar name={m.name} index={i} size={38} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.muted}>
                    {m.role}
                    {m.contact ? ` · ${m.contact}` : ''}
                  </Text>
                </View>
                <Pressable hitSlop={10} onPress={() => removeMember(project.id, m.id)}>
                  <Ionicons name="close-circle" size={22} color={colors.textFaint} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        <View style={styles.info}>
          <Ionicons name="cloud-outline" size={18} color={colors.teal} />
          <Text style={styles.infoText}>
            Die Team-Liste und der Bericht funktionieren schon jetzt. Für Live-Bearbeitung auf mehreren Handys gleichzeitig wird
            noch ein Cloud-Backend (z. B. Firebase oder Supabase) angebunden – siehe README.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function QuickAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quick, pressed && { opacity: 0.8 }]}>
      <Ionicons name={icon} size={24} color={colors.accent} />
      <Text style={styles.quickText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quick: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.border },
  quickText: { color: colors.text, fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  input: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 16,
  },
  roles: { flexDirection: 'row', gap: 8 },
  role: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  roleText: { color: colors.textDim, fontWeight: '700', fontSize: 13 },
  sectionLabel: { color: colors.textDim, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8 },
  member: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, padding: 12, borderRadius: radius.md },
  memberName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  muted: { color: colors.textDim, fontSize: 13 },
  info: { flexDirection: 'row', gap: 10, backgroundColor: colors.tealSoft, padding: 14, borderRadius: radius.md },
  infoText: { color: colors.text, fontSize: 13, lineHeight: 19, flex: 1 },
});
