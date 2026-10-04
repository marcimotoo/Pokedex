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
          <button onclick="toggleDialog()">dialog schließen</button>
          <div class="pokemon-card-header">
            <h2>${formatName(name)}<span> #${id + 1}</span></h2>
            <div class="types">${types}</div>
          </div>
          <div class="overlay-image-container">
          <img class="overlay-image" src="${imageUrl}" alt="${name}" />
          </div>
          <div>
            <button>about</button>
            <button onclick="showOverlayStats(${id})">Basis Werte</button>
            <button onclick="showOverlayEvolutions(${id})">Evolutionen</button>
            <button>Moves</button>
          </div>
          <div id="overlay_content"></div>
        </article>
  `;
}
