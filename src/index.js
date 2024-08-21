let dogiInfo = document.getElementById("dog-info");
let goodDogFilter = document.getElementById("good-dog-filter");
let isGoodValue = false;
let allDogs = [];
let dogBar = document.getElementById("dog-bar");

window.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/pups")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then((data) => {
      allDogs = data;
      renderDogBar(allDogs);
      renderDogs(allDogs);
    })
    .catch((error) => console.error("Error:", error));
});

function renderDogBar(dogs) {
  dogBar.innerHTML = "";
  dogs.forEach((dog) => {
    if (!isGoodValue || dog.isGoodDog) {
      let span = document.createElement("span");
      span.innerText = dog.name;
      span.addEventListener("click", () => renderDogs([dog]));
      dogBar.appendChild(span);
    }
  });
}

function renderDogs(dogs) {
  dogiInfo.innerHTML = "";
  dogs.forEach((element) => {
    dogiInfo.innerHTML += `
      <div class="dog-card" data-id="${element.id}">
        <img src="${element.image}" />
        <h2>${element.name}</h2>
        <button class="change-dog-status">${
          element.isGoodDog ? "Bad Dog!" : "Good Dog!"
        }</button>
      </div>
    `;
  });
}

goodDogFilter.addEventListener("click", () => {
  isGoodValue = !isGoodValue;
  goodDogFilter.innerText = isGoodValue
    ? "Filter good dogs: ON"
    : "Filter good dogs: OFF";

  let dogsToRender = isGoodValue
    ? allDogs.filter((element) => element.isGoodDog)
    : allDogs;

  renderDogBar(dogsToRender);
  renderDogs(dogsToRender);
});

dogiInfo.addEventListener("click", (event) => {
  if (event.target.classList.contains("change-dog-status")) {
    let dogCard = event.target.closest(".dog-card");
    let dogId = dogCard.getAttribute("data-id");
    let dog = allDogs.find((d) => d.id == dogId);

    let newStatus = !dog.isGoodDog;

    fetch(`http://localhost:3000/pups/${dogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isGoodDog: newStatus,
      }),
    })
      .then((response) => response.json())
      .then((updatedDog) => {
        dog.isGoodDog = updatedDog.isGoodDog;

        if (isGoodValue) {
          let filteredDogs = allDogs.filter((element) => element.isGoodDog);
          renderDogBar(filteredDogs);
          renderDogs(filteredDogs);
        } else {
          renderDogBar(allDogs);
          renderDogs(allDogs);
        }
      })
      .catch((error) => console.error("Error:", error));
  }
});
