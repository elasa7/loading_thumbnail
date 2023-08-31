const wraper = document.querySelector(".skeleton-wraper");
const jsonURL = "https://rickandmortyapi.com/api/character/";
let startSkeletonCount = 28;
let createdSkeletonArray = [];

let animationDefault = {
  animationName: "fade",
  delayMultiple: 0.5,
  delay: 0.2,
  stagDealy: 0.1,
  easing: "ease-in",
  type: "forwards",
};

function newAnimeSetting(newSetting) {
  if (typeof newSetting === "object") {
    return Object.assign(animationDefault, newSetting);
  } else {
    return animationDefault;
  }
}

function makeSkieleton(count) {
  for (let i = 0; i < count; i++) {
    let skeletonWrapper = document.createElement("div");
    let skeleton = document.createElement("div");

    skeletonWrapper.classList.add("skeleton-item-wrapper");
    skeleton.classList.add("skeleton-item");

    let myNewImage = document.createElement("img");
    myNewImage.classList.add("skeleton-item-image");
    skeletonWrapper.appendChild(myNewImage);

    skeletonWrapper.appendChild(skeleton);
    setAnimation(skeleton, newAnimeSetting(), i);
    createdSkeletonArray.push(skeleton);
    wraper.appendChild(skeletonWrapper);

    if (i === count - 1) {
      createdSkeletonArray[count - 1].addEventListener("animationend", () => {
        fadeAll();
      });
    }
  }
}

function setAnimation(element, animSett, delayMultiple = 0) {
  element.style.animation = `${animSett.animationName} ${animSett.delay}s  ${animSett.easing} ${animSett.type}`;
  element.style.animationDelay = `${delayMultiple * animSett.stagDealy}s`;
}

function fadeAll(params) {
  for (let i = 0; i < startSkeletonCount; i++) {
    if (createdSkeletonArray[i].tagName.toLowerCase() == "div") {
      setAnimation(createdSkeletonArray[i], newAnimeSetting({ animationName: "fadeAll", delay: 2, type: "infinite" }));
    }
  }
}

function setImages(ImageUrl) {
  let toReplace = document.querySelectorAll(".skeleton-item-image");
  toReplace.forEach((element, index) => {
    element.src = ImageUrl[index].image;
    element.addEventListener("load", () => {
      element.style.display = "inline-block";
      createdSkeletonArray[index].style.display = "none";
    });
  });
}

async function getJson(params) {
  try {
    let myJson = await fetch(params);
    if (myJson.status == 200) {
      let myJsonData = await myJson.json();
      setImages(myJsonData.results);
    } else {
      throw new Error("Fetching json faild");
    }
  } catch (error) {
    console.log(error);
  }
}
makeSkieleton(startSkeletonCount);
getJson(jsonURL);
