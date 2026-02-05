# 📚 Smart Study Planner

Ein intelligenter Lern- und Aufgabenplaner für Schüler mit automatischer Prioritätsberechnung und visueller Fortschrittsdarstellung.

## 🎯 Übersicht

Smart Study Planner hilft Schülern dabei, ihre Aufgaben, Prüfungen und Projekte effizient zu organisieren. Die Anwendung berechnet automatisch Prioritäten basierend auf Fälligkeitsdatum und Schwierigkeit und bietet umfassende Statistiken über den Lernfortschritt.

## ✨ Features

### Kernfunktionen
- **📚 Fächerverwaltung**
  - Fächer erstellen, bearbeiten und löschen
  - Individuelle Farbzuordnung für bessere Übersicht
  - Automatisches Löschen zugehöriger Aufgaben beim Fach-Löschen

- **✅ Aufgaben & Prüfungen**
  - Drei Aufgabentypen: Hausaufgaben, Prüfungen, Projekte
  - Schwierigkeitsgrad von 1 (sehr leicht) bis 5 (sehr schwer)
  - Geschätzte Bearbeitungszeit
  - Status-Tracking: Offen, In Bearbeitung, Erledigt

- **🔥 Intelligente Prioritätsberechnung**
  - Automatische Berechnung nach wissenschaftlicher Formel:
    ```
    daysLeft = max(1, ceil((dueDate - today) in days))
    urgencyScore = 50 / daysLeft
    difficultyScore = difficulty * 10
    priorityScore = min(100, round(urgencyScore + difficultyScore))
    ```
  - Dynamische Anpassung basierend auf verbleibenden Tagen
  - Berücksichtigung der Schwierigkeit

- **🔍 Filter & Sortierung**
  - Nach Status: Alle, Offen, Erledigt, Heute fällig, Überfällig
  - Nach Fach: Alle oder spezifisches Fach
  - Nach Typ: Alle, Hausaufgaben, Prüfungen, Projekte
  - Automatische Sortierung: Priorität → Fälligkeitsdatum

- **📊 Dashboard & Statistiken**
  - Globale Übersicht: Fortschritt, Erledigte/Offene/Überfällige Aufgaben
  - Kreisdiagramm: Status-Verteilung
  - Balkendiagramm: Aufgaben pro Fach
  - Zeitaufwand-Übersicht: Gesamt, Erledigt, Verbleibend
  - Detaillierte Fach-Statistiken

- **💾 Offline-First**
  - Alle Daten werden lokal im Browser gespeichert (LocalStorage)
  - Keine Internetverbindung erforderlich
  - Keine Anmeldung, kein Account-System
  - Volle Datenkontrolle

## 🚀 Installation

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Schritte

1. **Repository klonen oder herunterladen**
   ```bash
   cd smart-study-planner
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Im Browser öffnen**
   ```
   http://localhost:5173
   ```

### Produktions-Build erstellen
```bash
npm run build
```

Die fertigen Dateien befinden sich dann im `dist/` Ordner und können auf jedem Webserver gehostet werden.

## 📱 Verwendung

### Erste Schritte

1. **Fächer erstellen**
   - Navigiere zu "📚 Fächer"
   - Klicke auf "+ Neues Fach"
   - Gib einen Namen ein und wähle eine Farbe
   - Speichern

2. **Aufgaben anlegen**
   - Navigiere zu "✅ Aufgaben"
   - Klicke auf "+ Neue Aufgabe"
   - Fülle alle Felder aus:
     - Fach auswählen
     - Titel eingeben
     - Optional: Beschreibung
     - Typ wählen (Hausaufgabe/Prüfung/Projekt)
     - Schwierigkeit festlegen (1-5)
     - Fälligkeitsdatum setzen
     - Geschätzte Bearbeitungszeit angeben

3. **Aufgaben verwalten**
   - Status ändern: "In Arbeit" oder "Erledigt"
   - Aufgaben bearbeiten
   - Aufgaben löschen

4. **Fortschritt verfolgen**
   - Navigiere zum "📊 Dashboard"
   - Sieh dir deine Statistiken an
   - Analysiere Zeitaufwand und Verteilung

## 🏗️ Technische Architektur

### Technologie-Stack
- **Frontend-Framework:** React 18
- **Build-Tool:** Vite
- **Charts:** Recharts
- **Styling:** Vanilla CSS (modernes Gradient-Design)
- **Persistenz:** Browser LocalStorage

### Projektstruktur
```
smart-study-planner/
├─ src/
│   ├─ components/
│   │   ├─ Dashboard.jsx          # Statistiken und Visualisierungen
│   │   ├─ SubjectManager.jsx     # Fächerverwaltung
│   │   └─ TaskManager.jsx        # Aufgabenverwaltung
│   ├─ models/
│   │   └─ models.js              # Datenmodelle (Subject, Task)
│   ├─ storage/
│   │   └─ storage.js             # LocalStorage Manager
│   ├─ utils/
│   │   └─ helpers.js             # Hilfsfunktionen & Berechnungen
│   ├─ App.jsx                    # Hauptkomponente
│   ├─ App.css                    # Globale Styles
│   └─ main.jsx                   # Entry Point
├─ public/
├─ index.html
├─ package.json
├─ vite.config.js
└─ README.md
```

### Datenmodelle

#### Subject (Fach)
```javascript
{
  id: "string (UUID)",
  name: "string",
  color: "string (HEX)",
  createdAt: "ISO Date"
}
```

#### Task (Aufgabe)
```javascript
{
  id: "string (UUID)",
  subjectId: "string (UUID)",
  title: "string",
  description: "string",
  type: "homework | exam | project",
  difficulty: 1 | 2 | 3 | 4 | 5,
  dueDate: "ISO Date",
  estimatedTimeMinutes: number,
  status: "open | in_progress | done",
  createdAt: "ISO Date",
  completedAt: "ISO Date | null"
}
```

## 🔬 Prioritätsalgorithmus

Die Priorität wird nach folgender wissenschaftlicher Formel berechnet:

```javascript
function calculatePriority(task) {
  // Verbleibende Tage berechnen (mindestens 1)
  const daysLeft = max(1, ceil((dueDate - today) in days));
  
  // Dringlichkeit (je näher, desto höher)
  const urgencyScore = 50 / daysLeft;
  
  // Schwierigkeit (1-5 wird zu 10-50)
  const difficultyScore = difficulty * 10;
  
  // Gesamtpriorität (maximal 100)
  return min(100, round(urgencyScore + difficultyScore));
}
```

### Beispiele
- **Hausaufgabe (Schwierigkeit 3) in 7 Tagen:** 
  - urgencyScore = 50/7 ≈ 7
  - difficultyScore = 3*10 = 30
  - **Priorität = 37**

- **Prüfung (Schwierigkeit 5) in 2 Tagen:**
  - urgencyScore = 50/2 = 25
  - difficultyScore = 5*10 = 50
  - **Priorität = 75**

- **Projekt (Schwierigkeit 4) morgen:**
  - urgencyScore = 50/1 = 50
  - difficultyScore = 4*10 = 40
  - **Priorität = 90**

## 🎨 Design-Prinzipien

- **Modern & Ansprechend:** Gradient-Hintergründe und weiche Schatten
- **Übersichtlich:** Klare Hierarchie und Farbcodierung
- **Responsiv:** Funktioniert auf Desktop, Tablet und Mobile
- **Intuitiv:** Selbsterklärende Benutzeroberfläche
- **Zugänglich:** Gute Kontraste und lesbare Schriften

## 🚧 Roadmap (Zukünftige Features)

### Phase 2 - KI-Integration
- [ ] **Intelligente Lernzeit-Vorschläge**
  - Basierend auf Restzeit bis zur Prüfung
  - Angepasst an Schwierigkeit
  - Berücksichtigung bisherigen Lernverhaltens

- [ ] **Adaptive Prioritäten**
  - Lernmuster-Erkennung
  - Personalisierte Empfehlungen
  - Überlastungs-Warnung

### Phase 3 - Cloud & Sync
- [ ] **Benutzer-Accounts**
- [ ] **Cloud-Synchronisation**
- [ ] **Multi-Device-Support**
- [ ] **Backup & Restore**

### Phase 4 - Mobile
- [ ] **Native Mobile App**
- [ ] **Push-Benachrichtigungen**
- [ ] **Offline-Sync**
- [ ] **Widget-Support**

### Phase 5 - Erweiterte Features
- [ ] **Kalender-Integration**
- [ ] **Lerngruppen & Kollaboration**
- [ ] **Gamification (Achievements, Streaks)**
- [ ] **Export/Import (CSV, iCal)**
- [ ] **Druck-Funktion für Wochenplan**
- [ ] **Dark Mode**

## 🤝 Beitragen

Contributions sind willkommen! Hier ist, wie du helfen kannst:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt ist für Bildungszwecke erstellt. Frei verwendbar und modifizierbar.

## 🐛 Bekannte Probleme

Aktuell keine bekannten Probleme. Wenn du einen Bug findest, öffne bitte ein Issue.

## 💡 FAQ

**F: Werden meine Daten hochgeladen?**  
A: Nein, alle Daten werden ausschließlich lokal in deinem Browser gespeichert.

**F: Was passiert, wenn ich den Browser-Cache lösche?**  
A: Alle Daten gehen verloren. Ein Export/Backup-Feature ist für Phase 5 geplant.

**F: Kann ich die App offline nutzen?**  
A: Ja! Nach dem ersten Laden funktioniert die App komplett offline.

**F: Wie wird die Priorität berechnet?**  
A: Siehe Abschnitt "Prioritätsalgorithmus" für Details.

## 📞 Kontakt & Support

Bei Fragen oder Problemen:
- Öffne ein Issue auf GitHub
- Oder kontaktiere den Entwickler

---

**Viel Erfolg beim Lernen! 📚🎓**
