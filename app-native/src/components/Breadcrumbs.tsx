import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { breadcrumb } from '../lib/store';
import { colors } from '../lib/theme';
import type { Project } from '../lib/types';

/** Zeigt den Pfad: Projekt › Pin › Unter-Pin … und erlaubt Sprünge zurück. */
export function Breadcrumbs({ project, photoId, pinLabel }: { project: Project; photoId: string; pinLabel?: string }) {
  const trail = breadcrumb(project, photoId);
  const items: { key: string; label: string; onPress?: () => void; color?: string }[] = [
    { key: 'p', label: project.name, onPress: () => router.dismissTo(`/project/${project.id}`) },
  ];
  trail.forEach(({ photo, pin }) => {
    if (pin && photo.parent) {
      const parentPhotoId = photo.parent.photoId;
      items.push({
        key: photo.id,
        label: pin.label,
        color: pin.color,
        onPress: () => router.push({ pathname: '/pin', params: { projectId: project.id, photoId: parentPhotoId, pinId: pin.id } }),
      });
    }
  });
  if (pinLabel) items.push({ key: 'current', label: pinLabel });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((it, i) => (
        <View key={it.key} style={styles.item}>
          {i > 0 && <Ionicons name="chevron-forward" size={12} color={colors.textFaint} />}
          <Pressable onPress={it.onPress} disabled={!it.onPress} style={styles.crumb}>
            {it.color && <View style={[styles.dot, { backgroundColor: it.color }]} />}
            <Text style={[styles.text, !it.onPress && { color: colors.text }]} numberOfLines={1}>
              {it.label}
            </Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  crumb: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { color: colors.textDim, fontWeight: '600', fontSize: 13, maxWidth: 160 },
});
