import { grab, grabAll, grabFrom, grabAllFrom } from "./grab";
import createElement from "./createElement";

function ImageCarousel(imageSources, carouselDiv) {
  this.imageSources = imageSources;
  this.carouselDiv = carouselDiv;
  this.activeSlide = 0;
}

ImageCarousel.prototype.makeSlideImage = function makeImageDiv(imageSource) {
  let a = createElement("a");
  a.index = this.activeSlide++;
  let img = a.appendChild(createElement("img"));
  img.src = imageSource;
  img.style.width = this.eachWidth + "px";
  img.style.height = this.eachWidth + "px";
  img.style.margin = this.padding + "px";
  a.addEventListener("click", this.imageClicked.bind(this));
  return a;
};

ImageCarousel.prototype.generateSlides = function generateSlides() {
  let numImages = this.imageSources.length;
  this.eachWidth = (500 / numImages) * 0.8;
  this.padding = (500 / numImages) * 0.1;
  let div = new DocumentFragment().appendChild(createElement("div"));
  div.id = "imageSlide";
  for (let i = 0; i < numImages; i++) {
    div.appendChild(
      this.makeSlideImage(this.imageSources[i], this.eachWidth, this.padding)
    );
  }
  return div;
};

ImageCarousel.prototype.setupLeftAndRight = function setupLeftAndRight() {
  let right = createElement("div");
  let left = createElement("div");
  left.id = "leftArrow";
  right.id = "rightArrow";
  left.addEventListener("click", this.back.bind(this));
  right.addEventListener("click", this.next.bind(this));
  return [left, right];
};

ImageCarousel.prototype.setupImageDisplay = function setupImageDisplay() {
  let imageDisplay = createElement("div");
  imageDisplay.id = "imageDisplay";
  this.displayImg = imageDisplay.appendChild(createElement("img"));
  let leftRight = this.setupLeftAndRight();
  imageDisplay.appendChild(leftRight[0]);
  imageDisplay.appendChild(leftRight[1]);
  return imageDisplay;
};

ImageCarousel.prototype.setupImageCarousel = function setupImageCarousel() {
  this.setImageDisplay(this.activeSlide);
  this.carouselDiv.innerHTML = "";
  this.carouselDiv.appendChild(this.setupImageDisplay());
  this.carouselDiv.appendChild(this.generateSlides());
  this.activeSlide = 0;
  this.selectImage(this.activeSlide);
};

ImageCarousel.prototype.setImageDisplay = function setImageDisplay(index) {
  this.carouselDiv.querySelector("#imageDisplay").src = this.imageSources[
    index
  ];
};

ImageCarousel.prototype.back = function back() {
  this.activeSlide - 1 < 0
    ? this.selectImage(this.imageSources.length - 1)
    : this.selectImage(this.activeSlide - 1);
};

ImageCarousel.prototype.next = function next() {
  this.activeSlide + 1 >= this.imageSources.length
    ? this.selectImage(0)
    : this.selectImage(this.activeSlide + 1);
};

ImageCarousel.prototype.centerImg = function centerImg() {
  let maxWidth = this.displayImg.parentNode.offsetWidth;
  let maxHeight = this.displayImg.parentNode.offsetHeight;
  let widthMargin =
    (maxWidth - this.displayImg.getBoundingClientRect().width) / 2;
  let heightMargin =
    (maxHeight - this.displayImg.getBoundingClientRect().height) / 2;
  this.displayImg.style.margin = `${heightMargin}px ${widthMargin}px`;
};

ImageCarousel.prototype.select = function select(element) {
  element.classList.add("selected");
  if (this.padding * 2 > 10) {
    element.style.margin = this.padding - 5 + "px";
  } else {
    let shrinkWidth = 10 - 2 * this.padding;
    element.style.width = this.eachWidth - shrinkWidth / 2;
    element.style.height = this.eachWidth - shrinkWidth / 2;
  }
  this.displayImg.src = element.src;
};

ImageCarousel.prototype.deselect = function deselect(element) {
  element.classList.remove("selected");
  element.style.margin = this.padding;
  element.style.width = this.eachWidth;
  element.style.height = this.eachWidth;
};

ImageCarousel.prototype.selectImage = function selectImage(index) {
  let children = grabAllFrom(this.carouselDiv, "#imageSlide img");
  this.deselect(children.item(this.activeSlide));
  this.select(children.item(index));
  this.activeSlide = index;
  this.centerImg();
};

ImageCarousel.prototype.imageClicked = function imageClicked(event) {
  let target = event.target;
  if (
    event.target.src &&
    this.imageSources.includes(event.target.src.split("/").pop())
  ) {
    target = event.path[1];
  }
  this.selectImage(target.index);
};

export default ImageCarousel;
