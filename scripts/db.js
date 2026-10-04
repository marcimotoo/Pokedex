const pokemonApiURL = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonApiTypeUrl = 'https://pokeapi.co/api/v2/type/';
const pokemonSpeciesApiUrl = 'https://pokeapi.co/api/v2/pokemon-species/';

let allPokemon = [];
let currentPokemon = [];

const cache = new Map();
