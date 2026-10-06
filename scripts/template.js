// Cards Template

function pokemonCardsTemplate(JSON, names, types, mainType, imageUrl) {
  return /*html*/ `
  <li>
  <button class="pokemon-card-button ${mainType}" aria-label="Details zu ${formatName(names)} öffnen" onclick="toggleDialog(${JSON.id - 1}); document.body.style.overflow = 'hidden';">
    <div class="pokemon-card"> 
      <div class="pokemon-card-header">
        <h2>${formatName(names)}<span> #${JSON.id}</span></h2>
      </div>
      <img class="pokemon-image" src="${imageUrl}" alt="${names}" />
      <div class="types">
        ${types}
      </div>
    </div>
  </button>
  </li>
          `;
}

function typeTemplate(types) {
  return /*html*/ `
    <p class="type-text ${types.name}-strong">${types.germanName}</p>
  `;
}

// Overlay Template

function overlayTemplate(id, name, types, mainType, imageUrl, pokemonId = id + 1) {
  const index = currentPokemon.indexOf(allPokemon[id]);
  return /*html*/ `
    <article class="overlay-card ${mainType}">
      <button class="overlay-close" aria-label="Dialog schließen" onclick="toggleDialog()">&times;</button>
      <div class="pokemon-card-header">
        <h2>${formatName(name)}<span> #${pokemonId}</span></h2>
        <div class="types">${types}</div>
      </div>
      <div class="overlay-image-region">
        <div class="overlay-image-container">
          <img class="overlay-image" src="${imageUrl}" alt="${name}" />
        </div>
        <div class="overlay-navigation">
          <button onclick="changeOverlay(${id}, -1)" ${index <= 0 ? 'disabled' : ''} aria-label="Vorheriges Pokémon">&lt;</button>
          <button onclick="changeOverlay(${id}, 1)" ${index < 0 || index >= currentPokemon.length - 1 ? 'disabled' : ''} aria-label="Nächstes Pokémon">&gt;</button>
        </div>
      </div>
      <div class="overlay-buttons">
        <button data-tab="about" aria-pressed="false" aria-label="Informationen zum Pokémon anzeigen" onclick="showOverlayAbout(${id})">Über das Pokémon</button>
        <button data-tab="stats" aria-pressed="false" aria-label="Basiswerte des Pokémon anzeigen" onclick="showOverlayStats(${id})">Basiswerte</button>
        <button data-tab="evolutions" aria-pressed="false" aria-label="Evolutionen des Pokémon anzeigen" onclick="showOverlayEvolutions(${id})">Evolutionen</button>
      </div>
      <div id="overlay_content"></div>
    </article>
  `;
}

function aboutTemplate(about) {
  return /*html*/ `
    <p><strong>Beschreibung</strong><br />${about.description}</p>
    <p><strong>Größe:</strong> ${about.height} m</p>
    <p><strong>Gewicht:</strong> ${about.weight} kg</p>
    <p><strong>Geschlecht:</strong> ${getGenderText(about.genderRate)}</p>
  `;
}

function statsTemplate(stat) {
  return /*html*/ `
    <p>
      <strong>${stat.germanName}:</strong> ${stat.value}
      <span class="stat-bar" aria-hidden="true">
        <span class="stat-fill" style="width: ${(stat.value / 255) * 100}%"></span>
      </span>
    </p>
  `;
}

function evolutionTemplate(previousName, evolution) {
  return /*html*/ `
    <button type="button" class="evolution-item" onclick="openEvolution(${evolution.id})" aria-label="Details zu ${evolution.germanName} öffnen">
      <img src="${evolution.imageUrl}" alt="${evolution.germanName}" />
      <span>${previousName}<strong>${evolution.germanName}</strong></span>
    </button>
  `;
}
