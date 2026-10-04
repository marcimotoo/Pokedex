function pokemonCardsTemplate(JSON, names, types, mainType, imageUrl) {
  return /*html*/ `
        <article onclick="toggleDialog(${JSON.id - 1})" class="pokemon-card ${mainType}">
          <div class="pokemon-card-header">
            <h2>${formatName(names)}<span> #${JSON.id}</span></h2>
            </div>
            <img class="pokemon-image" src="${imageUrl}" alt="${names}" />
            <div class="types">
              ${types}
            </div>
          </article>
          `;
}

function typeTemplate(types) {
  return /*html*/ `
    <p>${types}</p>
  `;
}

function overlayTemplate(id, name, types, mainType, imageUrl, pokemonId = id + 1) {
  return /*html*/ `
    <article class="overlay-card ${mainType}">
      <button onclick="toggleDialog()">Dialog schließen</button>
      ${overlayHeaderTemplate(pokemonId, name, types)}
      ${overlayImageTemplate(name, imageUrl)}
      ${overlayButtonsTemplate(id)}
      <div id="overlay_content"></div>
    </article>
  `;
}

function overlayHeaderTemplate(pokemonId, name, types) {
  return /*html*/ `
    <div class="pokemon-card-header">
      <h2>${formatName(name)}<span> #${pokemonId}</span></h2>
      <div class="types">${types}</div>
    </div>
  `;
}

function overlayImageTemplate(name, imageUrl) {
  return /*html*/ `
    <div class="overlay-image-container">
      <img class="overlay-image" src="${imageUrl}" alt="${name}" />
    </div>
  `;
}

function overlayButtonsTemplate(id) {
  return /*html*/ `
    <div class="overlay-buttons">
      <button onclick="showOverlayAbout(${id})">Über das Pokémon</button>
      <button onclick="showOverlayStats(${id})">Basiswerte</button>
      <button onclick="showOverlayEvolutions(${id})">Evolutionen</button>
    </div>
  `;
}

function evolutionTemplate(previousName, evolution) {
  return /*html*/ `
    <button type="button" class="evolution-item" onclick="openEvolution(${evolution.id})" aria-label="Details zu ${evolution.germanName} öffnen">
      <img src="${evolution.imageUrl}" alt="${evolution.germanName}" />
      <span>${previousName}${evolution.germanName}</span>
    </button>
  `;
}
function statsTemplate(stat) {
  return /*html*/ `
    <p>${stat.germanName}: ${stat.value}</p>
  `;
}

function aboutTemplate(about) {
  return /*html*/ `
    <p>${about.description}</p>
    <p>Größe: ${about.height} m</p>
    <p>Gewicht: ${about.weight} kg</p>
    <p>Geschlecht: ${getGenderText(about.genderRate)}</p>
  `;
}
