# teknikator.dev — persönliche Webseite

Eine statische Ein-Seiten-Webseite: Vorstellung + Tech-Stack.
Keine Build-Tools, keine Abhängigkeiten — `index.html` im Browser öffnen, fertig.

## Aufbau

| Datei        | Inhalt                                              |
|--------------|-----------------------------------------------------|
| `index.html` | Die komplette Seite (Markup, Styles und Inhalte)    |

## Inhalte anpassen

Alle Texte stehen direkt in `index.html` und sind mit Kommentaren markiert:

- **`<!-- HERO -->`** — Name, Untertitel, Vorstellungstext und die drei Eckdaten darunter.
- **`<!-- TECH-STACK -->`** — vier Bereiche (Frontend, Backend, Infrastruktur, Werkzeuge).
  Ein Eintrag ist ein `<li>`; Bereiche lassen sich als ganzer `<section class="stack">`-Block
  duplizieren oder löschen.

> Die aktuellen Texte und Technologien sind Platzhalter mit realistischen Werten —
> bitte durch die eigenen ersetzen.

## Design anpassen

Farben und Schriften liegen als CSS-Variablen ganz oben im `<style>`-Block:

```css
--ground: #080b10;  /* Seitenhintergrund   */
--amp:    #f0a248;  /* Akzentfarbe         */
--chalk:  #e8edf4;  /* Fließtext           */
```

Für eine andere Akzentfarbe reicht es, `--amp`, `--amp-soft` und `--amp-line` zu ändern.

## Veröffentlichen

Die Seite ist eine einzelne statische Datei und läuft überall:

- **GitHub Pages** — im Repo unter *Settings → Pages* den Branch auswählen, Ordner `/`.
- **Netlify / Vercel / Cloudflare Pages** — Repo verbinden, kein Build-Befehl, Ausgabeordner `/`.

Lokal ansehen:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```
