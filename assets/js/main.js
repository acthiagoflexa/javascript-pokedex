const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const contentPokemon = document.querySelector('.main'); // Use querySelector para obter a primeira seção com a classe "content"
const content = document.querySelector('.content'); // Use querySelector para obter a primeira seção com a classe "content"
let currentSection = null;

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name ${pokemon.name}">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertPokemonToDi(pokemon, id) {
    return `
    <section class="content ${pokemon.types[0]}" >
    <header class="detailsHeader">
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
      <i class="fa fa-heart"></i>
    </header>
    <div class="detailsPokemon">
      <h1 class="name">${pokemon.name}</h1>
      <p class="number">#${pokemon.number}</p>
    </div>
    <div class="detail">
      <ol class="abilitys">
        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
      </ol>
    </div>
    <img class="buba" src="${pokemon.photo}" alt="${pokemon.name}" />
    <div class="abilitysContent">
      <ul class="menu">
        <li class="folder">
          About
          <ul class="subFolder">
            <li>Tipo</li>
            <li>Altura</li>
            <li>Lala</li>
            <li>Papa</li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        console.log(newHtml)
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    } 
})

document.addEventListener('click', (event) => {
  const target = event.target;

  // Verifique se o alvo do clique é um Pokémon ou seu nome
  const pokemon = target.closest('.pokemon');
  const name = target.closest('.name');

  if (pokemon || name) {
    // Obtenha o nome do Pokémon clicado
    const clickedPokemon = pokemon || name;
    const pokemonName = clickedPokemon.querySelector('.name').textContent;

    // Obtenha os detalhes do Pokémon pelo nome
    pokeApi.getPokemonInfoByName(pokemonName).then((pokemon) => {
      // Crie a div gerada pelo convertPokemonToDi
      const pokemonDetailsDiv = document.createElement('div');
      pokemonDetailsDiv.innerHTML = convertPokemonToDi(pokemon);

      // Adicione a div à nova tela ou ao elemento em tela cheia
      // Neste exemplo, estamos adicionando à body
      document.body.appendChild(pokemonDetailsDiv);

      // Atribua a nova seção à variável currentPokemonDetails
      currentPokemonDetails = pokemonDetailsDiv;

      // Ocultar a seção de conteúdo
      contentPokemon.style.display = 'none';
    });
  } else if (target.classList.contains('fa-arrow-left') && currentPokemonDetails) {
    // Remova a seção de detalhes do Pokémon
    currentPokemonDetails.remove();
    currentPokemonDetails = null;

    // Mostrar novamente a seção de conteúdo ao voltar
    contentPokemon.style.display = 'block';
  }
});





