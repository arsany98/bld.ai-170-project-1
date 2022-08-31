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
function renderCourses(trackId, coursesHtml) {
  let rendered = document.createElement("div");
  if (coursesHtml.length === 0) {
    rendered.innerHTML = `<div class="no-courses">No Results Found.</div>`;
    return rendered.firstElementChild;
  }
  let minPerSlide;
  if (window.innerWidth <= 576) minPerSlide = Math.min(1, coursesHtml.length);
  else if (window.innerWidth <= 768)
    minPerSlide = Math.min(2, coursesHtml.length);
  else if (window.innerWidth <= 992)
    minPerSlide = Math.min(3, coursesHtml.length);
  else if (window.innerWidth <= 1200)
    minPerSlide = Math.min(4, coursesHtml.length);
  else minPerSlide = Math.min(6, coursesHtml.length);

  let carouselItems = "";
  for (let i = 0; i < coursesHtml.length; i++) {
    if (i % minPerSlide === 0) {
      if (i === 0) {
        carouselItems += `<div class="carousel-item active">`;
      } else {
        carouselItems += `</div>`;
        carouselItems += `<div class="carousel-item">`;
      }
    }
    carouselItems += coursesHtml[i];
  }
  carouselItems += `</div>`;
  rendered.innerHTML = `
    <div id="CarouselControls${trackId}" class="carousel slide" data-bs-wrap="false">
      <div class="carousel-inner">${carouselItems}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#CarouselControls${trackId}" data-bs-slide="prev">
        <span class="material-icons-outlined md32">navigate_before</span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#CarouselControls${trackId}" data-bs-slide="next">
        <span class="material-icons-outlined md32">navigate_next</span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>`;
  let c = rendered.querySelector(".carousel");
  let prevControl = c.querySelector(".carousel-control-prev");
  let nextControl = c.querySelector(".carousel-control-next");
  if (c.querySelector(".carousel-inner").childElementCount == 1)
    nextControl.style.display = "none";
  prevControl.style.display = "none";
  c.addEventListener("slid.bs.carousel", (event) => {
    let i = event.to;
    let n = c.querySelector(".carousel-inner").childElementCount - 1;
    if (i === 0) prevControl.style.display = "none";
    else prevControl.style.display = "flex";

    if (i === n) nextControl.style.display = "none";
    else nextControl.style.display = "flex";
  });
  return rendered.firstElementChild;
}
function renderTracks(tracks) {
  let tabs = document.querySelector("#pills-tab");
  tabs.innerHTML = "";
  let tabContent = document.querySelector(".tab-content");
  tabContent.innerHTML = "";
  tracks.forEach((track) => {
    let tab = document.createElement("div");
    tab.innerHTML = `
    <li class="nav-item" role="presentation">
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
    tab.querySelector("button").addEventListener("click", (event) => {
      let currentTrack = document.querySelector(".tab-pane.active");
      currentTrack.querySelector(".courses-container").innerHTML = "";
      currentTrack
        .querySelector(".courses-container")
        .append(renderCourses(track.id, coursesToHtml(track.courses)));
    });
    tabs.append(tab.firstElementChild);
    tabContent.append(renderTrack(track));
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

  let trackHTML = document.createElement("div");
  trackHTML.innerHTML = `
  <div
    class="tab-pane track-container"
    id="pills-${track.id}"
    role="tabpanel"
    aria-labelledby="pills-${track.id}-tab"
    tabindex="0"
  >
    <div class="track-head">${trackHeadHTML}</div>
    <div class="courses-container row"></div>
  </div>`;
  trackHTML
    .querySelector(".courses-container")
    .append(renderCourses(track.id, coursesToHtml(track.courses)));
  return trackHTML.firstElementChild;
}
function coursesToHtml(courses) {
  let coursesHTML = [];
  courses.forEach((course) => {
    let ratingStars = renderStars(course.rating);
    coursesHTML.push(`
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
        </article>`);
  });
  return coursesHTML;
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
document.addEventListener("DOMContentLoaded", async (event) => {
  let tracks = await fetchTracks();
  renderTracks(tracks);

  window.addEventListener("resize", (event) => {
    let currentTrack = document.querySelector(".tab-pane.active");
    let currentTrackName = document
      .querySelector(".tab.active")
      .textContent.trim();
    let t = tracks.find((track) => {
      return track.name === currentTrackName;
    });
    currentTrack.querySelector(".courses-container").innerHTML = "";
    currentTrack
      .querySelector(".courses-container")
      .append(renderCourses(t.id, coursesToHtml(t.courses)));
  });

  let form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let searchText = document.querySelector(".text-input");
    let filtered = filterCourses(tracks, searchText.value);
    renderTracks(filtered);
  });
});
