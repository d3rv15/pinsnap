import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Button, Chip, Empty, IconButton, SectionTitle } from '../components/ui';
import { photoUri } from '../lib/files';
import { countPins, coverPhoto, relativeTime, useProjects } from '../lib/store';
import { colors, radius } from '../lib/theme';
import type { Project } from '../lib/types';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_W = SCREEN_W * 0.78;
const PAGE = 6;

type Filter = 'all' | 'shared' | 'gps';

/** "Musterstr. 1, 12345 Berlin" → "Berlin" */
function cityOf(address: string): string {
  const last = address.split(',').pop()?.trim() ?? '';
  return last.replace(/^\d{4,5}\s*/, '').trim();
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { projects, ready } = useProjects();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [city, setCity] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  const sorted = useMemo(() => [...projects].sort((a, b) => b.updatedAt - a.updatedAt), [projects]);
  const cities = useMemo(
    () => Array.from(new Set(projects.map((p) => cityOf(p.address)).filter(Boolean))).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((p) => {
      if (filter === 'shared' && p.members.length === 0) return false;
      if (filter === 'gps' && !p.location) return false;
      if (city && cityOf(p.address) !== city) return false;
      if (q && !`${p.name} ${p.address}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sorted, query, filter, city]);

  const isFiltering = !!query.trim() || filter !== 'all' || !!city;
  const recent = sorted.slice(0, 5);
  const totalPhotos = projects.reduce((n, p) => n + Object.keys(p.photos).length, 0);
  const totalPins = projects.reduce((n, p) => n + countPins(p), 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Kopfbereich */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              Pin<Text style={{ color: colors.accent }}>Snap</Text>
            </Text>
            <Text style={styles.subtitle}>
              {projects.length} Projekte · {totalPhotos} Fotos · {totalPins} Pins
            </Text>
          </View>
          <IconButton icon="camera" onPress={() => router.push('/camera')} accessibilityLabel="Schnell-Foto" />
        </View>

        {/* Suche */}
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              setVisible(PAGE);
            }}
            placeholder="Projekt, Adresse oder Ort suchen"
            placeholderTextColor={colors.textFaint}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {!!query && <Ionicons name="close-circle" size={18} color={colors.textFaint} onPress={() => setQuery('')} />}
        </View>

        {/* Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Alle" selected={filter === 'all' && !city} onPress={() => { setFilter('all'); setCity(null); }} />
          <Chip label="Geteilt" icon="people" selected={filter === 'shared'} onPress={() => setFilter(filter === 'shared' ? 'all' : 'shared')} />
          <Chip label="Mit GPS" icon="navigate" selected={filter === 'gps'} onPress={() => setFilter(filter === 'gps' ? 'all' : 'gps')} />
          {cities.map((c) => (
            <Chip key={c} label={c} icon="location" selected={city === c} onPress={() => setCity(city === c ? null : c)} />
          ))}
        </ScrollView>

        {!ready ? null : projects.length === 0 ? (
          <View style={{ marginTop: 40 }}>
            <Empty
              icon="images"
              title="Noch keine Projekte"
              text={'Erstelle dein erstes Projekt, mach ein Foto\nund markiere Details mit Pins.'}
            />
          </View>
        ) : (
          <>
            {/* Zuletzt bearbeitet – große Karten */}
            {!isFiltering && (
              <View style={{ marginTop: 8 }}>
                <View style={{ paddingHorizontal: 20 }}>
                  <SectionTitle title="Zuletzt bearbeitet" />
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={HERO_W + 14}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                >
                  {recent.map((p) => (
                    <HeroCard key={p.id} project={p} />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Alle / Treffer */}
            <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
              <SectionTitle title={isFiltering ? `${filtered.length} Treffer` : 'Alle Projekte'} />
              {filtered.length === 0 ? (
                <Empty icon="search" title="Nichts gefunden" text="Passe Suche oder Filter an." />
              ) : (
                <View style={{ gap: 10 }}>
                  {filtered.slice(0, visible).map((p) => (
                    <ProjectRow key={p.id} project={p} />
                  ))}
                </View>
              )}
              {filtered.length > visible && (
                <Button
                  label={`Mehr anzeigen (${filtered.length - visible})`}
                  icon="chevron-down"
                  variant="secondary"
                  onPress={() => setVisible((v) => v + PAGE)}
                  style={{ marginTop: 14 }}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Haupt-Aktion */}
      <View style={[styles.fabWrap, { paddingBottom: insets.bottom + 16 }]} pointerEvents="box-none">
        <LinearGradient colors={['transparent', colors.bg]} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <Button label="Neues Projekt" icon="add" big onPress={() => router.push('/new')} style={{ alignSelf: 'stretch' }} />
      </View>
    </View>
  );
}

function HeroCard({ project }: { project: Project }) {
  const cover = coverPhoto(project);
  const pins = countPins(project);
  return (
    <Pressable
      onPress={() => router.push(`/project/${project.id}`)}
      style={({ pressed }) => [styles.hero, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      {cover ? (
        <Image source={{ uri: photoUri(cover.fileName) }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <LinearGradient colors={[colors.surfaceHigh, colors.surface]} style={StyleSheet.absoluteFill} />
      )}
      {!cover && (
        <View style={styles.heroPlaceholder}>
          <Ionicons name="camera-outline" size={40} color={colors.textFaint} />
        </View>
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroShade} />
      <View style={styles.heroTop}>
        <View style={styles.pill}>
          <Ionicons name="pin" size={12} color={colors.accent} />
          <Text style={styles.pillText}>{pins}</Text>
        </View>
        {project.members.length > 0 && (
          <View style={{ flexDirection: 'row' }}>
            {project.members.slice(0, 3).map((m, i) => (
              <Avatar key={m.id} name={m.name} index={i} size={26} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.heroBottom}>
        <Text style={styles.heroTitle} numberOfLines={1}>
          {project.name}
        </Text>
        <Text style={styles.heroMeta} numberOfLines={1}>
          {project.address || 'Keine Adresse'} · {relativeTime(project.updatedAt)}
        </Text>
      </View>
    </Pressable>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const cover = coverPhoto(project);
  const photos = Object.keys(project.photos).length;
  return (
    <Pressable
      onPress={() => router.push(`/project/${project.id}`)}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceHigh }]}
    >
      <View style={styles.thumb}>
        {cover ? (
          <Image source={{ uri: photoUri(cover.fileName) }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <Ionicons name="image-outline" size={22} color={colors.textFaint} />
        )}
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {project.name}
        </Text>
        <Text style={styles.rowMeta} numberOfLines={1}>
          {project.address || 'Keine Adresse'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 2 }}>
          <Meta icon="images-outline" text={`${photos}`} />
          <Meta icon="pin-outline" text={`${countPins(project)}`} />
          {project.members.length > 0 && <Meta icon="people-outline" text={`${project.members.length}`} color={colors.teal} />}
          {project.location && <Meta icon="navigate-outline" text="GPS" />}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
    </Pressable>
  );
}

function Meta({ icon, text, color = colors.textDim }: { icon: keyof typeof Ionicons.glyphMap; text: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={{ color, fontSize: 12, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: colors.textDim, fontSize: 13, marginTop: 2, fontWeight: '500' },
  search: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  chips: { paddingHorizontal: 20, gap: 8, paddingVertical: 14 },
  hero: {
    width: HERO_W,
    height: HERO_W * 1.05,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroPlaceholder: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  heroShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  heroBottom: { position: 'absolute', left: 18, right: 18, bottom: 18 },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  heroMeta: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(11,12,16,0.7)',
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 13,
  },
  pillText: { color: colors.white, fontWeight: '700', fontSize: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  rowMeta: { color: colors.textDim, fontSize: 13 },
  fabWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 40 },
});
