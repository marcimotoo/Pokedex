const pokemonApiURL = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonApiTypeUrl = 'https://pokeapi.co/api/v2/type/';
const pokemonSpeciesApiUrl = 'https://pokeapi.co/api/v2/pokemon-species/';

const cache = new Map();

let allPokemon = [];
let currentPokemon = [];
let speciesCount = 0;
let pokemonLimit = 10;

async function init() {
  setLoadingScreen(true);
  await loadPokemonList();
  await loadGermanNames(0, pokemonLimit);

  // await loadGermanTypes(0, pokemonLimit);
  currentPokemon = allPokemon.slice(0, pokemonLimit);
  await renderPokemon();
  setLoadingScreen(false);

  // loadGermanTypes(pokemonLimit, allPokemon.length);
  loadGermanNames(pokemonLimit, allPokemon.length);
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
  setLoadingScreen(true);
  let cardsHTML = '';

  for (let i = 0; i < currentPokemon.length; i++) {
    const pokemonAsJson = await fetchUrl(currentPokemon[i].url);
    const names = currentPokemon[i].germanName;

    const types = await getTypesHTML(pokemonAsJson);

    const mainType = pokemonAsJson.types[0].type.name;
    cardsHTML += pokemonCardsTemplate(pokemonAsJson, names, types, mainType);
  }
  pokemonCardsRef.innerHTML = cardsHTML;
  setLoadingScreen(false);
}

async function getOverlay(id) {
  const dialogRef = document.getElementById('overlay_dialog');

  const name = currentPokemon[id].germanName;

  dialogRef.innerHTML = overlayTemplate(id, name, types);
}

async function loadPokemonList() {
  const countData = await fetchUrl(pokemonSpeciesApiUrl + '?limit=1');
  speciesCount = countData.count;

  const pokemonList = await fetchUrl(pokemonApiURL + '?limit=' + speciesCount);
  allPokemon = pokemonList.results;
}

async function loadGermanNames(start, end) {
  for (let i = start; i < end; i++) {
    const pokemonData = await fetchUrl(pokemonApiURL + (i + 1));
    console.log(pokemonData);

    const germanName = await getGermanNames(pokemonData);
    allPokemon[i].germanName = germanName.name.toLowerCase();

    const filterName = document.getElementById('filter_input').value.trim().toLowerCase().replaceAll(' ', '-');
    if (filterName && allPokemon[i].germanName.includes(filterName)) {
      await filterAndShowPokemon();
    }
  }
}

async function getGermanNames(JSON) {
  const speciesUrl = JSON.species.url;
  const speciesJson = await fetchUrl(speciesUrl);
  const getGermanName = speciesJson.names.find((name) => name.language.name === 'de');

  return getGermanName;
}

async function loadGermanTypes(start, end) {
  for (let i = start; i < end; i++) {
    const pokemonTypeUrl = await fetchUrl(allPokemon[i].url); // todo links in einer funktion einmal fetchen um api zugriffe zu verringern
    console.log(pokemonTypeUrl);

    const type = pokemonTypeUrl[i].type;
    console.log(type);
    // const typeFetch = await fetchUrl(pokemonTypeUrl[i].type);

    const germanTyp = await getGermanNames(pokemonData);
    allPokemon[i].germanTyp = germanTyp.name.toLowerCase();

    // const filterName = document.getElementById('filter_input').value.trim().toLowerCase().replaceAll(' ', '-');
    // if (filterName && allPokemon[i].germanName.includes(filterName)) {
    //   await filterAndShowPokemon();
    // }
  }
  const germanTyp = typeJson.names.find((typeName) => typeName.language.name === 'de');
}

async function getTypesHTML(JSON) {
  let TypesHTML = '';
  console.log(JSON);
  for (let i = 0; i < JSON.types.length; i++) {
    const typeUrl = JSON.types[i].type.url;
    const typeJson = await fetchUrl(typeUrl);
    const germanTyp = typeJson.names.find((typeName) => typeName.language.name === 'de');
    TypesHTML += typeTemplate(germanTyp.name);
  }
  return TypesHTML;
}

async function filterAndShowPokemon() {
  const filterName = document.getElementById('filter_input').value.trim().toLowerCase().replaceAll(' ', '-');
  currentPokemon =
    filterName === ''
      ? allPokemon.slice(0, pokemonLimit)
      : allPokemon.filter((pokemon) => pokemon.name.includes(filterName) || pokemon.germanName?.includes(filterName));
  await renderPokemon();
}

async function loadMorePokemon() {
  const button = document.getElementById('more_pokemon');
  button.disabled = true;
  try {
    const oldLimit = pokemonLimit;
    pokemonLimit += 10;
    await loadGermanNames(oldLimit, pokemonLimit);
    currentPokemon = allPokemon.slice(0, pokemonLimit);
    await renderPokemon();
  } catch (error) {
    console.error('Pokémon konnten nicht geladen werden: ', error);
  } finally {
    button.disabled = false;
  }
}

function setLoadingScreen(isVisible) {
  document.getElementById('loading-screen').classList.toggle('d-none', !isVisible);
}

function formatName(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

function toggleDialog(id) {
  const dialogRef = document.getElementById('overlay_dialog');

  if (!dialogRef.open) {
    dialogRef.showModal();
    getOverlay(id);
  } else {
    dialogRef.close();
  }
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
