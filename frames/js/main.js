const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const frames = { currentIndex: 0, maxIndex: 1502 };
const images = [];
let imagesLoaded = 0;

function preloadImages() {
    for (let i = 1; i <= frames.maxIndex; i++) {
        const img = new Image();
        img.src = `./frames/frame_${i.toString().padStart(4, "0")}.jpeg`;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === frames.maxIndex) {
                loadImage(frames.currentIndex);
                startAnimation();
            }
        };
        img.onerror = e => console.error(`Failed to load image: ${img.src}`, e.error);
        images.push(img);
    }
}

function loadImage(index) {
    if (index >= 0 && index <= frames.maxIndex) {
        const img = images[index];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const [newWidth, newHeight] = [img.width * scale, img.height * scale];
        const [offsetX, offsetY] = [(canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2];

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
        frames.currentIndex = index;
    }
}

function startAnimation() {
    gsap.timeline({
        scrollTrigger: {
            trigger: ".parent",
            start: "top top",
            scrub: 3,
            end: "bottom bottom",
            markers: false
        }
    }).to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: () => loadImage(Math.floor(frames.currentIndex))
    });
}

preloadImages();
