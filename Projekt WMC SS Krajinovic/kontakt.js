// WMC Aufgabe 3: Kontaktseite Logik
document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackList = document.getElementById("feedback-list");

  // Beispieldaten laden, falls der Speicher komplett leer ist (damit die Seite nicht leer wirkt)
  const defaultFeedback = [
    {
      id: 1,
      name: "Sabine M.",
      email: "sabine@example.com",
      typ: "Serie",
      titel: "Neon City",
      msg: "Die beste Cyberpunk-Serie! Die Atmosphäre ist einfach unschlagbar."
    }
  ];

  // Feedback-Liste aus LocalStorage laden
  let feedbackData = JSON.parse(localStorage.getItem("feedbackList"));
  if (!feedbackData || !Array.isArray(feedbackData)) {
    feedbackData = defaultFeedback;
    localStorage.setItem("feedbackList", JSON.stringify(feedbackData));
  }

  // Funktion zum Rendern der Feedback-Einträge
  function renderFeedback() {
    // DOM-Nodes löschen
    feedbackList.innerHTML = "";

    // Wenn keine Einträge vorhanden sind, zeigen wir eine kurze Info
    if (feedbackData.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.style.padding = "10px";
      emptyMsg.style.background = "white";
      emptyMsg.style.border = "1px solid #ddd";
      emptyMsg.style.borderRadius = "10px";
      emptyMsg.textContent = "Bisher wurden keine Empfehlungen eingereicht.";
      feedbackList.appendChild(emptyMsg);
      return;
    }

    // Array-Verwendung: Durch alle Feedback-Einträge iterieren
    feedbackData.forEach((entry) => {
      // DOM-Nodes erzeugen
      const card = document.createElement("div");
      card.classList.add("feedback-card");

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("info");

      // Kategorie (Film / Serie)
      const category = document.createElement("span");
      category.classList.add("category");
      category.textContent = entry.typ;
      infoDiv.appendChild(category);

      // Titel
      const heading = document.createElement("h4");
      heading.textContent = entry.titel;
      infoDiv.appendChild(heading);

      // Nachricht / Warum empfohlen
      const text = document.createElement("p");
      text.textContent = `"${entry.msg || "Keine Begründung angegeben."}"`;
      infoDiv.appendChild(text);

      // Ersteller-Info
      const author = document.createElement("small");
      author.style.color = "#777";
      author.textContent = `Empfohlen von: ${entry.name} (${entry.email})`;
      infoDiv.appendChild(author);

      card.appendChild(infoDiv);

      // Löschen-Button (DOM Nodes löschen / Array-Manipulation)
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Löschen";
      deleteBtn.addEventListener("click", () => {
        // Element per ID aus dem Array filtern
        feedbackData = feedbackData.filter(item => item.id !== entry.id);
        localStorage.setItem("feedbackList", JSON.stringify(feedbackData));
        renderFeedback();
      });

      card.appendChild(deleteBtn);
      feedbackList.appendChild(card);
    });
  }

  // Event-Listener für das Absenden des Formulars
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Standard-Redirect verhindern

    // Formulardaten auslesen
    const nameVal = document.getElementById("name").value.trim();
    const emailVal = document.getElementById("email").value.trim();
    const typVal = document.getElementById("typ").value;
    const titelVal = document.getElementById("titel").value.trim();
    const msgVal = document.getElementById("msg").value.trim();

    if (!nameVal || !emailVal || !titelVal) {
      alert("Bitte fülle alle Pflichtfelder (*) aus.");
      return;
    }

    // Neues Feedback-Objekt erstellen
    const newEntry = {
      id: Date.now(),
      name: nameVal,
      email: emailVal,
      typ: typVal,
      titel: titelVal,
      msg: msgVal
    };

    // Ins Array einfügen
    feedbackData.push(newEntry);
    localStorage.setItem("feedbackList", JSON.stringify(feedbackData));

    // Formular zurücksetzen und neu rendern
    feedbackForm.reset();
    renderFeedback();
  });

  // Initiale Anzeige laden
  renderFeedback();
});
