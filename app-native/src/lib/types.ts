export type GeoPoint = { latitude: number; longitude: number };

/** Markierung auf einem Foto. Position relativ zum Bild (0–1). */
export type Pin = {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  /** Fotos, die zu dieser Stelle gehören (Detailaufnahmen). Diese können selbst wieder Pins haben = Unter-Pins. */
  photoIds: string[];
  createdAt: number;
};

export type Photo = {
  id: string;
  /** Dateiname im App-Dokumentenordner (nicht absoluter Pfad – der ändert sich bei iOS-Updates). */
  fileName: string;
  width: number;
  height: number;
  notes: string;
  pins: Pin[];
  /** Gesetzt, wenn das Foto eine Detailaufnahme zu einem Pin ist. */
  parent?: { photoId: string; pinId: string };
  createdAt: number;
};

export type Member = { id: string; name: string; contact: string; role: 'Bearbeiten' | 'Ansehen' };

export type Project = {
  id: string;
  name: string;
  address: string;
  location?: GeoPoint;
  createdAt: number;
  updatedAt: number;
  /** Hauptfotos des Projekts (oberste Ebene). Das erste ist das Titelbild. */
  rootPhotoIds: string[];
  photos: Record<string, Photo>;
  members: Member[];
};
