const pokeApiMainURL = 'https://pokeapi.co/api/v2/';
const pokemonSpeciesURL = pokeApiMainURL + 'pokemon-species/';
const pokemonURL = pokeApiMainURL + 'pokemon/';
const pokemonTypeURL = pokeApiMainURL + 'type/';
const pokemonAbilityURL = pokeApiMainURL + 'ability/battle-armor/';

let maxPokemonCount = '';
let allPokemon = [];
let currentPokemon = [];
let filterPokemon = [];
let pokemonOffset = 0;
let pokemonLimit = 40;

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

async function renderNames() {}

async function renderTypes(pokeJson) {
  let pokemonTypesHTML = '';
  for (let pokemonTypeId = 0; pokemonTypeId < pokeJson.types.length; pokemonTypeId++) {
    const pokemonTypeAsJson = await fetchUrl(pokeJson.types[pokemonTypeId].type.url);
    pokemonTypesHTML += typeTemplate(pokemonTypeAsJson);
  }
  return pokemonTypesHTML;
}

async function loadCurrentPokemon() {
  const loadBaseUrl = await fetchUrl(pokemonSpeciesURL + `?offset=${pokemonOffset}&limit=${pokemonLimit}`);
  currentPokemon = loadBaseUrl.results;
}

async function loadAllPokemon() {
  const loadBaseUrl = await fetchUrl(pokemonSpeciesURL);
  maxPokemonCount = loadBaseUrl.count;

  const allPokemonData = await fetchUrl(pokemonSpeciesURL + '?limit=' + maxPokemonCount);
  allPokemon = allPokemonData.results;
  filterPokemon = allPokemon;
}

// function inputFilterName() {
//   const filterName = document.getElementById('filter_input').value.trim().toLowerCase();
//   filterAndShowPokemon(filterName);
// }

function filterAndShowPokemon() {
  const filterName = document.getElementById('filter_input').value.trim().toLowerCase().replaceAll(' ', '-');
  currentPokemon = allPokemon.filter((pokemon) => pokemon.name.includes(filterName));
  console.log(currentPokemon);

  renderPokemon();
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
