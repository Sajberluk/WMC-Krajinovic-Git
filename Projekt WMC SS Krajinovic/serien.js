// WMC Aufgabe 3: Serien-Seite Logik
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Watchlist-Elemente ---
  const watchlistInput = document.getElementById("watchlist-input");
  const watchlistAddBtn = document.getElementById("watchlist-add-btn");
  const watchlistList = document.getElementById("watchlist-list");

  // Initialer Zustand der Watchlist: Falls leer, laden wir die Standardeinträge des letzten Jahres
  const defaultWatchlist = [
    "Neon City – S1E1 bis S1E3",
    "Courtroom Nights – S1E1",
    "Kitchen Wars – komplett"
  ];

  // Watchlist aus dem LocalStorage laden oder Defaults nutzen
  let watchlist = JSON.parse(localStorage.getItem("watchlist"));
  if (!watchlist || !Array.isArray(watchlist)) {
    watchlist = defaultWatchlist;
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  // Funktion zum Rendern der Watchlist
  function renderWatchlist() {
    // DOM-Nodes löschen / Container leeren
    watchlistList.innerHTML = "";

    // Array-Verwendung: Durch das Watchlist-Array iterieren
    watchlist.forEach((itemText, index) => {
      // DOM-Nodes erzeugen
      const li = document.createElement("li");
      li.classList.add("watchlist-item");

      const span = document.createElement("span");
      span.textContent = itemText;
      li.appendChild(span);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Löschen";
      
      // Event-Listener zum Löschen des Elements
      deleteBtn.addEventListener("click", () => {
        // Element aus dem Array entfernen
        watchlist.splice(index, 1);
        // LocalStorage aktualisieren
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        // Watchlist neu rendern
        renderWatchlist();
      });

      li.appendChild(deleteBtn);
      watchlistList.appendChild(li);
    });
  }

  // Funktion zum Hinzufügen eines Eintrags zur Watchlist
  function addWatchlistItem() {
    const text = watchlistInput.value.trim();
    if (text === "") return;

    // Neues Element ins Array pushen
    watchlist.push(text);
    // LocalStorage aktualisieren
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    
    // Input leeren
    watchlistInput.value = "";
    // Watchlist neu zeichnen
    renderWatchlist();
  }

  // Event-Listener für Button und Enter-Taste bei der Watchlist
  watchlistAddBtn.addEventListener("click", addWatchlistItem);
  watchlistInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addWatchlistItem();
    }
  });


  // --- 2. Live-Suche (API) Elemente ---
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const searchResults = document.getElementById("search-results");

  // Funktion zur Durchführung der API-Suche
  function performSearch() {
    const query = searchInput.value.trim();
    if (query === "") return;

    // Suchergebnisse leeren (DOM Nodes austauschen/löschen)
    searchResults.innerHTML = '<p style="grid-column: 1/-1; padding: 10px;">Suche läuft...</p>';

    // Fetch API verwenden
    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Netzwerk-Antwort war nicht ok");
        }
        return response.json();
      })
      .then((dataArray) => {
        // Suchergebnisse leeren
        searchResults.innerHTML = "";

        // Array-Verwendung: Prüfen ob Ergebnisse vorhanden sind
        if (dataArray.length === 0) {
          searchResults.innerHTML = '<p style="grid-column: 1/-1; padding: 10px;">Keine Serien gefunden. Versuche es mit einem anderen Begriff.</p>';
          return;
        }

        // Durch das Ergebnis-Array iterieren und DOM-Nodes erzeugen
        dataArray.forEach((result) => {
          const show = result.show;

          // Karten-Container erstellen
          const card = document.createElement("div");
          card.classList.add("search-result-card");

          // Bild
          const img = document.createElement("img");
          img.src = show.image ? show.image.medium : "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=70";
          img.alt = show.name;
          card.appendChild(img);

          // Inhalt
          const content = document.createElement("div");
          content.classList.add("content");

          // Titel
          const title = document.createElement("h3");
          title.textContent = show.name;
          content.appendChild(title);

          // Genres (Array verarbeiten)
          const genres = document.createElement("span");
          genres.classList.add("genres");
          genres.textContent = show.genres && show.genres.length > 0 
            ? show.genres.join(", ") 
            : "Genre unbekannt";
          content.appendChild(genres);

          // Zusammenfassung (HTML-Tags entfernen und kürzen)
          const desc = document.createElement("p");
          const cleanDesc = show.summary 
            ? show.summary.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..." 
            : "Keine Beschreibung verfügbar.";
          desc.textContent = cleanDesc;
          content.appendChild(desc);

          // Hinzufügen-Button für die Watchlist
          const addBtn = document.createElement("button");
          addBtn.textContent = "Zur Watchlist";
          
          addBtn.addEventListener("click", () => {
            // Zur Watchlist hinzufügen (Name der Serie)
            watchlist.push(show.name);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));
            renderWatchlist();

            // Visuelles Feedback
            addBtn.textContent = "Hinzugefügt! ✔️";
            addBtn.disabled = true;
            addBtn.style.background = "#27ae60";

            setTimeout(() => {
              addBtn.textContent = "Zur Watchlist";
              addBtn.disabled = false;
              addBtn.style.background = "";
            }, 1500);
          });

          content.appendChild(addBtn);
          card.appendChild(content);
          searchResults.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Fehler bei der Seriensuche:", error);
        searchResults.innerHTML = '<p style="grid-column: 1/-1; padding: 10px; color: #c0392b;">Fehler beim Suchen. Bitte versuche es erneut.</p>';
      });
  }

  // Event-Listener für Seriensuche
  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Initiale Watchlist anzeigen
  renderWatchlist();
});
