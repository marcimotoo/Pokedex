async function init() {
  setLoadingScreen(true);
  await loadPokemonList();

  await loadAllData(0, pokemonLimit);
  currentPokemon = allPokemon.slice(0, pokemonLimit);
  await renderPokemon();
  setLoadingScreen(false);

  loadAllData(pokemonLimit, allPokemon.length);
}

// TODO: Überarbeiten – 17 Zeilen; auf höchstens 14 Zeilen pro Funktion aufteilen.
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

async function getTypesHTML(JSON) {
  let TypesHTML = '';
  for (const type of JSON.types) {
    TypesHTML += typeTemplate(type);
  }
  return TypesHTML;
}

async function filterAndShowPokemon() {
  const filterName = document.getElementById('filter_input').value.trim().toLowerCase().replaceAll(' ', '-');
  currentPokemon = filterName === '' ? allPokemon.slice(0, pokemonLimit) : allPokemon.filter((pokemon) => matchesPokemon(pokemon, filterName));
  for (const pokemon of currentPokemon) {
    if (!pokemon.dataLoaded) {
      const id = allPokemon.indexOf(pokemon);
      await loadAllData(id, id + 1);
    }
  }
  await renderPokemon();
}

function matchesPokemon(pokemon, filterName) {
  const pokemonNumber = Number(pokemon.url.split('/').filter(Boolean).pop());
  const matchesType = pokemon.types?.some((type) => type.name.includes(filterName) || type.germanName.toLowerCase().includes(filterName));
  return pokemonNumber === Number(filterName) || pokemon.name.includes(filterName) || pokemon.germanName?.includes(filterName) || matchesType;
}

// TODO: Überarbeiten – 18 Zeilen; auf höchstens 14 Zeilen pro Funktion aufteilen.
async function loadMorePokemon() {
  const button = document.getElementById('more_pokemon');
  button.disabled = true;
  try {
    const oldLimit = pokemonLimit;
    pokemonLimit += 10;
    if (pokemonLimit > allPokemon.length) {
      pokemonLimit = allPokemon.length;
    }
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

function getPokemonImage(pokemon) {
  return (
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.other.showdown.front_default ||
    pokemon.sprites.versions['generation-vii']['lets-go-pikachu-lets-go-eevee'].front_default ||
    pokemon.sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_default
  );
}

function formatName(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}
