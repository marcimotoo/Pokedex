const pokeApiUrl = 'https://pokeapi.co/api/v2/';
const pokemon = pokeApiUrl + 'pokemon/';
const pokeLocation = pokeApiUrl + 'location/';

const pokeApiUrlGerman = 'https://pokeapi.co/api/v2/language/6/';

async function getApiData() {
  let response = await fetch(pokeApiUrl);
  let responseAsJson = await response.json();
  renderPokemonCards();
  console.log(responseAsJson);
}

function renderPokemonCards() {
  const pokemonCardsRef = document.getElementById('pokemon_card_content');

  pokemonCardsRef.innerHTML += pokemonCardsTemplate();
}
