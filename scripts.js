function renderStars(rating) {
  let stars = "";
  for (let j = 0; j < Math.floor(rating); j++) {
    stars += '<span class="material-icons-outlined md14">star</span>';
  }
  let dec = Math.round((rating - Math.floor(rating)) * 10);
  if (dec > 0) {
    if (dec <= 2) {
      stars += '<span class="material-icons-outlined md14">star_border</span>';
    } else if (dec >= 8) {
      stars += '<span class="material-icons-outlined md14">star</span>';
    } else {
      stars += '<span class="material-icons-outlined md14">star_half</span>';
    }
  }
  for (let j = Math.ceil(rating); j < 5; j++) {
    stars += '<span class="material-icons-outlined md14">star_border</span>';
  }
  return stars;
}
async function fetchTracks() {
  let url = `http://localhost:3000/tracks`;
  let response = await fetch(url);
  let tracks = await response.json();
  return tracks;
}
function renderTracks(tracks) {
  let tabsHTML = "";
  tracks.forEach((track) => {
    tabsHTML += `<li class="nav-item" role="presentation">
    <button
      class="tab mybtn"
      id="pills-${track.id}-tab"
      data-bs-toggle="pill"
      data-bs-target="#pills-${track.id}"
      type="button"
      role="tab"
      aria-controls="pills-${track.id}"
      aria-selected="true"
    >
    ${track.name}
    </button>
  </li>`;
  });

  let pillsTab = document.querySelector("#pills-tab");
  pillsTab.innerHTML = tabsHTML;
  let tabContent = document.querySelector(".tab-content");
  tabContent.innerHTML = "";
  tracks.forEach((track) => {
    renderTrack(track);
  });
  let firstTab = document.querySelector(".tab");
  firstTab.classList.add("active");
  let firstTabPane = document.querySelector(".tab-pane");
  firstTabPane.classList.add("active", "show");
}
function renderTrack(track) {
  trackHeadHTML = `<h2><b>${track.header}</b></h2>
  <p>${track.description}</p>
  <button class="mybtn white-bg box bold-font">
    Explore ${track.name}
  </button>`;
  let coursesHTML = "";
  track.courses.forEach((course) => {
    let ratingStars = renderStars(course.rating);
    coursesHTML += `
      <div class="carousel-item">
        <article class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <a href="${course.url}">
            <div class="img-container">
              <div class="img-hover"></div>
                <img 
                  alt="${course.title}" 
                  src="${course.image}" 
                />
              </div> 
              <div>
                <h3><b>${course.title}</b></h3> 
                <p class="subtext-font">${course.author}</p> 
                <div class="rating">
                  <span class="rating-num"><b>${course.rating}</b></span>
                    <span class="rating-stars">
                      ${ratingStars}
                    </span>
                  <span class="subtext-font">(${course.rateCount.toLocaleString(
                    "en-US"
                  )})</span>
                </div>
                <div><b>E£${course.price.toLocaleString("en-US")}</b></div>
                ${
                  course.bestseller
                    ? `<div class="best-seller"><b>Bestseller</b></div>`
                    : ``
                }
              </div>
            </a>
          </article>
        </div>`;
  });

  let trackHTML = `
  <div
    class="tab-pane track-container"
    id="pills-${track.id}"
    role="tabpanel"
    aria-labelledby="pills-${track.id}-tab"
    tabindex="0"
  >
    <div class="track-head">${trackHeadHTML}</div>
    <div class="row">
      <div id="CarouselControls${track.id}" class="carousel slide">
        <div class="carousel-inner courses-container">${coursesHTML}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#CarouselControls${track.id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#CarouselControls${track.id}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>`;
  let tabContent = document.querySelector(".tab-content");
  tabContent.innerHTML += trackHTML;
  let currentTrack = document.querySelector(".tab-pane:last-child");
  let firstCourse = currentTrack.querySelector(".carousel-item");
  if (firstCourse) firstCourse.classList.add("active");

  let items = currentTrack.querySelectorAll(".carousel-item");

  items.forEach((el) => {
    const minPerSlide = Math.min(6, items.length);
    let next = el.nextElementSibling;
    for (var i = 1; i < minPerSlide; i++) {
      if (!next) {
        next = items[0];
      }
      let cloneChild = next.cloneNode(true);
      el.appendChild(cloneChild.children[0]);
      next = next.nextElementSibling;
    }
  });
}
function filterCourses(tracks, searchText) {
  let filtered = JSON.parse(JSON.stringify(tracks));
  filtered.forEach((track) => {
    let courses = track.courses;
    let newCourses = [];
    courses.forEach((course) => {
      if (course.title.toLowerCase().includes(searchText.toLowerCase().trim()))
        newCourses.push(course);
    });
    track.courses = newCourses;
  });
  return filtered;
}
let tracks;
document.addEventListener("DOMContentLoaded", async (event) => {
  tracks = await fetchTracks();
  renderTracks(tracks);
});
let form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let searchText = document.querySelector(".text-input");
  let filtered = filterCourses(tracks, searchText.value);
  renderTracks(filtered);
});
