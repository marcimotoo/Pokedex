async function init() {
  setLoadingScreen(true);
  await loadPokemonList();

  await loadTypeNameData(0, pokemonLimit);
  currentPokemon = allPokemon.slice(0, pokemonLimit);
  await renderPokemon();
  setLoadingScreen(false);
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
  if (currentPokemon.length > 0) {
    pokemonCardsRef.innerHTML = cardsHTML;
  } else {
    pokemonCardsRef.innerHTML = '<li>Keine Pokémon gefunden.</li>';
  }
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
  if (filterName.length >= 3 || filterName === '') {
    currentPokemon = filterName === '' ? allPokemon.slice(0, pokemonLimit) : allPokemon.filter((pokemon) => matchesPokemon(pokemon, filterName));
    for (const pokemon of currentPokemon) {
      const id = allPokemon.indexOf(pokemon);
      await loadTypeNameData(id, id + 1);
    }
    await renderPokemon();
  }
}

function matchesPokemon(pokemon, filterName) {
  const pokemonNumber = Number(pokemon.url.split('/').filter(Boolean).pop());
  const matchesType = pokemon.types?.some((type) => type.name.includes(filterName) || type.germanName.toLowerCase().includes(filterName));
  return pokemonNumber === Number(filterName) || pokemon.name.includes(filterName) || pokemon.germanName?.includes(filterName) || matchesType;
}

async function loadMorePokemon() {
  const button = document.getElementById('more_pokemon');
  setLoadingScreen(true);
  button.disabled = true;
  await loadMore();
  button.disabled = false;
  setLoadingScreen(false);
}

async function loadMore() {
  const oldLimit = pokemonLimit;
  pokemonLimit = Math.min(pokemonLimit + 40, allPokemon.length);
  await loadTypeNameData(oldLimit, pokemonLimit);
  currentPokemon = allPokemon.slice(0, pokemonLimit);
  await renderPokemon();
}

async function showAllPokemon() {
  setLoadingScreen(true);
  await loadTypeNameData(0, allPokemon.length);
  pokemonLimit = allPokemon.length;
  currentPokemon = allPokemon.slice();
  await renderPokemon();
  setLoadingScreen(false);
}

function setLoadingScreen(isVisible) {
  document.getElementById('loading-screen').classList.toggle('d-none', !isVisible);
}

function getPokemonImage(pokemon) {
  return (
    pokemon.sprites.other.showdown.front_default ||
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.versions['generation-vii']['lets-go-pikachu-lets-go-eevee'].front_default ||
    pokemon.sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_default
  );
}

function formatName(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}
