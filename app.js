const wraper = document.querySelector(".skeleton-wraper");
const jsonURL = "https://rickandmortyapi.com/api/character/";
const startSkeletonCount = 20;
const createdSkeletonArray = [];

const animationDefault = {
  animationName: "fade",
  delayMultiple: 0.5,
  delay: 0.2,
  stagDealy: 0.1,
  easing: "ease-in",
  type: "forwards",
};

function newAnimeSetting(newSetting) {
  return Object.assign({}, animationDefault, newSetting);
}

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

function setAnimation(element, animSett, delayMultiple = 0) {
  element.style.animation = `${animSett.animationName} ${animSett.delay}s ${animSett.easing} ${animSett.type}`;
  element.style.animationDelay = `${delayMultiple * animSett.stagDealy}s`;
}

function fadeAllSkeletons() {
  createdSkeletonArray.forEach((skeleton) => {
    setAnimation(skeleton.skeleton, newAnimeSetting({ animationName: "fadeAll", delay: 2, type: "infinite" }));
  });
}

async function setImages(imageUrls) {
  const skeletonImages = document.querySelectorAll(".skeleton-item-image");

  skeletonImages.forEach((element, index) => {
    element.src = imageUrls[index].image;
    element.addEventListener("load", () => {
      element.style.display = "inline-block";
      createdSkeletonArray[index].skeleton.style.display = "none";
    });
  });
}

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

  const imageUrls = await fetchData(jsonURL);
  setImages(imageUrls);
}

initialize();
