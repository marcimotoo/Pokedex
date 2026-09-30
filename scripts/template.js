function pokemonCardsTemplate(pokemonJson, pokeIndex, pokemonTypesHTML) {
  const imageUrl = getPokemonImage(pokemonJson);
  return /*html*/ `
        <article class="pokemon-card">
          <h2>${pokemonJson.name}</h2>
          <img class="pokemon-image" src="${imageUrl}" alt="${pokemonJson.name}" />
          <div class="types">
          ${pokemonTypesHTML}
          </div>
        </article>
    `;
}

function typeTemplate(pokemonTypeJson) {
  const typeLink = pokemonTypeJson.sprites['generation-viii']['sword-shield'].name_icon;
  return /*html*/ `
      <img src="${typeLink}" alt="">
  `;
}
