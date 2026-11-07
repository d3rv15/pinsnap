import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { deletePhotoFile } from './files';
import { pinColors } from './theme';
import type { GeoPoint, Member, Photo, Pin, Project } from './types';

const STORAGE_KEY = 'pinsnap.projects.v1';

export const newId = () => Crypto.randomUUID();

type NewPhoto = { fileName: string; width: number; height: number; id: string };

type Store = {
  ready: boolean;
  projects: Project[];
  getProject: (id: string | undefined) => Project | undefined;
  createProject: (input: { name: string; address: string; location?: GeoPoint }) => Project;
  updateProject: (id: string, patch: Partial<Pick<Project, 'name' | 'address' | 'location'>>) => void;
  deleteProject: (id: string) => void;
  /** Hängt ein Foto an. Ohne `parent` wird es Hauptfoto, mit `parent` Detailfoto eines Pins. */
  addPhoto: (projectId: string, photo: NewPhoto, parent?: { photoId: string; pinId: string }) => void;
  updatePhotoNotes: (projectId: string, photoId: string, notes: string) => void;
  deletePhoto: (projectId: string, photoId: string) => void;
  addPin: (projectId: string, photoId: string, input: { x: number; y: number; label: string }) => Pin;
  updatePin: (projectId: string, photoId: string, pinId: string, patch: Partial<Pick<Pin, 'label' | 'x' | 'y'>>) => void;
  deletePin: (projectId: string, photoId: string, pinId: string) => void;
  addMember: (projectId: string, member: Omit<Member, 'id'>) => void;
  removeMember: (projectId: string, memberId: string) => void;
};

const Ctx = createContext<Store | null>(null);

/** Sammelt rekursiv alle Fotos unterhalb eines Fotos (über dessen Pins). */
function collectDescendants(project: Project, photoId: string, acc: Set<string>) {
  if (acc.has(photoId)) return;
  acc.add(photoId);
  const photo = project.photos[photoId];
  photo?.pins.forEach((pin) => pin.photoIds.forEach((pid) => collectDescendants(project, pid, acc)));
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setProjects(JSON.parse(raw) as Project[]);
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects)).catch(() => {});
  }, [projects]);

  const mutate = useCallback((projectId: string, fn: (p: Project) => Project) => {
    setProjects((list) => list.map((p) => (p.id === projectId ? { ...fn(p), updatedAt: Date.now() } : p)));
  }, []);

  const mutatePhoto = useCallback(
    (projectId: string, photoId: string, fn: (ph: Photo) => Photo) =>
      mutate(projectId, (p) => {
        const ph = p.photos[photoId];
        if (!ph) return p;
        return { ...p, photos: { ...p.photos, [photoId]: fn(ph) } };
      }),
    [mutate],
  );

  const projectsRef = useRef(projects);
  projectsRef.current = projects;

  const store = useMemo<Store>(
    () => ({
      ready,
      projects,
      getProject: (id) => projects.find((p) => p.id === id),

      createProject: ({ name, address, location }) => {
        const now = Date.now();
        const project: Project = {
          id: newId(),
          name: name.trim() || `Projekt ${new Date(now).toLocaleDateString('de-DE')}`,
          address: address.trim(),
          location,
          createdAt: now,
          updatedAt: now,
          rootPhotoIds: [],
          photos: {},
          members: [],
        };
        setProjects((list) => [project, ...list]);
        return project;
      },

      updateProject: (id, patch) => mutate(id, (p) => ({ ...p, ...patch })),

      deleteProject: (id) => {
        const project = projectsRef.current.find((p) => p.id === id);
        Object.values(project?.photos ?? {}).forEach((ph) => deletePhotoFile(ph.fileName));
        setProjects((list) => list.filter((p) => p.id !== id));
      },

      addPhoto: (projectId, input, parent) =>
        mutate(projectId, (p) => {
          const photo: Photo = { ...input, notes: '', pins: [], parent, createdAt: Date.now() };
          const photos = { ...p.photos, [photo.id]: photo };
          if (parent) {
            const host = photos[parent.photoId];
            if (host) {
              photos[parent.photoId] = {
                ...host,
                pins: host.pins.map((pin) =>
                  pin.id === parent.pinId ? { ...pin, photoIds: [...pin.photoIds, photo.id] } : pin,
                ),
              };
            }
            return { ...p, photos };
          }
          return { ...p, photos, rootPhotoIds: [...p.rootPhotoIds, photo.id] };
        }),

      updatePhotoNotes: (projectId, photoId, notes) => mutatePhoto(projectId, photoId, (ph) => ({ ...ph, notes })),

      deletePhoto: (projectId, photoId) =>
        mutate(projectId, (p) => {
          const remove = new Set<string>();
          collectDescendants(p, photoId, remove);
          const photos: Record<string, Photo> = {};
          for (const [id, ph] of Object.entries(p.photos)) {
            if (remove.has(id)) {
              deletePhotoFile(ph.fileName);
              continue;
            }
            photos[id] = {
              ...ph,
              pins: ph.pins.map((pin) => ({ ...pin, photoIds: pin.photoIds.filter((x) => !remove.has(x)) })),
            };
          }
          return { ...p, photos, rootPhotoIds: p.rootPhotoIds.filter((x) => !remove.has(x)) };
        }),

      addPin: (projectId, photoId, { x, y, label }) => {
        const project = projectsRef.current.find((p) => p.id === projectId);
        const count = project?.photos[photoId]?.pins.length ?? 0;
        const pin: Pin = {
          id: newId(),
          x,
          y,
          label: label.trim() || `Pin ${count + 1}`,
          color: pinColors[count % pinColors.length],
          photoIds: [],
          createdAt: Date.now(),
        };
        mutatePhoto(projectId, photoId, (ph) => ({ ...ph, pins: [...ph.pins, pin] }));
        return pin;
      },

      updatePin: (projectId, photoId, pinId, patch) =>
        mutatePhoto(projectId, photoId, (ph) => ({
          ...ph,
          pins: ph.pins.map((pin) => (pin.id === pinId ? { ...pin, ...patch } : pin)),
        })),

      deletePin: (projectId, photoId, pinId) =>
        mutate(projectId, (p) => {
          const pin = p.photos[photoId]?.pins.find((x) => x.id === pinId);
          const remove = new Set<string>();
          pin?.photoIds.forEach((pid) => collectDescendants(p, pid, remove));
          const photos: Record<string, Photo> = {};
          for (const [id, ph] of Object.entries(p.photos)) {
            if (remove.has(id)) {
              deletePhotoFile(ph.fileName);
              continue;
            }
            photos[id] = id === photoId ? { ...ph, pins: ph.pins.filter((x) => x.id !== pinId) } : ph;
          }
          return { ...p, photos };
        }),

      addMember: (projectId, member) =>
        mutate(projectId, (p) => ({ ...p, members: [...p.members, { ...member, id: newId() }] })),

      removeMember: (projectId, memberId) =>
        mutate(projectId, (p) => ({ ...p, members: p.members.filter((m) => m.id !== memberId) })),
    }),
    [projects, ready, mutate, mutatePhoto],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useProjects() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProjects muss innerhalb von ProjectsProvider verwendet werden');
  return ctx;
}

/** Titelbild = erstes Hauptfoto. */
export function coverPhoto(project: Project): Photo | undefined {
  const id = project.rootPhotoIds[0];
  return id ? project.photos[id] : undefined;
}

export function countPins(project: Project): number {
  return Object.values(project.photos).reduce((n, ph) => n + ph.pins.length, 0);
}

/** Pfad von der obersten Ebene bis zu einem Foto: [{photo, pin}] – für die Brotkrumen-Navigation. */
export function breadcrumb(project: Project, photoId: string): { photo: Photo; pin?: Pin }[] {
  const trail: { photo: Photo; pin?: Pin }[] = [];
  let current = project.photos[photoId];
  const seen = new Set<string>();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    const parent: Photo | undefined = current.parent ? project.photos[current.parent.photoId] : undefined;
    const pin = parent?.pins.find((p) => p.id === current!.parent!.pinId);
    trail.unshift({ photo: current, pin });
    current = parent as Photo;
  }
  return trail;
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.round(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.round(h / 24);
  if (d < 7) return d === 1 ? 'gestern' : `vor ${d} Tagen`;
  return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}
