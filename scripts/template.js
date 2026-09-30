function pokemonCardsTemplate(pokeJson, pokeIndex, typesHTML) {
  return /*html*/ `
        <article class="pokemon-card">
          <h2>${pokeJson.name}</h2>
          <img src="${pokeJson.sprites.versions['generation-vii']['lets-go-pikachu-lets-go-eevee'].front_default}" alt="${pokeJson.name}" />
          <div class="types">
          ${typesHTML}
          </div>
        </article>
    `;
}

function typeTemplate(typeJson) {
  return /*html*/ `
      <img src="${typeJson.sprites['generation-viii']['sword-shield'].name_icon}" alt="">
  `;
}
