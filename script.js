const pokeApiURL = 'https://pokeapi.co/api/v2/';
const cache = new Map();

let allPokemon = [];
let currentPokemon = [];
let pokemonMaxCount = 0;
let pokemonLimit = 10;

async function init() {
  showLoadingScreen();
  await loadPokemonData();
  await renderPokemon();
  hideLoadingScreen();
}

async function fetchUrl(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Fehler beim Laden der Daten');
  }
  const data = await response.json();
  cache.set(url, data);
  return data;
}

async function renderPokemon() {
  const pokemonCardsRef = document.getElementById('pokemon_card_content');
  let cardsHTML = '';
  for (let i = 0; i < currentPokemon.length; i++) {
    const pokemonAsJson = await fetchUrl(currentPokemon[i].url);
    const names = await getNames(pokemonAsJson);
    currentPokemon[i].germanName = names.name.toLowerCase();
    console.log(currentPokemon);

    const types = await getTypesHTML(pokemonAsJson);
    const mainType = pokemonAsJson.types[0].type.name;
    cardsHTML += pokemonCardsTemplate(pokemonAsJson, names, types, mainType);
  }
  pokemonCardsRef.innerHTML = cardsHTML;
}

async function getNames(JSON) {
  const speciesUrl = JSON.species.url;
  const speciesJson = await fetchUrl(speciesUrl);
  const germanName = speciesJson.names.find((name) => name.language.name === 'de');
  return germanName;
}

async function getTypesHTML(JSON) {
  let TypesHTML = '';
  for (let i = 0; i < JSON.types.length; i++) {
    const typeUrl = JSON.types[i].type.url;
    const typeJson = await fetchUrl(typeUrl);
    const germanTyp = typeJson.names.find((typeName) => typeName.language.name === 'de');
    TypesHTML += typeTemplate(germanTyp.name);
  }
  return TypesHTML;
}

async function loadPokemonData() {
  const maxCount = await fetchUrl(pokeApiURL + 'pokemon-species?limit=1');
  pokemonMaxCount = maxCount.count;

  const pokemonCountData = await fetchUrl(pokeApiURL + 'pokemon/?limit=' + pokemonMaxCount);
  allPokemon = pokemonCountData.results;

  currentPokemon = allPokemon.slice(0, pokemonLimit);
}

function filterAndShowPokemon() {
  const filterName = document.getElementById('filter_input').value.trim().toLowerCase().replaceAll(' ', '-');
  currentPokemon =
    filterName === ''
      ? allPokemon.slice(0, pokemonLimit)
      : allPokemon.filter((pokemon) => pokemon.name.includes(filterName) || pokemon.germanName.includes(filterName));
  renderPokemon();
}

function loadMorePokemon() {
  const button = document.getElementById('more_pokemon');
  button.disabled = true;
  try {
    pokemonLimit = pokemonLimit + 10;
    currentPokemon = allPokemon.slice(0, pokemonLimit);
    renderPokemon();
  } catch (error) {
    console.error('Pokémon konnten nicht geladen werden: ', error);
  } finally {
    button.disabled = false;
  }
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
