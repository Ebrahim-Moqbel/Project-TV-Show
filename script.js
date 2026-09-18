const SHOWS_URL = "https://api.tvmaze.com/shows";

let allShows = [];
let allEpisodes = [];
let selectedShowId = null;

// caches so we never fetch the same URL twice during a visit
const episodeCache = {};

const showSelect = document.getElementById("show-select");
const searchInput = document.getElementById("search");
const cardContainer = document.getElementById("card-container");
const countDisplay = document.getElementById("count-result");
const template = document.getElementById("episode-card");

async function setup() {
  await loadShows();

  showSelect.addEventListener("change", () => {
    selectedShowId = showSelect.value;

    if (selectedShowId) {
      loadEpisodes(selectedShowId);
    }
  });

  searchInput.addEventListener("input", () => {
    renderEpisodes();
  });
}

// fetch the list of all shows (only ever called once)
async function loadShows() {
  showSelect.innerHTML = "<option>Loading shows...</option>";

  try {
    const response = await fetch(SHOWS_URL);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    allShows = await response.json();

    // alphabetical, case-insensitive
    allShows.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );

    populateShowSelect();

    // load episodes for the first show by default
    if (allShows.length > 0) {
      selectedShowId = allShows[0].id;
      showSelect.value = selectedShowId;
      await loadEpisodes(selectedShowId);
    }
  } catch (error) {
    console.error(error);
    showSelect.innerHTML = "<option>Could not load shows</option>";
    showErrorMessage();
  }
}

function populateShowSelect() {
  showSelect.innerHTML = "";

  for (const show of allShows) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.append(option);
  }
}

// fetch episodes for a given show, using the cache if we already have them
async function loadEpisodes(showId) {
  showLoadingMessage();

  if (Object.hasOwn(episodeCache, showId)) {
    allEpisodes = episodeCache[showId];
    renderEpisodes();
    return;
  }

  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    allEpisodes = data;
    episodeCache[showId] = data;

    renderEpisodes();
  } catch (error) {
    console.error(error);
    showErrorMessage();
  }
}

function showLoadingMessage() {
  cardContainer.innerHTML = "<p>loading episodes, please wait...</p>";
}

function showErrorMessage() {
  cardContainer.innerHTML =
    "<p>Sorry, something went wrong loading the episodes. Please try again later.</p>";
}

// create episode code of the season and the episode number
function makeEpisodeCode(season, episodeNumber) {
  season = String(season).padStart(2, "0");
  episodeNumber = String(episodeNumber).padStart(2, "0");

  return "S" + season + "E" + episodeNumber;
}

// render the episodes by cloning the template in the html and populating it with data
function createEpisodeCard(episode) {
  const card = template.content.cloneNode(true);
  card.querySelector("h2").textContent = episode.name;

  const episodeNumber = makeEpisodeCode(episode.season, episode.number);
  card.querySelector("[data-episode-number]").textContent = episodeNumber;

  const image = card.querySelector("img");
  if (episode.image) {
    image.src = episode.image.medium;
    image.alt = `Scene from ${episodeNumber}, ${episode.name}`;
  }

  card.querySelector("[data-summary]").innerHTML = episode.summary;

  return card;
}

// filter the currently loaded show's episodes and render them
function renderEpisodes() {
  const searchValue = searchInput.value.toLowerCase();

  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchValue) ||
      episode.summary.toLowerCase().includes(searchValue),
  );

  cardContainer.innerHTML = "";

  const episodeCards = filteredEpisodes.map(createEpisodeCard);
  cardContainer.append(...episodeCards);

  countDisplay.textContent = `${filteredEpisodes.length}/${allEpisodes.length}`;
}

window.onload = setup;
