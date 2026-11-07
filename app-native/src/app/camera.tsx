import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type CameraType, type FlashMode, type LensInfo } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton, type IconName } from '../components/ui';
import { persistPhoto } from '../lib/files';
import { newId, useProjects } from '../lib/store';
import { colors } from '../lib/theme';

const FLASH_ORDER: FlashMode[] = ['off', 'auto', 'on'];
const FLASH_ICON: Record<string, IconName> = { off: 'flash-off', auto: 'flash-outline', on: 'flash' };

function lensLabel(lens: LensInfo): string {
  const t = lens.deviceType.toLowerCase();
  if (t.includes('ultrawide')) return '0.5×';
  if (t.includes('telephoto')) return 'Tele';
  if (t.includes('triple')) return 'Auto';
  if (t.includes('dualwide') || t.includes('dual')) return 'Dual';
  if (t.includes('wideangle')) return '1×';
  if (t.includes('lidar') || t.includes('truedepth')) return 'Tiefe';
  return lens.localizedName.replace(/^(Back|Front|Rück|Front)\s*/i, '').slice(0, 10) || lens.deviceType;
}

export default function Camera() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ projectId?: string; parentPhotoId?: string; parentPinId?: string }>();
  const { getProject, createProject, addPhoto } = useProjects();
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [torch, setTorch] = useState(false);
  const [grid, setGrid] = useState(true);
  const [zoom, setZoom] = useState(0);
  const [lenses, setLenses] = useState<LensInfo[]>([]);
  const [lens, setLens] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;

  const project = getProject(params.projectId);
  const parentPin = params.parentPhotoId
    ? project?.photos[params.parentPhotoId]?.pins.find((p) => p.id === params.parentPinId)
    : undefined;

  // Pinch-to-Zoom mit zwei Fingern (funktioniert auf iOS und Android)
  const pinch = useRef({ startDist: 0, startZoom: 0 });
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (e) => e.nativeEvent.touches.length === 2,
        onMoveShouldSetPanResponder: (e) => e.nativeEvent.touches.length === 2,
        onPanResponderMove: (e) => {
          const t = e.nativeEvent.touches;
          if (t.length !== 2) return;
          const dist = Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY);
          if (!pinch.current.startDist) {
            pinch.current = { startDist: dist, startZoom: zoomRef.current };
            return;
          }
          const next = pinch.current.startZoom + (dist - pinch.current.startDist) / 600;
          setZoom(Math.min(1, Math.max(0, next)));
        },
        onPanResponderRelease: () => {
          pinch.current.startDist = 0;
        },
        onPanResponderTerminate: () => {
          pinch.current.startDist = 0;
        },
      }),
    [],
  );

  if (!permission) return <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>;

  if (!permission.granted) {
    return (
      <View style={[styles.center, { padding: 32, gap: 16 }]}>
        <Ionicons name="camera" size={48} color={colors.accent} />
        <Text style={styles.permTitle}>Kamera-Zugriff nötig</Text>
        <Text style={styles.permText}>PinSnap braucht die Kamera, um Fotos für deine Projekte aufzunehmen.</Text>
        <Button label="Zugriff erlauben" onPress={requestPermission} style={{ alignSelf: 'stretch' }} />
        <Button label="Abbrechen" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const capture = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    flashAnim.setValue(1);
    Animated.timing(flashAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    try {
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.85, exif: false });
      const id = newId();
      const fileName = persistPhoto(pic.uri, id);
      const projectId = project?.id ?? createProject({ name: '', address: '' }).id;
      const parent =
        params.parentPhotoId && params.parentPinId ? { photoId: params.parentPhotoId, pinId: params.parentPinId } : undefined;
      addPhoto(projectId, { id, fileName, width: pic.width, height: pic.height }, parent);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace({ pathname: '/photo', params: { projectId, photoId: id, fresh: '1' } });
    } catch (e) {
      setBusy(false);
      console.warn(e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black }} {...responder.panHandlers}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
        enableTorch={torch}
        zoom={zoom}
        selectedLens={lens}
        onAvailableLensesChanged={(e) => setLenses(e.lenses ?? [])}
        onCameraReady={() => {
          cameraRef.current?.getAvailableLensesAsync().then(setLenses).catch(() => {});
        }}
      />

      {grid && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {[1, 2].map((i) => (
            <View key={`v${i}`} style={[styles.gridV, { left: `${(i * 100) / 3}%` }]} />
          ))}
          {[1, 2].map((i) => (
            <View key={`h${i}`} style={[styles.gridH, { top: `${(i * 100) / 3}%` }]} />
          ))}
        </View>
      )}

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.white, opacity: flashAnim }]} />

      {/* Obere Leiste */}
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <IconButton icon="close" bg="rgba(0,0,0,0.45)" onPress={() => router.back()} accessibilityLabel="Schließen" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <IconButton
            icon={FLASH_ICON[flash] ?? 'flash-off'}
            bg="rgba(0,0,0,0.45)"
            active={flash === 'on'}
            onPress={() => setFlash(FLASH_ORDER[(FLASH_ORDER.indexOf(flash) + 1) % FLASH_ORDER.length])}
            accessibilityLabel={`Blitz: ${flash}`}
          />
          <IconButton icon="flashlight" bg="rgba(0,0,0,0.45)" active={torch} onPress={() => setTorch((t) => !t)} accessibilityLabel="Taschenlampe" />
          <IconButton icon="grid-outline" bg="rgba(0,0,0,0.45)" active={grid} onPress={() => setGrid((g) => !g)} accessibilityLabel="Raster" />
        </View>
      </View>

      {/* Kontext: wohin wird das Foto gespeichert? */}
      <View style={[styles.context, { top: insets.top + 64 }]} pointerEvents="none">
        <Ionicons name={parentPin ? 'pin' : 'folder-open'} size={13} color={parentPin ? parentPin.color : colors.accent} />
        <Text style={styles.contextText} numberOfLines={1}>
          {project ? project.name : 'Neues Schnellprojekt'}
          {parentPin ? `  ›  ${parentPin.label}` : ''}
        </Text>
      </View>

      {/* Untere Leiste */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
        {lenses.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lensRow}>
            <LensChip label="Std" active={!lens} onPress={() => setLens(undefined)} />
            {lenses.map((l) => (
              <LensChip key={l.deviceType} label={lensLabel(l)} active={lens === l.deviceType} onPress={() => setLens(l.deviceType)} />
            ))}
          </ScrollView>
        )}

        <Pressable onPress={() => setZoom(0)} style={styles.zoomPill}>
          <Text style={styles.zoomText}>{zoom > 0.005 ? `Zoom ${Math.round(zoom * 100)} %` : 'Mit 2 Fingern zoomen'}</Text>
        </Pressable>

        <View style={styles.controls}>
          <View style={{ width: 52 }} />
          <Pressable onPress={capture} disabled={busy} style={({ pressed }) => [styles.shutter, pressed && { transform: [{ scale: 0.92 }] }]}>
            <View style={[styles.shutterInner, busy && { backgroundColor: colors.accent }]}>
              {busy && <ActivityIndicator color={colors.black} />}
            </View>
          </Pressable>
          <IconButton
            icon="camera-reverse"
            size={52}
            bg="rgba(255,255,255,0.15)"
            onPress={() => {
              setFacing((f) => (f === 'back' ? 'front' : 'back'));
              setLens(undefined);
              setLenses([]);
            }}
            accessibilityLabel="Kamera wechseln"
          />
        </View>
      </View>
    </View>
  );
}

function LensChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.lens, active && { backgroundColor: colors.accent }]}>
      <Text style={[styles.lensText, active && { color: colors.black }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  permTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  permText: { color: colors.textDim, textAlign: 'center', fontSize: 15, lineHeight: 21 },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.35)' },
  gridH: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.35)' },
  top: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' },
  context: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    maxWidth: '80%',
  },
  contextText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', gap: 14 },
  lensRow: { gap: 8, paddingHorizontal: 16 },
  lens: {
    minWidth: 44,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lensText: { color: colors.white, fontWeight: '700', fontSize: 12 },
  zoomPill: { backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 12, height: 26, borderRadius: 13, justifyContent: 'center' },
  zoomText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch', paddingHorizontal: 36 },
  shutter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
