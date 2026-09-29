const pokeApiUrl = 'https://pokeapi.co/api/v2/';
const pokemon = pokeApiUrl + 'pokemon/';
const pokeLocation = pokeApiUrl + 'location/';

const pokeApiUrlGerman = 'https://pokeapi.co/api/v2/language/6/';

async function getApiData() {
  let response = await fetch(pokemon);
  let responseAsJson = await response.json();
  console.log(responseAsJson.results);

  for (let pokeIndex = 0; pokeIndex < responseAsJson.results.length; pokeIndex++) {
    console.log(responseAsJson.results[pokeIndex].name);

    const pokemonCardsRef = document.getElementById('pokemon_card_content');
    pokemonCardsRef.innerHTML += pokemonCardsTemplate(responseAsJson, pokeIndex);
  }
}

// async function renderPokemonCards() {
// }
