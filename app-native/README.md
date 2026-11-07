# PinSnap – Kamera-App mit Pins (Android & iPhone)

Fotos für Projekte aufnehmen, Stellen im Bild mit **Pins** markieren und an jedem Pin weitere Detailfotos
hinzufügen – beliebig tief verschachtelt (Unter-Pins).

## Funktionen

| Bereich | Was die App kann |
|---|---|
| **Startseite** | Zuletzt bearbeitete Projekte als große Bildkarten, Liste aller Projekte mit „Mehr anzeigen“, Suche (Name/Adresse), Filter: *Geteilt*, *Mit GPS* und nach *Ort* (automatisch aus den Adressen) |
| **Neues Projekt** | Name, Adresse, GPS-Standort per Knopfdruck (füllt die Adresse automatisch), großer **Start**-Button unten, oder „Ohne Angaben direkt zur Kamera“ |
| **Kamera** | Vollbild, alle verfügbaren Linsen (Ultraweitwinkel/Tele – soweit das Gerät sie meldet), Pinch-Zoom, Blitz Aus/Auto/An, Taschenlampe, Raster, Front-/Rückkamera. Oben steht immer, wohin das Foto gespeichert wird (Projekt › Pin) |
| **Nach dem Foto** | Neues Fenster mit Notizfeld (speichert automatisch) und Button **„Pins hinzufügen“** |
| **Pins** | Ins Bild tippen → Pin benennen → sofort ein Detailfoto für diese Stelle aufnehmen. Pins zeigen eine Zahl, die Anzahl ihrer Fotos und pulsieren leicht |
| **Unter-Pins** | Auf jedem Detailfoto lassen sich wieder Pins setzen – beliebig tief. Eine Brotkrumen-Leiste zeigt immer den Pfad (Hausrenovierung › Haustür › Schloss) |
| **Projekt öffnen** | Titelbild mit allen Pins; Tipp auf einen Pin zeigt dessen Detailfotos. Darunter eine Baumansicht aller Markierungen |
| **Teilen & Team** | Kollegen mit Rolle (Bearbeiten/Ansehen) einladen, Projektbericht (alle Pins + Notizen) per WhatsApp/Mail/Teams senden, Titelbild teilen |

Alle Daten und Fotos werden lokal auf dem Handy gespeichert.

## App auf dem Handy testen (ca. 10 Minuten)

Du brauchst: einen Computer mit **Node.js** (LTS von https://nodejs.org) und dein Handy im **gleichen WLAN**.

1. **Expo Go** auf dem Handy installieren (App Store bzw. Google Play).
2. Die ZIP-Datei entpacken, z. B. nach `C:\Projekte\PinSnap`.
3. Ein **Terminal** öffnen – *nicht* das Node.js-Fenster, in dem `>` steht!
   - Windows: Startmenü → „PowerShell“ eintippen → öffnen
   - Mac: Spotlight (Cmd+Leertaste) → „Terminal“
4. In den Ordner wechseln und die App starten:
   ```
   cd C:\Projekte\PinSnap
   npm install
   npx expo start
   ```
5. Es erscheint ein **QR-Code**:
   - **iPhone:** mit der normalen Kamera-App scannen → „In Expo Go öffnen“
   - **Android:** in Expo Go auf „Scan QR code“ tippen
6. Kamera- und Standortzugriff erlauben – fertig.

Jede Änderung am Code erscheint sofort auf dem Handy. Mit `Strg+C` im Terminal stoppst du den Server.

**Probleme?**
- *QR-Code lädt nicht / Zeitüberschreitung:* `npx expo start --tunnel` verwenden (funktioniert auch ohne gleiches WLAN).
- *„Project is incompatible with this version of Expo Go“:* Expo Go im Store aktualisieren (das Projekt nutzt Expo SDK 58).
- *Windows: „Ausführung von Skripts ist deaktiviert“:* einmal in PowerShell `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ausführen und mit `J` bestätigen.

## Echte App bauen (zum Installieren ohne Expo Go / für die Stores)

```
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # .apk zum direkten Installieren
eas build --platform ios                         # benötigt Apple-Developer-Konto (99 $/Jahr)
```
Kostenloses Expo-Konto unter https://expo.dev. Für Google Play fällt einmalig 25 $ an.

## Projektstruktur

```
src/
  app/                 Bildschirme (Expo Router – jede Datei = ein Screen)
    index.tsx          Startseite mit Projektübersicht, Suche, Filtern
    new.tsx            Neues Projekt (Name, Adresse, GPS, Start)
    camera.tsx         Kamera mit Linsen, Zoom, Blitz, Raster
    photo.tsx          Foto-Ansicht: Notizen + Pins setzen
    pin.tsx            Pin-Ansicht: Detailfotos dieser Stelle
    project/[id].tsx   Projektansicht mit Titelbild und allen Pins
    share.tsx          Teilen & Team
  components/          PinnedImage (Foto mit Pins), Breadcrumbs, UI-Bausteine
  lib/
    store.tsx          Datenhaltung (Projekte, Fotos, Pins) + Speicherung
    files.ts           Fotos dauerhaft im App-Ordner ablegen
    types.ts           Datenmodell
    theme.ts           Farben & Design
```

**Datenmodell:** Ein Projekt hat Hauptfotos. Jedes Foto hat Pins (Position 0–1 relativ zum Bild, dadurch auf jedem
Bildschirm exakt). Jeder Pin verweist auf Detailfotos, die wiederum eigene Pins haben → beliebig tiefe Unter-Pins.

## Nächster Schritt: echte Live-Zusammenarbeit

Teilen funktioniert schon über Einladungstext und Bericht. Damit mehrere Kollegen **gleichzeitig dasselbe Projekt
bearbeiten** und Fotos synchron sehen, braucht die App ein Online-Backend mit Benutzerkonten, z. B.
**Supabase** oder **Firebase** (Anmeldung, Datenbank für Projekte/Pins, Speicher für Fotos). Die Datenhaltung ist in
`src/lib/store.tsx` gebündelt, sodass sich das dort anschließen lässt, ohne die Bildschirme umzubauen.
