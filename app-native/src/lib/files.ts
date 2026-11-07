import { Directory, File, Paths } from 'expo-file-system';

const photoDir = () => new Directory(Paths.document, 'photos');

/** Kopiert ein frisch aufgenommenes Foto dauerhaft in den App-Ordner und gibt den Dateinamen zurück. */
export function persistPhoto(tempUri: string, id: string): string {
  const dir = photoDir();
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  const fileName = `${id}.jpg`;
  const target = new File(dir, fileName);
  if (target.exists) target.delete();
  new File(tempUri).copySync(target);
  return fileName;
}

export function photoUri(fileName: string): string {
  return new File(photoDir(), fileName).uri;
}

export function deletePhotoFile(fileName: string) {
  try {
    const f = new File(photoDir(), fileName);
    if (f.exists) f.delete();
  } catch {
    // Datei bereits weg – ignorieren
  }
}
