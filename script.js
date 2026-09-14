//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}
// create episode code of the season and the episode number
function makeCodeForEpisode(season, episodeNumber){
  season = String(season).padStart(2,"0");
  episodeNumber = String(episodeNumber).padStart(2,"0");

  const code = "S" + season +"E" + episodeNumber ;
  return code;
} 

window.onload = setup;
