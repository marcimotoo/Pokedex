const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/';
const pokeLocation = pokeApiUrl + 'location/';

const pokeApiUrlGerman = 'https://pokeapi.co/api/v2/language/6/';

function init() {
  getApiData();
}

async function getApiData() {
  let response = await fetch(pokeApiUrl);
  let responseAsJson = await response.json();
  renderPokeApiData(responseAsJson);
}

async function renderPokeApiData(responseAsJson) {
  const pokemonCardsRef = document.getElementById('pokemon_card_content');
  let cardsHTML = '';
  for (let pokeIndex = 0; pokeIndex < responseAsJson.results.length; pokeIndex++) {
    const pokeURL = responseAsJson.results[pokeIndex].url;
    const response = await fetch(pokeURL);
    const pokeJson = await response.json();
    const typesHTML = await renderTypes(pokeJson);

    cardsHTML += pokemonCardsTemplate(pokeJson, pokeIndex, typesHTML);
  }
  pokemonCardsRef.innerHTML = cardsHTML;
}

async function renderTypes(pokeJson) {
  let typesHTML = '';
  for (let typeIndex = 0; typeIndex < pokeJson.types.length; typeIndex++) {
    const typeURL = pokeJson.types[typeIndex].type.url;
    const response = await fetch(typeURL);
    const typeJson = await response.json();

    typesHTML += typeTemplate(typeJson);
  }
  return typesHTML;
}

// async function renderPokemonCards() {
// }
