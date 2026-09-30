const pokeApiURL = 'https://pokeapi.co/api/v2/pokemon/';

let maxPokemonCount = '';
let allPokemon = [];
let currentPokemon = [];

async function init() {
  await loadAllPokemon();

  await renderPokemon();
}

async function fetchUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Fehler beim Laden der Daten');
  }

  return await response.json();
}

async function renderPokemon() {
  const pokemon = await fetchUrl(pokeApiURL);
  console.log(pokemon);

  const pokemonCardsRef = document.getElementById('pokemon_card_content');
  let cardsHTML = '';

  for (let pokeIndex = 0; pokeIndex < pokemon.results.length; pokeIndex++) {
    const pokemonURL = pokemon.results[pokeIndex].url;
    const pokemonJson = await fetchUrl(pokemonURL);

    const pokemonTypesHTML = await renderTypes(pokemonJson);

    cardsHTML += pokemonCardsTemplate(pokemonJson, pokeIndex, pokemonTypesHTML);
  }
  pokemonCardsRef.innerHTML = cardsHTML;
}

async function renderTypes(pokeJson) {
  let pokemonTypesHTML = '';
  for (let typeIndex = 0; typeIndex < pokeJson.types.length; typeIndex++) {
    const typeURL = pokeJson.types[typeIndex].type.url;
    const pokemonTypeJson = await fetchUrl(typeURL);

    pokemonTypesHTML += typeTemplate(pokemonTypeJson);
  }
  return pokemonTypesHTML;
}

async function loadAllPokemon() {
  const loadBaseUrl = await fetchUrl(pokeApiURL);
  maxPokemonCount = loadBaseUrl.count;

  const allPokemonData = await fetchUrl(pokeApiURL + '?limit=' + maxPokemonCount);
  allPokemon = allPokemonData.results;
}

// image

function getPokemonImage(pokemon) {
  const speciesId = pokemon.species.url.split('/').filter(Boolean).pop();

  const basePokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`;

  return (
    pokemon.sprites.other.showdown.front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default ||
    basePokemonImage
  );
}
