/**
 * 2. Hü: Promises und Promise Chaining
 */

// Stufe 1: Einfaches Promise
// Erstelle eine Funktion holeBrief(inhalt), die ein Promise zurückgibt. 
// Nach einer Verzögerung von 1 Sekunde soll das Promise den Inhalt des Briefes erfolgreich auflösen (resolve).
function holeBrief(inhalt) {
  return new Promise((resolve) => {
    console.log("Brief wird geholt...");
    setTimeout(() => {
      resolve(inhalt);
    }, 1000);
  });
}

// Stufe 2: Promise Chaining
// 1. stempelBrief(brief): Nimmt den Brief, hängt " [Gestempelt]" an und gibt ein neues Promise zurück.
function stempelBrief(brief) {
  return new Promise((resolve) => {
    console.log("Brief wird gestempelt...");
    setTimeout(() => {
      resolve(brief + " [Gestempelt]");
    }, 1000);
  });
}

// 2. versendeBrief(brief): Nimmt den gestempelten Brief, hängt " -> Versendet!" an und gibt ein neues Promise zurück.
function versendeBrief(brief) {
  return new Promise((resolve) => {
    console.log("Brief wird versendet...");
    setTimeout(() => {
      resolve(brief + " -> Versendet!");
    }, 1000);
  });
}

// Kette diese Funktionen nun mit .then() hintereinander.
const startInhalt = "Liebesbrief an JavaScript";

console.log("Starte Brief-Prozess für: '" + startInhalt + "'");
console.log("==================================================");

holeBrief(startInhalt)
  .then((brief) => {
    console.log("-> Ergebnis holeBrief:", brief);
    console.log("--------------------------------------------------");
    return stempelBrief(brief);
  })
  .then((gestempelterBrief) => {
    console.log("-> Ergebnis stempelBrief:", gestempelterBrief);
    console.log("--------------------------------------------------");
    return versendeBrief(gestempelterBrief);
  })
  .then((versendeterBrief) => {
    console.log("-> Ergebnis versendeBrief:", versendeterBrief);
    console.log("==================================================");
    console.log("Prozess erfolgreich abgeschlossen!");
  })
  .catch((error) => {
    console.error("Ein Fehler ist aufgetreten:", error);
  });
