console.log("cat-breed slider script is connected");

// Select the elements, following the DOM selection pattern from class.
const track = document.querySelector(".slider-track");
const slides = Array.from(track.children);
const prevButton = document.querySelector(".previous-button");
const nextButton = document.querySelector(".next-button");
const dotsContainer = document.querySelector(".slider-dots");
const statusText = document.querySelector(".slider-status");
const descriptionText = document.querySelector(".breed-description");

const breeds = [
  {
    name: "Maine Coon",
    description: "A large, long-haired cat with a muscular build, tufted ears, and a thick coat."
  },
  {
    name: "Siamese",
    description: "A sleek, elegant cat known for its pointed coat pattern and strong attachment to people."
  },
  {
    name: "British Shorthair",
    description: "A sturdy cat with a round face, dense plush coat, and a broad range of coat colours."
  },
  {
    name: "Bengal",
    description: "A sleek, muscular cat with a wild-looking appearance and distinctive patterned coat."
  },
  {
    name: "Persian",
    description: "Recognisable for its long, luxurious coat and rounded appearance; regular grooming is important."
  },
  {
    name: "Abyssinian",
    description: "An elegant, athletic-looking cat with a distinctive ticked coat and an alert expression."
  }
];

const realSlideCount = slides.length;
let currentIndex = 1;
let isTransitioning = false;

function createClones() {
  // Cloning the first and last slides enables the seamless boundary loop.
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[realSlideCount - 1].cloneNode(true);
  firstClone.setAttribute("aria-hidden", "true");
  lastClone.setAttribute("aria-hidden", "true");
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);
}

function createDots() {
  for (let i = 0; i < realSlideCount; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.classList.add("dot");
    dot.setAttribute("aria-label", `Go to ${breeds[i].name}`);
    dot.setAttribute("aria-pressed", String(i === 0));
    dot.addEventListener("click", () => goToSlide(i + 1));
    dotsContainer.appendChild(dot);
  }
}

function getRealIndex() {
  if (currentIndex === 0) return realSlideCount - 1;
  if (currentIndex === realSlideCount + 1) return 0;
  return currentIndex - 1;
}

function updateUI() {
  const realIndex = getRealIndex();
  const dots = dotsContainer.querySelectorAll(".dot");

  dots.forEach((dot, index) => {
    const active = index === realIndex;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-pressed", String(active));
  });

  statusText.textContent = `${breeds[realIndex].name} · ${realIndex + 1} of ${realSlideCount}`;
  descriptionText.textContent = breeds[realIndex].description;
}

function moveTo(index, animate = true) {
  track.style.transition = animate ? "" : "none";

  const totalSlides = realSlideCount + 2;
  const offset = (index * 100) / totalSlides;

  track.style.transform = `translateX(-${offset}%)`;
  currentIndex = index;
  updateUI();
}

function goToSlide(index) {
  if (isTransitioning || index === currentIndex) return;
  isTransitioning = true;
  moveTo(index);
}

function nextSlide() {
  if (isTransitioning) return;
  isTransitioning = true;
  moveTo(currentIndex + 1);
}

function prevSlide() {
  if (isTransitioning) return;
  isTransitioning = true;
  moveTo(currentIndex - 1);
}

track.addEventListener("transitionend", (event) => {
  if (event.propertyName !== "transform") return;
  isTransitioning = false;

  if (currentIndex === realSlideCount + 1) {
    moveTo(1, false);
  } else if (currentIndex === 0) {
    moveTo(realSlideCount, false);
  }
});

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);

document.querySelector(".slider").addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") nextSlide();
  if (event.key === "ArrowLeft") prevSlide();
});

const year = document.querySelector(".year");
if (year) year.textContent = new Date().getFullYear();

class Ticker {
  constructor(root) {
    this.track = root.querySelector(".ticker-track");
    this.count = this.track.children.length;
    this.position = 0;
    this.button = root.querySelector(".ticker-next");
    this.button.addEventListener("click", () => this.next());
  }

  next() {
    this.position = (this.position + 1) % this.count;
    this.track.style.transform = `translateY(-${this.position * 100}%)`;
  }
}

const tickerRoot = document.querySelector(".ticker");
if (tickerRoot) new Ticker(tickerRoot);

createClones();
createDots();
moveTo(1, false);
