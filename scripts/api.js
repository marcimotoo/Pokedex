const pokemonApiURL = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonApiTypeUrl = 'https://pokeapi.co/api/v2/type/';
const pokemonSpeciesApiUrl = 'https://pokeapi.co/api/v2/pokemon-species/';

let allPokemon = [];
let currentPokemon = [];

const cache = new Map();

let speciesCount = 0;
let pokemonLimit = 125;

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
    allPokemon[i].dataLoaded = true;
  }
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

async function loadNameData(id) {
  const pokemonData = await fetchUrl(allPokemon[id].url);
  const speciesData = await fetchUrl(pokemonData.species.url);

  const germanName = speciesData.names.find((entry) => entry.language.name === 'de');

  allPokemon[id].germanName = (germanName?.name ?? pokemonData.name).toLowerCase();
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

async function loadEvolutionImages(id) {
  for (const evolution of allPokemon[id].evolution) {
    if (evolution.imageUrl) continue;
    const speciesData = await fetchUrl(pokemonSpeciesApiUrl + evolution.id + '/');
    const variety = speciesData.varieties.find((entry) => entry.is_default);
    const pokemonData = await fetchUrl(variety.pokemon.url);
    evolution.imageUrl = getPokemonImage(pokemonData);
  }
}

async function loadAboutData(id) {
  const pokemonData = await fetchUrl(allPokemon[id].url);
  const speciesData = await fetchUrl(pokemonData.species.url);
  const description = speciesData.flavor_text_entries.find((entry) => entry.language.name === 'de');
  allPokemon[id].about = {
    height: pokemonData.height / 10,
    weight: pokemonData.weight / 10,
    genderRate: speciesData.gender_rate,
    description: description?.flavor_text.replace(/\s+/g, ' ') ?? 'Keine deutsche Beschreibung verfügbar.',
  };
}

function getPokemonIndex(pokemon) {
  let id = allPokemon.findIndex((entry) => entry.url === pokemon.url);
  if (id === -1) {
    allPokemon.push({ name: pokemon.name, url: pokemon.url });
    id = allPokemon.length - 1;
  }
  return id;
}
