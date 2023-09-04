const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const contentPokemon = document.getElementsByClassName('content')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

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

function convertPokemonToDi(pokemon) {
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
  const clickedPokemon = event.target.closest('.pokemon');
  if (clickedPokemon) {
      // Obtenha o nome do Pokémon clicado
      const pokemonName = clickedPokemon.querySelector('.name').textContent;

      // Oculte a seção de conteúdo
      const contentSection = document.querySelector('.content');
      contentSection.style.display = 'none';
      
      // Obtenha os detalhes do Pokémon pelo nome
      pokeApi.getPokemonInfoByName(pokemonName).then((pokemon) => {
          // Crie a div gerada pelo convertPokemonToDi
          console.log(pokemon);
          const pokemonDetailsDiv = document.createElement('div');
          pokemonDetailsDiv.innerHTML = convertPokemonToDi(pokemon);
          
          // Adicione a div à nova tela ou ao elemento em tela cheia
          // Neste exemplo, estamos adicionando à tela cheia
          document.body.appendChild(pokemonDetailsDiv);
      });
  }
});






