# Pokédex

Eine Pokédex-Webseite mit HTML, CSS und JavaScript. Die Pokémon-Daten werden von der [PokéAPI](https://pokeapi.co/) geladen.

## Starten

Das Projekt herunterladen und `index.html` in einem aktuellen Browser öffnen. Für die API-Abfragen ist eine Internetverbindung erforderlich. Es gibt keinen Installations- oder Build-Schritt; API-Schlüssel werden nicht benötigt.

## Verwendung

- Zu Beginn werden 40 Pokémon angezeigt. Über „mehr Pokemon!“ lassen sich weitere 40 laden; „Zeig mir ALLE!“ lädt die gesamte Liste.
- Die Suche unterstützt Namen, Typen und Pokédex-Nummern. Textsuchen starten ab drei Zeichen, Nummernsuchen auch mit weniger Zeichen.
- Ein Klick auf eine Pokémon-Karte öffnet Details mit Beschreibung, Größe, Gewicht, Geschlechterverteilung, Statuswerten und Entwicklungen.
- Namen und Typen werden nach Möglichkeit auf Deutsch angezeigt. Abgerufene API-Daten werden für die aktuelle Sitzung im Speicher zwischengespeichert.

## Projektstruktur

- `index.html`: Grundstruktur und Einbindung der Dateien
- `script.js`: Initialisierung, Suche und Darstellung der Pokémon-Karten
- `scripts/api.js`: API-Abfragen, Cache und Aufbereitung der Pokémon-Daten
- `scripts/overlay.js`: Detaildialog und Navigation
- `scripts/template.js`: HTML-Vorlagen
- `style.css` und `styles/`: Gestaltung
- `assets/`: Bilder, Schriftarten und weitere Ressourcen
