let speciesCount = 0;
let pokemonLimit = 10;

async function init() {
  setLoadingScreen(true);
  await loadPokemonList();

  await loadAllData(0, pokemonLimit);
  // await loadGermanTypes(0, pokemonLimit);
  currentPokemon = allPokemon.slice(0, pokemonLimit);
  await renderPokemon();
  setLoadingScreen(false);
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

async function loadPokemonList() {
  const countData = await fetchUrl(pokemonSpeciesApiUrl + '?limit=1');
  speciesCount = countData.count;

  const pokemonList = await fetchUrl(pokemonApiURL + '?limit=' + speciesCount);
  allPokemon = pokemonList.results;
}

async function loadAllData(start, end) {
  for (let i = start; i < end; i++) {
    await loadTypeData(i);
    await loadNameData(i);
  }
}

async function loadNameData(id) {
  const pokemonData = await fetchUrl(allPokemon[id].url);
  const speciesData = await fetchUrl(pokemonData.species.url);

  const germanName = speciesData.names.find((entry) => entry.language.name === 'de');

  allPokemon[id].germanName = (germanName?.name ?? pokemonData.name).toLowerCase();
}

async function loadTypeData(id) {
  const pokemonData = await fetchUrl(allPokemon[id].url);
  allPokemon[id].types = [];

  for (const entry of pokemonData.types) {
    const typeData = await fetchUrl(entry.type.url);
    const germanName = typeData.names.find((entry) => entry.language.name === 'de');

    allPokemon[id].types.push({ name: entry.type.name, germanName: germanName?.name ?? entry.type.name });
  }
}

async function getTypesHTML(JSON) {
  let TypesHTML = '';
  for (const type of JSON.types) {
    TypesHTML += typeTemplate(type.germanName);
  }
  return TypesHTML;
}

async function renderPokemon() {
  const pokemonCardsRef = document.getElementById('pokemon_card_content');
  setLoadingScreen(true);
  let cardsHTML = '';

  for (let i = 0; i < currentPokemon.length; i++) {
    const pokemonAsJson = await fetchUrl(currentPokemon[i].url);
    const names = currentPokemon[i].germanName;
    const types = await getTypesHTML(currentPokemon[i]);
    const mainType = currentPokemon[i].types[0].name;

    cardsHTML += pokemonCardsTemplate(pokemonAsJson, names, types, mainType);
  }
  pokemonCardsRef.innerHTML = cardsHTML;
  setLoadingScreen(false);
}

async function getOverlay(id) {
  const dialogRef = document.getElementById('overlay_dialog');

  const name = allPokemon[id].germanName;
  const types = await getTypesHTML(allPokemon[id]);
  const mainType = allPokemon[id].types[0].typ;
  console.log(mainType);

  const pokemonData = await fetchUrl(allPokemon[id].url);
  const imageUrl = getPokemonImage(pokemonData);

  dialogRef.innerHTML = overlayTemplate(id, name, types, mainType, imageUrl);
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
    await loadAllData(oldLimit, pokemonLimit);
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
