function pokemonCardsTemplate(pokemonAsJson, pokemonTypesHTML, mainPokemonType) {
  const imageUrl = getPokemonImage(pokemonAsJson);
  return /*html*/ `
        <article class="pokemon-card ${mainPokemonType}">
          <div class="pokemon-card-header">
            <h2>${pokemonAsJson.name.charAt(0).toUpperCase() + pokemonAsJson.name.slice(1).replaceAll('-', ' ')}<span> #${pokemonAsJson.id}</span></h2>
          </div>
          <img class="pokemon-image" src="${imageUrl}" alt="${pokemonAsJson.name}" />
          <div class="types">
          ${pokemonTypesHTML}
          </div>
        </article>
    `;
}

function typeTemplate(type) {
  const typeLink = type.sprites['generation-viii']['sword-shield'].name_icon;
  return /*html*/ `
      <img src="${typeLink}" alt="">
  `;
}
