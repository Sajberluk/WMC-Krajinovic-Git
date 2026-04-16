import persons from "./persons.json" with { type: "json" };
console.log(persons);

// "id": 6,
// "name": "Sophie Dubois",
// "groesse": 168,
// "geburtsdatum": "1994-03-10",
// "herkunft": "Frankreich",
// "gewicht": 59.5 -->

let currentSort = {
    key: null,
    asc: true
};

function renderPersons() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
    for (const person of persons) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${person.id}</td>
            <td>${person.name}</td>
            <td>${person.groesse}</td>
            <td>${person.geburtsdatum}</td>
            <td>${person.herkunft}</td>
            <td>${person.gewicht}</td>
        `;
        tbody.appendChild(tr);
    }
}

const headers = document.querySelectorAll("thead th");
headers.forEach(th => {
    th.addEventListener("click", () => {
        const key = th.dataset.key;
        
        if (currentSort.key === key) {
            currentSort.asc = !currentSort.asc;
        } else {
            currentSort.key = key;
            currentSort.asc = true;
        }

        // Update UI classes
        headers.forEach(header => {
            header.classList.remove("asc", "desc");
        });
        th.classList.add(currentSort.asc ? "asc" : "desc");

        persons.sort((a, b) => {
            const valA = a[key];
            const valB = b[key];

            let comparison = 0;
            if (typeof valA === "string" && typeof valB === "string") {
                comparison = valA.localeCompare(valB);
            } else {
                comparison = valA - valB;
            }

            return currentSort.asc ? comparison : -comparison;
        });

        renderPersons();
    });
});

window.renderPersons = renderPersons;
renderPersons();
