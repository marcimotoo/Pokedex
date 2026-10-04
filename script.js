let speciesCount = 0;
let pokemonLimit = 125;

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
    await loadStatsData(i);
    await loadEvolutionData(i);
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

async function loadStatsData(id) {
  const pokemonData = await fetchUrl(allPokemon[id].url);
  allPokemon[id].stats = [];
  for (const entry of pokemonData.stats) {
    const statData = await fetchUrl(entry.stat.url);
    const germanName = statData.names.find((entry) => entry.language.name === 'de');
    allPokemon[id].stats.push({ name: entry.stat.name, germanName: germanName?.name ?? entry.stat.name, value: entry.base_stat });
  }
}

async function loadEvolutionData(id) {
  const pokemonData = await fetchUrl(allPokemon[id].url);
  const speciesData = await fetchUrl(pokemonData.species.url);
  allPokemon[id].evolution = [];
  if (!speciesData.evolution_chain) return;
  const evolutionData = await fetchUrl(speciesData.evolution_chain.url);
  await loadEvolutionStage(id, evolutionData.chain);
}

async function loadEvolutionStage(id, entry) {
  const speciesData = await fetchUrl(entry.species.url);
  const germanName = speciesData.names.find((name) => name.language.name === 'de');
  allPokemon[id].evolution.push({
    id: speciesData.id,
    name: entry.species.name,
    germanName: germanName?.name ?? entry.species.name,
    evolvesFrom: speciesData.evolves_from_species?.name ?? null,
    details: entry.evolution_details,
  });
  for (const nextEvolution of entry.evolves_to) {
    await loadEvolutionStage(id, nextEvolution);
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
    const imageUrl = getPokemonImage(pokemonAsJson);

    cardsHTML += pokemonCardsTemplate(pokemonAsJson, names, types, mainType, imageUrl);
  }
  pokemonCardsRef.innerHTML = cardsHTML;
  setLoadingScreen(false);
}

async function getOverlay(id) {
  const dialogRef = document.getElementById('overlay_dialog');

  const name = allPokemon[id].germanName;
  const types = await getTypesHTML(allPokemon[id]);
  const mainType = allPokemon[id].types[0].name;
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
  return (
    pokemon.sprites.other.showdown.front_default ||
    pokemon.sprites.versions['generation-vii']['lets-go-pikachu-lets-go-eevee'].front_default ||
    pokemon.sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_default ||
    pokemon.sprites.other['official-artwork'].front_default
  );
}

function showOverlayStats(id) {
  const contentRef = document.getElementById('overlay_content');
  let statsHTML = '';
  for (const stat of allPokemon[id].stats) {
    statsHTML += `<p>${stat.germanName}: ${stat.value}</p>`;
  }
  contentRef.innerHTML = statsHTML;
}

function showOverlayEvolutions(id) {
  const contentRef = document.getElementById('overlay_content');
  const evolutions = allPokemon[id].evolution;
  let evolutionHTML = '';
  for (const evolution of evolutions) {
    const previous = evolutions.find((entry) => entry.name === evolution.evolvesFrom);
    const previousName = previous ? `${previous.germanName} → ` : '';
    evolutionHTML += `<p>${previousName}${evolution.germanName}</p>`;
  }
  contentRef.innerHTML = evolutionHTML;
}
