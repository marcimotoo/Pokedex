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

function overlayTemplate(id, name, types, mainType, imageUrl) {
  return /*html*/ `
    <article class="overlay-card ${mainType}">
      <button onclick="toggleDialog()">Dialog schließen</button>
      ${overlayHeaderTemplate(id, name, types)}
      ${overlayImageTemplate(name, imageUrl)}
      ${overlayButtonsTemplate(id)}
      <div id="overlay_content"></div>
    </article>
  `;
}

function overlayHeaderTemplate(id, name, types) {
  return /*html*/ `
    <div class="pokemon-card-header">
      <h2>${formatName(name)}<span> #${id + 1}</span></h2>
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
      <button onclick="showOverlayMoves(${id})">Attacken</button>
    </div>
  `;
}

function evolutionTemplate(previousName, evolution) {
  return /*html*/ `
    <div class="evolution-item">
      <img src="${evolution.imageUrl}" alt="${evolution.germanName}" />
      <p>${previousName}${evolution.germanName}</p>
    </div>
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

function moveTemplate(move) {
  return /*html*/ `
    <p>${move.germanName}</p>
  `;
}
