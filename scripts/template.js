function pokemonCardsTemplate(JSON, names, types, mainType) {
  const imageUrl = getPokemonImage(JSON);
  return /*html*/ `
        <article class="pokemon-card ${mainType}">
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
