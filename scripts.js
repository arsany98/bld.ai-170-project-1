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
async function fetchCourses() {
  let url = "http://localhost:3000/courses";
  let response = await fetch(url);
  courses = await response.json();
  return courses;
}
function renderCourses(courses) {
  let coursesHTML = "";
  courses.forEach((course) => {
    let ratingStars = renderStars(course.rating);
    coursesHTML += `
        <article>
          <a href="${course.url}">
          <div class="img-container">
            <div class="img-hover"></div>
              <img 
                alt="${course.title}" 
                src="${course.image}" 
              />
            </div> 
            <div>
              <h3>${course.title}</h3> 
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
        </article>`;
  });

  let container = document.querySelector(".courses-container");
  container.innerHTML = coursesHTML;
}
function filterCourses(courses, searchText) {
  let filtered = [];
  courses.forEach((course) => {
    if (course.title.toLowerCase().includes(searchText.toLowerCase().trim()))
      filtered.push(course);
  });
  return filtered;
}
let courses;
document.addEventListener("DOMContentLoaded", async (event) => {
  courses = await fetchCourses();
  renderCourses(courses);
});
let form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let searchText = document.querySelector(".text-input");
  let filtered = filterCourses(courses, searchText.value);
  renderCourses(filtered);
});
