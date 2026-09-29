function pokemonCardsTemplate(responseAsJson, pokeIndex) {
  return /*html*/ `
        <article class="pokemon-card">
          <h2>${responseAsJson.results[pokeIndex].name}</h2>
          <img src="" alt="" />
        </article>
    `;
}
