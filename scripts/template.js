function pokemonCardsTemplate(JSON, names, types, mainType) {
  const imageUrl = getPokemonImage(JSON);

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

function overlayTemplate(id, name, types, mainType) {
  return /*html*/ `
    <article class="overlay-card ${mainType}">
          <button onclick="toggleDialog()">dialog schließen</button>
          <div class="pokemon-card-header">
            <h2>${formatName(name)}<span> #${id + 1}</span></h2>
            <div class="types">${types}</div>
          </div>
          <img class="overlay-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif" alt="name" />
          <div>
            <button>about</button>
            <button>Basis Werte</button>
            <button>Evolutionen</button>
            <button>Moves</button>
          </div>
        </article>
  `;
}
