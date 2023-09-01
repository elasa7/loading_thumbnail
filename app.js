// Select the container for skeleton elements and the JSON API URL.
const wraper = document.querySelector(".skeleton-wraper");
const jsonURL = "https://rickandmortyapi.com/api/character/";

// Set the initial number of skeleton items to load, and create an array to store them.
let startSkeletonCount = 5;
const createdSkeletonArray = [];

// Track the current item count and store fetched image URLs.
let currentItemCount = 0;
let imageUrls = [];

// Select the "Load More" button.
const loadMoreButton = document.querySelector(".load-more-btn");

// Default animation settings for skeleton items.
const animationDefault = {
  animationName: "fade",
  delayMultiple: 0.5,
  delay: 0.2,
  stagDealy: 0.1,
  easing: "ease-in",
  type: "forwards",
};

// Function to merge new animation settings with defaults.
function newAnimeSetting(newSetting) {
  return Object.assign({}, animationDefault, newSetting);
}

// Function to create a skeleton item with a wrapper, skeleton, and image.
function makeSkeletonItem() {
  const skeletonWrapper = document.createElement("div");
  const skeleton = document.createElement("div");
  const skeletonImage = document.createElement("img");

  skeletonWrapper.classList.add("skeleton-item-wrapper");
  skeleton.classList.add("skeleton-item");
  skeletonImage.classList.add("skeleton-item-image");

  skeletonWrapper.appendChild(skeletonImage);
  skeletonWrapper.appendChild(skeleton);
  wraper.appendChild(skeletonWrapper);

  return { skeleton, skeletonImage };
}

// Function to set animation properties for a given element.
function setAnimation(element, animSett, delayMultiple = 0) {
  element.style.animation = `${animSett.animationName} ${animSett.delay}s ${animSett.easing} ${animSett.type}`;
  element.style.animationDelay = `${delayMultiple * animSett.stagDealy}s`;
}

// Function to apply an animation to fade out all skeleton elements.
function fadeAllSkeletons() {
  createdSkeletonArray.forEach((skeleton) => {
    setAnimation(skeleton.skeleton, newAnimeSetting({ animationName: "gradientLoading", delay: 2, type: "infinite" }));
  });
}

// Function to set image sources and handle their load events.
async function setImages(imageUrls) {
  const skeletonImages = document.querySelectorAll(".skeleton-item-image");

  skeletonImages.forEach((element, index) => {
    element.src = imageUrls[index].image;
    element.addEventListener("load", () => {
      element.classList.add("fadeImage");
      element.style.display = "inline-block";
      createdSkeletonArray[index].skeleton.style.display = "none";
    });
  });
}

// Function to fetch JSON data from the specified URL.
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Fetching JSON failed");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to initialize the page by creating initial skeleton items and loading images.
async function initialize() {
  for (let i = 0; i < startSkeletonCount; i++) {
    const { skeleton, skeletonImage } = makeSkeletonItem();
    setAnimation(skeleton, newAnimeSetting(), i);
    createdSkeletonArray.push({ skeleton, skeletonImage });
    if (startSkeletonCount - 1 === i) {
      skeleton.addEventListener("animationend", () => {
        fadeAllSkeletons();
      });
    }
  }

  // If no image URLs were stored, fetch them from the JSON API.
  if (imageUrls.length === 0) {
    imageUrls = await fetchData(jsonURL);
    setImages(imageUrls);
  } else {
    setImages(imageUrls);
  }
}

// Event listener for the "Load More" button. disable button after last part of image was loaded
loadMoreButton.addEventListener("click", (e) => {
  e.preventDefault();
  currentItemCount += startSkeletonCount;
  if (currentItemCount < imageUrls.length) {
    initialize();
  }
  if (currentItemCount >= imageUrls.length - startSkeletonCount) {
    loadMoreButton.style.display = "none";
  } else {
    return;
  }
});

// Initialize the page.
initialize();
