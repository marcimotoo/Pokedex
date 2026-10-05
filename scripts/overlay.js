function toggleDialog(id) {
  const dialogRef = document.getElementById('overlay_dialog');
  if (!dialogRef.open) {
    dialogRef.showModal();
    getOverlay(id);
  } else {
    dialogRef.close();
  }
}

async function getOverlay(id) {
  const dialogRef = document.getElementById('overlay_dialog');

  const name = allPokemon[id].germanName;
  const types = await getTypesHTML(allPokemon[id]);
  const mainType = allPokemon[id].types[0].name;
  const pokemonData = await fetchUrl(allPokemon[id].url);
  const imageUrl = getPokemonImage(pokemonData);

  dialogRef.innerHTML = overlayTemplate(id, name, types, mainType, imageUrl, pokemonData.id);
  await showOverlayAbout(id);
}

async function showOverlayAbout(id) {
  const contentRef = getOverlayContent('about');
  contentRef.textContent = 'Informationen werden geladen…';
  await loadAboutData(id);
  if (!contentRef.isConnected || contentRef.dataset.tab !== 'about') return;
  contentRef.innerHTML = aboutTemplate(allPokemon[id].about);
}

function getGenderText(rate) {
  if (rate === -1) return 'Geschlechtslos';
  const female = (rate / 8) * 100;
  return `${female} % weiblich, ${100 - female} % männlich`;
}

function showOverlayStats(id) {
  const contentRef = getOverlayContent('stats');
  let statsHTML = '';
  for (const stat of allPokemon[id].stats) {
    statsHTML += statsTemplate(stat);
  }
  contentRef.innerHTML = statsHTML;
}

async function showOverlayEvolutions(id) {
  const contentRef = getOverlayContent('evolutions');
  contentRef.textContent = 'Entwicklungen werden geladen…';
  await loadEvolutionImages(id);
  if (!contentRef.isConnected || contentRef.dataset.tab !== 'evolutions') return;
  const evolutions = allPokemon[id].evolution;
  let evolutionHTML = '';
  for (const evolution of evolutions) {
    const previous = evolutions.find((entry) => entry.name === evolution.evolvesFrom);
    const previousName = previous ? `${previous.germanName} → ` : '';
    evolutionHTML += evolutionTemplate(previousName, evolution);
  }
  contentRef.innerHTML = evolutionHTML;
}

async function openEvolution(speciesId) {
  const contentRef = getOverlayContent('evolution-details');
  contentRef.textContent = 'Pokémon wird geladen…';
  const speciesData = await fetchUrl(pokemonSpeciesApiUrl + speciesId + '/');
  const variety = speciesData.varieties.find((entry) => entry.is_default);
  const id = getPokemonIndex(variety.pokemon);
  if (!allPokemon[id].dataLoaded) {
    await loadAllData(id, id + 1);
  }
  if (!contentRef.isConnected || contentRef.dataset.tab !== 'evolution-details') return;
  await getOverlay(id);
}

function getOverlayContent(tab) {
  const contentRef = document.getElementById('overlay_content');
  contentRef.dataset.tab = tab;
  return contentRef;
}
