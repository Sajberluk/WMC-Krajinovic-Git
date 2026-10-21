# Protokoll: Bug-Jagd beim Klassenturnier (TypeScript Interfaces)

## Schritt 1: Das JavaScript-Programm ausführen

Beim Ausführen des Programms mit `node src/app.js` erscheint folgende Konsolenausgabe, gefolgt von einem Laufzeitfehler:

```
=== Spengi Cup in room C3.07 ===
Null Pointer Ninjas (5AAIF), total kills: 012212
  byteMe [NPN] tank, KDA NaN
file:///.../arena_clash/src/app.js:22
    return `${player.gamertag} [${player.clan.tag}] ${player.role}, KDA ${calcKda(player.stats).toFixed(2)}`;
                                              ^

TypeError: Cannot read properties of undefined (reading 'tag')
```

### 1. Welche Werte in der Ausgabe sind falsch? Warum?

* **`total kills: 012212` (statt 35):**
  * **Ursache:** In der Funktion `totalKills(team)` wird `reduce` mit dem Startwert `"0"` (als String) aufgerufen:
    ```javascript
    return team.players.reduce((sum, player) => sum + player.stats.kills, "0");
    ```
    Dadurch führt JavaScript eine String-Konkatenation statt einer numerischen Addition durch (`"0" + 12 + 21 + 2 = "012212"`).
* **`KDA NaN` (statt 5.25):**
  * **Ursache:** In der Funktion `calcKda(stats)` wird auf `stats.assist` zugegriffen:
    ```javascript
    return (stats.kills + stats.assist) / deaths;
    ```
    Im JSON heißt das Feld jedoch `assists` (Plural). `stats.assist` liefert `undefined`. Die Berechnung `12 + undefined` evaluiert zu `NaN`.

### 2. In welcher Zeile stürzt das Programm ab?

* **Absturz in Zeile 22** in der Funktion `formatPlayer`:
  ```javascript
  return `${player.gamertag} [${player.clan.tag}] ${player.role}, KDA ${calcKda(player.stats).toFixed(2)}`;
  ```
* **Grund:** Der zweite Spieler der ersten Mannschaft (`segfault`) gehört keinem Clan an. Das Feld `clan` fehlt bei ihm in den JSON-Daten (`player.clan` ist `undefined`). Der Zugriff auf `player.clan.tag` wirft daher einen `TypeError: Cannot read properties of undefined (reading 'tag')`.

---

## Schritt 3: JavaScript wird TypeScript

Nach Definition der Interfaces und Typisierung der Funktionssignaturen und Variablen meldet der TypeScript Compiler (`npx tsc --noEmit`) eine Reihe von Typfehlern.

### 1. Wie viele Probleme hat der Compiler gefunden?

Der Compiler meldete insgesamt 17 Compiler-Meldungen, die auf **9 grundlegende Probleme** im ursprünglichen JavaScript-Code hinweisen:

1. **`stats.assist` existiert nicht auf `Stats` (TS2551):**
   * *Meldung:* `Property 'assist' does not exist on type 'Stats'. Did you mean 'assists'?`
   * *Problem:* Tippfehler im Property-Namen.
2. **Falscher Rückgabetyp in `totalKills` (TS2322):**
   * *Meldung:* `Type 'string' is not assignable to type 'number'.`
   * *Problem:* Wegen des Startwerts `"0"` gibt `reduce` einen String zurück, obwohl die Funktion als `: number` typisiert ist.
3. **Mögliches `undefined` bei Clan-Zugriff (TS18048):**
   * *Meldung:* `'player.clan' is possibly 'undefined'.`
   * *Problem:* `clan` ist optional. Der Zugriff auf `player.clan.tag` ist ohne Existenzprüfung unsicher.
4. **Fehlender Rückgabewert in `winner` (TS2366):**
   * *Meldung:* `Function lacks ending return statement and return type does not include 'undefined'.`
   * *Problem:* Wenn ein Spiel unentschieden ausgeht, gibt die Funktion keinen String zurück.
5. **Mögliches `null` bei `match.score` (TS18047):**
   * *Meldungen:* `'match.score' is possibly 'null'` in `winner` und `formatMatch`.
   * *Problem:* Das Feld `score` ist `Score | null` (noch nicht ausgetragene Spiele haben `score: null`). Der direkte Zugriff auf `score.teamA` / `score.teamB` schlägt bei geplanten Spielen fehl.
6. **Mögliches `undefined` bei `findTeam` (TS2532):**
   * *Meldungen:* `Object is possibly 'undefined'` in `formatMatch` und beim Hinzufügen von `newPlayer`.
   * *Problem:* `findTeam` gab zunächst `Team | undefined` zurück. Ein Aufruf von `.name` oder `.players.push()` ohne Prüfung ist unsicher.
7. **Unmögliche Bedingung beim Match-Status (TS2367):**
   * *Meldung:* `This comparison appears to be unintentional because the types 'MatchStatus' and '"done"' have no overlap.`
   * *Problem:* Der Code prüfte `match.status === "done"`. Gültige Werte für `MatchStatus` sind jedoch nur `"finished" | "live" | "scheduled"`. Der Status `"done"` existiert nicht, weshalb der Gewinner nie ausgegeben worden wäre.
8. **Ungültige Rolle und unvollständige Stats bei `newPlayer` (TS2322, TS2741):**
   * *Meldung:* `Type '"healer"' is not assignable to type 'Role'.`
   * *Meldung:* `Property 'assists' is missing in type '{ kills: number; deaths: number; }' but required in type 'Stats'.`
   * *Problem:* `"healer"` ist keine gültige Rolle (`"tank" | "damage" | "support"`). Zudem fehlte die Pflicht-Property `assists`.
9. **Falscher Parametertyp bei `MVP` in Zeile 125 (TS2345):**
   * *Meldung:* `Argument of type 'string | undefined' is not assignable to parameter of type 'Player'.`
   * *Problem:* `firstMatch.mvp` ist ein Gamertag (`string`), `formatPlayer` erwartet jedoch ein ganzes `Player`-Objekt.

### 2. Welche Probleme hätte JavaScript nie gemeldet, nicht einmal mit einem Absturz?

Folgende logische und semantische Fehler hätte die JavaScript-Laufzeitumgebung stillschweigend akzeptiert:

* **String-Konkatenation in `totalKills`:** JavaScript wandelt Zahlen bei `+` mit Strings stillschweigend in Strings um. Das Ergebnis `"012212"` ist mathematisch falsch, führt aber zu keinem Laufzeitfehler.
* **Tippfehler `stats.assist`:** Ein Zugriff auf eine nicht vorhandene Property liefert in JS einfach `undefined`. Die Rechnung `kills + undefined` ergibt `NaN`, was zwar semantisch fehlerhaft ist, das Programm aber nicht abbricht.
* **Vergleich `match.status === "done"`:** Da in den Daten `"finished"` steht, evaluiert dieser Ausdruck in JavaScript einfach immer zu `false`. Der Codezweig mit dem Gewinner wird nie betreten, ohne Fehlermeldung.
* **Ungültige Rolle `"healer"`:** JavaScript prüft keine Wertebereiche von Strings; jede beliebige Zeichenkette wird problemlos zugewiesen.
* **Fehlende Property `assists` bei `newPlayer`:** In JavaScript können Objekte beliebig strukturiert sein. Das Fehlen von `assists` fällt erst auf, wenn später versucht wird, damit zu rechnen.

### 3. Manche Fehler treten mit diesen Daten gar nicht auf (z. B. bei findTeam). Warum meldet der Compiler sie trotzdem?

* **Statische Analyse zur Compile-Zeit:** TypeScript analysiert den Code statisch anhand der Typdefinitionen und Kontrakte, ohne die tatsächlichen Laufzeitinhalte zu kennen.
* **Sicherheit bei dynamischen Daten:** Die Methode `Array.prototype.find` liefert laut Signatur immer `T | undefined`, da ein gesuchtes Element im Array nicht vorhanden sein könnte.
* Der Compiler verlangt, dass alle potenziellen Randfälle (wie z. B. ein nicht gefundener Team-Tag durch fehlerhafte Eingaben oder neue Daten) explizit im Code abgesichert werden (z. B. durch einen Type Guard oder durch das Werfen einer Exception mit `throw new Error(...)`).
