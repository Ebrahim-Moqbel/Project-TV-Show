//You can edit ALL of the code here
let allEpisodes;
const endPoint="https://api.tvmaze.com/shows/82/episodes"
async function fetchEpisodes() {
  const response = await fetch(endPoint);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return await response.json();
}

async function setup() {
  // show the user to wait for the data
  showLoadingMessage()
  try{
    allEpisodes = await fetchEpisodes();
    makePageForEpisodes(allEpisodes);
  } catch(error){
    showErrorMessage()
  }
  
}
function showLoadingMessage(){
  document.getElementById("card-container").innerHTML =
  "<p>loading episodes, please wait...<p>"
}
function showErrorMessage() {
  document.getElementById("card-container").innerHTML =
    "<p>Sorry, something went wrong loading the episodes. Please try again later.</p>";
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

  // cleared the existing cards
  cardContainer.innerHTML ="";

  // create new filtered cards from he search result
  const episodeCards = episodeList.map(createEpisodeCard);

  cardContainer.append(...episodeCards);

  // update the count of displayed episodes
  const countDisplay =document.getElementById('count-result');
  countDisplay.textContent = `${episodeList.length}/${allEpisodes.length}`;

}
// build the search functionality 
const searchInput = document.getElementById("search");
searchInput.addEventListener("input",(event) =>{
  const searchValue = event.target.value;
  const filteredEpisodes = allEpisodes.filter((episode)=>{
    return(
      episode.name.toLowerCase().includes(searchValue.toLowerCase())||
      episode.summary.toLowerCase().includes(searchValue.toLowerCase())
    )
  });
  makePageForEpisodes(filteredEpisodes)
});


window.onload = setup;

