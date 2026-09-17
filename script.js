//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}



// create episode code of the season and the episode number
function makeEpisodeCode(season, episodeNumber){
  season = String(season).padStart(2,"0");
  episodeNumber = String(episodeNumber).padStart(2,"0");

  const code = "S" + season +"E" + episodeNumber ;
  return code;
} 
// create episode card to display all the episodes 
const template =document.getElementById("episode-card");

// render the episodes by cloning the template in the html and populating it with data
function createEpisodeCard(episode){
  const card =template.content.cloneNode(true);
  card.querySelector("h2").textContent = episode.name;

  const episodeNumber =makeEpisodeCode(episode.season,episode.number);
  card.querySelector("[data-episode-number]").textContent = episodeNumber;

  const image = card.querySelector("img");
  image.src = episode.image.medium;
  image.alt = `Scene from ${episodeNumber}, ${episode.name}`;

  card.querySelector("[data-summary]").innerHTML =episode.summary;

  return card;
}




// create all cards
function makePageForEpisodes(episodeList) {
  const cardContainer = document.getElementById("card-container");

  const episodeCards = episodeList.map(createEpisodeCard);

  cardContainer.append(...episodeCards);
}
window.onload = setup;
//