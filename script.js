const pokeApiURL = 'https://pokeapi.co/api/v2/pokemon/';

let maxPokemonCount = '';
let allPokemon = [];
let currentPokemon = [];

async function init() {
  await loadAllPokemon();
  await loadCurrentPokemon();
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
  const pokemonCardsRef = document.getElementById('pokemon_card_content');
  let cardsHTML = '';

  for (let pokemonId = 0; pokemonId < currentPokemon.length; pokemonId++) {
    const pokemonAsJson = await fetchUrl(currentPokemon[pokemonId].url);
    const pokemonTypesHTML = await renderTypes(pokemonAsJson);
    const mainPokemonType = pokemonAsJson.types[0].type.name;

    cardsHTML += pokemonCardsTemplate(pokemonAsJson, pokemonTypesHTML, mainPokemonType);
  }

  pokemonCardsRef.innerHTML = cardsHTML;
}

async function renderTypes(pokeJson) {
  let pokemonTypesHTML = '';

  for (let pokemonTypeId = 0; pokemonTypeId < pokeJson.types.length; pokemonTypeId++) {
    const pokemonTypeAsJson = await fetchUrl(pokeJson.types[pokemonTypeId].type.url);
    pokemonTypesHTML += typeTemplate(pokemonTypeAsJson);
  }

  return pokemonTypesHTML;
}

async function loadCurrentPokemon() {
  const loadBaseUrl = await fetchUrl(pokeApiURL);
  currentPokemon = loadBaseUrl.results;
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
