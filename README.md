# teknikator — persönliche Webseite

Eine statische Ein-Seiten-Webseite: Vorstellung + Tech-Stack, in einem dunklen,
technischen Look mit Boot-Sequenz, animiertem Hintergrund und Scroll-Effekten.
Kein Build-Schritt, keine Abhängigkeiten — `index.html` im Browser öffnen, fertig.

## Aufbau

| Datei        | Inhalt                                                  |
|--------------|---------------------------------------------------------|
| `index.html` | Struktur und sämtliche Texte                            |
| `styles.css` | Design: Farben, Schriften, Layout, Animationen          |
| `main.js`    | Boot-Sequenz, Hintergrund-Canvas, Scroll- und Hover-Effekte |

## Inhalte anpassen

Alle Texte stehen in `index.html` und sind mit Kommentaren markiert:

- **`<!-- HERO -->`** — Name, Untertitel, Vorstellungstext, die drei Eckdaten.
- **`<!-- TECH-STACK -->`** — vier Bereiche (Frontend, Backend, Infrastruktur, Werkzeuge).
  Ein Eintrag ist ein `<li>`; ein Bereich ist ein `<section class="stack">`-Block
  und lässt sich duplizieren oder löschen. Die Zahl in `section__count` dann mitziehen.
- Das Laufband über dem Tech-Stack steht im Block `<div class="ticker">` — die
  Begriffe stehen dort **zweimal** hintereinander, damit die Endlosschleife nahtlos
  läuft. Änderungen also in beiden `ticker__set` vornehmen.

> Die aktuellen Texte und Technologien sind Platzhalter mit realistischen Werten —
> bitte durch die eigenen ersetzen. Das gilt auch für „Offen für Projekte"
> in der Kopfzeile.

## Design anpassen

Farben und Schriften liegen als CSS-Variablen ganz oben in `styles.css`:

```css
--void:  #05070c;  /* Seitenhintergrund */
--volt:  #35e0ff;  /* Akzentfarbe       */
--chalk: #e4ecf5;  /* Fließtext         */
```

Für eine andere Akzentfarbe reichen `--volt`, `--volt-soft` und `--volt-line`.

## Animationen

| Effekt                | Wo abgeschaltet / eingestellt                          |
|-----------------------|--------------------------------------------------------|
| Boot-Sequenz          | `main.js`, Abschnitt 1 — `duration` oder Block löschen  |
| Punkteraster-Canvas   | `main.js`, Abschnitt 3 — `GAP`, `RADIUS`                |
| Einblenden beim Scrollen | `styles.css`, Block `.js .reveal`                    |
| Laufband-Tempo        | `styles.css`, `.ticker__track { animation: marquee 42s }` |
| Glitch auf dem Namen  | `main.js`, Abschnitt 6                                  |

Zwei Dinge sind bewusst so gebaut:

- **Ohne JavaScript** bleibt die Seite vollständig lesbar. Alle versteckten
  Ausgangszustände hängen an der Klasse `.js`, die das Skript selbst setzt.
- **Bei `prefers-reduced-motion`** läuft keine einzige Animation an, die
  Boot-Sequenz wird übersprungen und der Canvas zeichnet nur ein Standbild.

## Veröffentlichen

- **GitHub Pages** — *Settings → Pages*, Branch auswählen, Ordner `/`.
- **Netlify / Vercel / Cloudflare Pages** — Repo verbinden, kein Build-Befehl, Ausgabeordner `/`.

Lokal ansehen:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```
