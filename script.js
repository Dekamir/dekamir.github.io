import PhotoSwipeDynamicCaption from "./photoswipe/photoswipe-dynamic-caption-plugin.esm.min.js";
import PhotoSwipeLightbox from "./photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "./photoswipe/photoswipe.esm.min.js";
import Window from "./Window.js";

const about = new Window(document.querySelector("#window-about_user"));
const projects = new Window(document.querySelector("#window-projects"));
const close_all_windows = new Window(document.querySelector("#window-close_all_windows"));

document.querySelectorAll(".catalogue-item").forEach(elem => {
    elem.setAttribute("data-pswp-width", elem.firstElementChild.naturalWidth);
    elem.setAttribute("data-pswp-height", elem.firstElementChild.naturalHeight);
});

const lightbox = new PhotoSwipeLightbox({
    gallery: ".catalogueview-catalogue",
    children: ".catalogue-item",
    pswpModule: PhotoSwipe,
    paddingFn(viewportSize) {
        return {
            top: 30, bottom: 30, left: 0, right: 0
        };
    },
});

const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
    type: "auto",
    captionContent(slide) {
        return slide.data.element.nextElementSibling?.matches(".pswp-caption-content") && slide.data.element.nextElementSibling?.innerHTML || slide.data.element.querySelector("img").getAttribute("title");
    }
});

lightbox.init();
