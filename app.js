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
    let skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-item");
    setAnimation(skeleton, newAnimeSetting(), i);
    createdSkeletonArray.push(skeleton);
    wraper.appendChild(skeleton);

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

makeSkieleton(startSkeletonCount);

function fadeAll(params) {
  for (let i = 0; i < startSkeletonCount; i++) {
    if (wraper.children[i].tagName.toLowerCase() == "div") {
      setAnimation(wraper.children[i], newAnimeSetting({ animationName: "fadeAll", delay: 2, type: "infinite" }));
    }
  }
}

// function setImages() {
//   let myNewImage = document.createElement("img");
//   myNewImage.src = "./img/ew.jpeg";
//   let toReplace = document.querySelector(".skeleton-item");
//   toReplace.style = "none";
//   wraper.replaceChild(myNewImage, toReplace);
// }

function setImages(ImageUrl) {
  console.log(ImageUrl);
  let myNewImage = document.createElement("img");
  myNewImage.src = ImageUrl[0].image;
  let toReplace = document.querySelector(".skeleton-item");
  toReplace.style = "none";
  wraper.replaceChild(myNewImage, toReplace);
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

getJson(jsonURL);
