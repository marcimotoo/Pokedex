const pokeApiURL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/';
const pokemonSpecies = 'pokemon-species/';
const pokemonType = 'type/';
const pokemonAbility = 'ability/battle-armor/';

let pokemonMaxCount = '';
let allPokemon = [];
let currentPokemon = [];
let pokemonOffset = 0;
let pokemonLimit = 30;

async function init() {
  showLoadingScreen();
  await loadPokemonData();
  await renderPokemon();
  hideLoadingScreen();
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

  for (let i = 0; i < currentPokemon.length; i++) {
    const pokemonAsJson = await fetchUrl(currentPokemon[i].url);
    const pokemonTypesHTML = await renderTypes(pokemonAsJson);

    const mainPokemonType = pokemonAsJson.types[0].type.name;

    cardsHTML += pokemonCardsTemplate(pokemonAsJson, pokemonTypesHTML, mainPokemonType);
  }
  pokemonCardsRef.innerHTML = cardsHTML;
}

async function renderNames() {}

async function renderTypes(pokeJson) {
  let pokemonTypesHTML = '';
  for (let i = 0; i < pokeJson.types.length; i++) {
    const pokemonTypeAsJson = await fetchUrl(pokeJson.types[i].type.url);
    pokemonTypesHTML += typeTemplate(pokemonTypeAsJson);
  }
  return pokemonTypesHTML;
}

async function loadPokemonData() {
  const loadCurrentUrl = await fetchUrl(pokeApiURL + pokemon + `?offset=${pokemonOffset}&limit=${pokemonLimit}`);
  currentPokemon = loadCurrentUrl.results;

  const maxCount = await fetchUrl(pokeApiURL + pokemonSpecies);
  pokemonMaxCount = maxCount.count;

  const pokemonCountData = await fetchUrl(pokeApiURL + pokemon + '?limit=' + pokemonMaxCount);
  allPokemon = pokemonCountData.results;
}

function filterAndShowPokemon() {
  const filterName = document.getElementById('filter_input').value.trim().toLowerCase().replaceAll(' ', '-');
  currentPokemon = filterName === '' ? allPokemon.slice(0, pokemonLimit) : allPokemon.filter((pokemon) => pokemon.name.includes(filterName));

  renderPokemon();
}

function showLoadingScreen() {
  document.getElementById('loading-screen').classList.remove('d-none');
}
function hideLoadingScreen() {
  document.getElementById('loading-screen').classList.add('d-none');
}

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
