
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonInfoByName = (pokemonName) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Não foi possível obter informações do Pokémon.');
            }
            return response.json();
        })
        .then((pokemonData) => {
            // Obtenha o número, nome e tipos do Pokémon
            const number = pokemonData.id;
            const name = pokemonData.name;
            const types = pokemonData.types.map((typeInfo) => typeInfo.type.name);

            // Obtenha a URL da foto do Pokémon
            const photo = pokemonData.sprites.other.dream_world.front_default;

            // Obtenha altura e largura do Pokémon
            const height = pokemonData.height;
            const weight = pokemonData.weight;

            // Obtenha as habilidades do Pokémon
            const abilities = pokemonData.abilities.map((abilityInfo) => abilityInfo.ability.name);

            // Obtenha o nome da espécie
            const speciesUrl = pokemonData.species.url;
            return fetch(speciesUrl)
                .then((response) => response.json())
                .then((speciesData) => {
                    const speciesName = speciesData.name;

                    // Crie uma instância da classe Pokemon com todas as informações
                    const pokemon = new Pokemon(
                        number,
                        name,
                        types,
                        photo,
                        height,
                        weight,
                        abilities,
                        speciesName
                    );

                    return pokemon;
                });
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
};


// pokeApi.getPokemon = (pokemonName) => {
//     const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`

//     return fetch(url)
//     .then((response) => response.json())
//     .then((jsonBody) => jsonBody.species.url)
//     .then((speciesData ) => speciesData.json())
//     .then((detailRequests) => Promise.all(detailRequests))
//     .then((pokemonsDetails) => pokemonsDetails)
// }