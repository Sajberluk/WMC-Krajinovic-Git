// WMC Aufgabe 3: Homepage Logik
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("recommendation-container");

  // Fetching data from TVmaze API (free public API for shows)
  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Netzwerk-Antwort war nicht ok");
      }
      return response.json();
    })
    .then((showsArray) => {
      // 1. Array-Verwendung: Wir waehlen ein zufaelliges Element aus dem Array
      const randomIndex = Math.floor(Math.random() * showsArray.length);
      const show = showsArray[randomIndex];

      // 2. DOM Nodes erzeugen / austauschen
      // Container leeren (alte Lademeldung loeschen)
      container.innerHTML = "";

      // Karten-Wrapper erstellen
      const card = document.createElement("div");
      card.classList.add("recommendation-card");

      // Bild erzeugen
      const img = document.createElement("img");
      img.src = show.image ? show.image.medium : "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=70";
      img.alt = show.name;
      card.appendChild(img);

      // Inhaltsbereich erstellen
      const content = document.createElement("div");
      content.classList.add("content");

      // Titel
      const title = document.createElement("h3");
      title.textContent = show.name;
      content.appendChild(title);

      // Kurzbeschreibung (HTML-Tags entfernen)
      const cleanSummary = show.summary 
        ? show.summary.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 180) + "..." 
        : "Keine Beschreibung verfügbar.";
      const summary = document.createElement("p");
      summary.textContent = cleanSummary;
      content.appendChild(summary);

      // Meta-Informationen (Genres & Rating)
      const metaInfo = document.createElement("div");
      metaInfo.classList.add("meta-info");
      
      // Genres (Array in String umwandeln)
      const genresText = show.genres && show.genres.length > 0 
        ? show.genres.join(", ") 
        : "Unbekanntes Genre";

      const ratingText = show.rating && show.rating.average 
        ? `⭐ ${show.rating.average}/10` 
        : "Keine Bewertung";

      metaInfo.textContent = `Genre: ${genresText} | Bewertung: ${ratingText}`;
      content.appendChild(metaInfo);

      card.appendChild(content);
      container.appendChild(card);
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Serienempfehlung:", error);
      container.innerHTML = `<p style="padding: 16px; margin: 0; color: #c0392b;">Fehler beim Laden der Empfehlung. Bitte lade die Seite neu.</p>`;
    });
});
