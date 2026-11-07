import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { photoUri } from '../lib/files';
import { colors, radius } from '../lib/theme';
import type { Photo, Pin } from '../lib/types';

type Props = {
  photo: Photo;
  /** Wenn gesetzt, setzt ein Tipp auf das Bild einen neuen Pin an dieser Stelle. */
  onPlace?: (x: number, y: number) => void;
  onPressPin?: (pin: Pin) => void;
  highlightPinId?: string;
  showLabels?: boolean;
  maxHeight?: number;
  rounded?: boolean;
};

/**
 * Zeigt ein Foto in exaktem Seitenverhältnis an und legt die Pins (relative Koordinaten 0–1) darüber.
 * Durch das feste Seitenverhältnis stimmen die Pin-Positionen auf jedem Gerät und in jeder Größe.
 */
export function PinnedImage({ photo, onPlace, onPressPin, highlightPinId, showLabels = true, maxHeight, rounded = true }: Props) {
  const aspect = photo.width && photo.height ? photo.width / photo.height : 3 / 4;
  const size = useRef({ w: 1, h: 1 });

  const handlePress = (e: GestureResponderEvent) => {
    if (!onPlace) return;
    const { locationX, locationY } = e.nativeEvent;
    const x = Math.min(1, Math.max(0, locationX / size.current.w));
    const y = Math.min(1, Math.max(0, locationY / size.current.h));
    onPlace(x, y);
  };

  return (
    <View style={[{ alignItems: 'center' }, maxHeight ? { maxHeight } : null]}>
      <Pressable
        onPress={handlePress}
        disabled={!onPlace}
        onLayout={(e) => {
          size.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height };
        }}
        style={[
          { width: '100%', aspectRatio: aspect, overflow: 'hidden', backgroundColor: colors.surface },
          maxHeight ? { maxHeight, width: undefined, height: maxHeight } : null,
          rounded && { borderRadius: radius.lg },
        ]}
      >
        <Image source={{ uri: photoUri(photo.fileName) }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
        {onPlace && <View pointerEvents="none" style={styles.placeOverlay} />}
        {photo.pins.map((pin, i) => (
          <PinMarker
            key={pin.id}
            pin={pin}
            index={i + 1}
            showLabel={showLabels}
            highlighted={highlightPinId === pin.id}
            dimmed={!!highlightPinId && highlightPinId !== pin.id}
            onPress={onPressPin && !onPlace ? () => onPressPin(pin) : undefined}
          />
        ))}
      </Pressable>
    </View>
  );
}

function PinMarker({
  pin,
  index,
  showLabel,
  highlighted,
  dimmed,
  onPress,
}: {
  pin: Pin;
  index: number;
  showLabel: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onPress?: () => void;
}) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const SIZE = highlighted ? 34 : 28;
  return (
    <View
      pointerEvents={onPress ? 'box-none' : 'none'}
      style={{
        position: 'absolute',
        left: `${pin.x * 100}%`,
        top: `${pin.y * 100}%`,
        width: 0,
        height: 0,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: dimmed ? 0.35 : 1,
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: pin.color,
          opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
          transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
        }}
      />
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        hitSlop={12}
        style={{
          position: 'absolute',
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: pin.color,
          borderWidth: 3,
          borderColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.black,
          shadowOpacity: 0.5,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 6,
        }}
      >
        <Text style={{ color: colors.black, fontWeight: '900', fontSize: 12 }}>{index}</Text>
        {pin.photoIds.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pin.photoIds.length}</Text>
          </View>
        )}
      </Pressable>
      {showLabel && (
        <View pointerEvents="none" style={[styles.label, { top: SIZE / 2 + 6 }]}>
          <Text numberOfLines={1} style={styles.labelText}>
            {pin.label}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeOverlay: {
    ...StyleSheet.absoluteFill,
    borderWidth: 3,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  label: {
    position: 'absolute',
    width: 140,
    alignItems: 'center',
  },
  labelText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(11,12,16,0.78)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
    maxWidth: 140,
  },
});
