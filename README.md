# Modo Pasado

Eine moderne, iPad-freundliche Spanisch-Lernwebseite für **Imperfecto** und **Pretérito Indefinido**.

## Funktionen

- Zufällige Verbübungen ohne feste Runden
- Tabelle für alle Personen in beiden Zeiten
- Drei zufällige Aufgabenmodi:
  - nur der Infinitiv ist gegeben
  - drei zufällige Formen sind vorgegeben und gesperrt
  - Infinitiv plus eine zufällige Form sind gegeben
- Umschaltbarer Modus "Nur unregelmäßige Verben"
- Kleine Anzeige, ob das aktuelle Verb regelmäßig oder unregelmäßig ist
- Stammhinweise für passende unregelmäßige Indefinido-Formen
- Im Modus "Nur unregelmäßige Verben" werden nur die tatsächlich unregelmäßigen Zeitformen aktiv abgefragt; regelmäßige Zeitformen werden automatisch neutral ausgefüllt und gesperrt
- Prüfung mit grüner und roter Markierung
- Lösung anzeigen und direkt zum nächsten Verb wechseln
- Optionaler Modus für strenge Akzentprüfung
- Ausführlicher Lernbereich mit Regeln, Beispielen und Signalwörtern
- Dark Mode, große Eingabefelder und responsives Layout
- Mobile-first UI mit iPhone-optimierten Übungskarten und Sticky-Bottom-Aktionen

## Verben

Die App nutzt ausschließlich die in der Aufgabenstellung vorgegebenen Verben:

- Regelmäßig: hablar, estudiar, comer, beber, vivir, escribir
- Unregelmäßig: ir, ser, ver, hacer, tener, estar, poder, poner, venir, querer, saber, decir, traer, dar, andar

## Lokal starten

Die Webseite ist statisch und benötigt keinen Build-Schritt.

1. Repository klonen oder herunterladen.
2. `index.html` im Browser öffnen.

Optional kann ein lokaler Server genutzt werden:

```bash
python -m http.server 8000
```

Danach ist die App unter `http://localhost:8000` erreichbar.

## Struktur

```text
.
├── assets
│   ├── css
│   │   └── style.css
│   └── js
│       └── script.js
├── index.html
├── README.md
└── .nojekyll
```
