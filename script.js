const windowAboutUser = document.querySelector("#window-about_user");
const titlebar = document.querySelector(".window-titlebar");
const windowControls = document.querySelector(".window-controls");
const resizers = windowAboutUser.querySelectorAll(".resizer");
const maximizeControl = document.querySelector(".window-control-maximize");

let isMaximized = false;
let storedDimensions = {};
const fullScreenDimensions = {
    width: "100vw",
    height: "calc(100vh - 36px)",
    top: "36px",
    left: 0,
    borderRadius: 0,
};

titlebar.addEventListener("mousedown", event => {
    if (event.button !== 0) { return; }
    if (windowControls.contains(event.target)) { return; }

    const marginLeft = parseInt(window.getComputedStyle(windowAboutUser).marginLeft, 10);
    const marginTop = parseInt(window.getComputedStyle(windowAboutUser).marginTop, 10);
    const left = windowAboutUser.getBoundingClientRect().left;
    const top = windowAboutUser.getBoundingClientRect().top;
    const shiftX = event.clientX - left + marginLeft;
    const shiftY = event.clientY - top + marginTop;

    const onMouseMove = event => {
        if (isMaximized) {
            restoreWindowAboutUserDimensions();
            isMaximized = !isMaximized;
        }

        windowAboutUser.style.left = event.pageX - shiftX + "px";
        windowAboutUser.style.top = event.pageY - shiftY + "px";
    };
    const onMouseUp = event => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    event.preventDefault();
});

resizers.forEach((resizer) => {
    resizer.addEventListener("mousedown", event => {
        const currentResizer = event.target;
        const rect = windowAboutUser.getBoundingClientRect();

        const originalWidth = rect.width;
        const originalHeight = rect.height;
        const originalX = rect.x;
        const originalY = rect.y;

        const originalMouseX = event.clientX;
        const originalMouseY = event.clientY;

        const resize = event => {
            const mouseDifferenceX = event.clientX - originalMouseX;
            const mouseDifferenceY = event.clientY - originalMouseY;

            switch (currentResizer.classList[1]) {
                case "resizer-right":
                    windowAboutUser.style.width = `${ originalWidth + mouseDifferenceX }px`;
                    break;
                case "resizer-left":
                    windowAboutUser.style.width = `${ originalWidth - mouseDifferenceX }px`;
                    windowAboutUser.style.left = `${ originalX + mouseDifferenceX }px`;
                    break;
                case "resizer-bottom":
                    windowAboutUser.style.height = `${ originalHeight + mouseDifferenceY }px`;
                    break;
                case "resizer-top":
                    windowAboutUser.style.height = `${ originalHeight - mouseDifferenceY }px`;
                    windowAboutUser.style.top = `${ originalY + mouseDifferenceY }px`;
                    break;
                case "resizer-top-left":
                    windowAboutUser.style.width = `${ originalWidth - mouseDifferenceX }px`;
                    windowAboutUser.style.height = `${ originalHeight - mouseDifferenceY }px`;
                    windowAboutUser.style.left = `${ originalX + mouseDifferenceX }px`;
                    windowAboutUser.style.top = `${ originalY + mouseDifferenceY }px`;
                    break;
                case "resizer-top-right":
                    windowAboutUser.style.width = `${ originalWidth + mouseDifferenceX }px`;
                    windowAboutUser.style.height = `${ originalHeight - mouseDifferenceY }px`;
                    windowAboutUser.style.top = `${ originalY + mouseDifferenceY }px`;
                    break;
                case "resizer-bottom-left":
                    windowAboutUser.style.width = `${ originalWidth - mouseDifferenceX }px`;
                    windowAboutUser.style.height = `${ originalHeight + mouseDifferenceY }px`;
                    windowAboutUser.style.left = `${ originalX + mouseDifferenceX }px`;
                    break;
                case "resizer-bottom-right":
                    windowAboutUser.style.width = `${ originalWidth + mouseDifferenceX }px`;
                    windowAboutUser.style.height = `${ originalHeight + mouseDifferenceY }px`;
                    break;
            }
        };

        const stopResize = event => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResize);
        };

        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);

        event.preventDefault();
    });
});

maximizeControl.addEventListener("click", event => {
    if (!isMaximized) {
        saveWindowAboutUserDimensions();

        windowAboutUser.style.width = fullScreenDimensions.width;
        windowAboutUser.style.height = fullScreenDimensions.height;
        windowAboutUser.style.top = fullScreenDimensions.top;
        windowAboutUser.style.left = fullScreenDimensions.left;
        windowAboutUser.style.borderRadius = fullScreenDimensions.borderRadius;
    } else {
        restoreWindowAboutUserDimensions();
    }

    isMaximized = !isMaximized;

    event.preventDefault();
});

function saveWindowAboutUserDimensions() {
    storedDimensions.width = windowAboutUser.style.width;
    storedDimensions.height = windowAboutUser.style.height;
    storedDimensions.top = windowAboutUser.style.top;
    storedDimensions.left = windowAboutUser.style.left;
    storedDimensions.borderRadius = windowAboutUser.style.borderRadius;
}

function restoreWindowAboutUserDimensions() {
    windowAboutUser.style.width = storedDimensions.width;
    windowAboutUser.style.height = storedDimensions.height;
    windowAboutUser.style.top = storedDimensions.top;
    windowAboutUser.style.left = storedDimensions.left;
    windowAboutUser.style.borderRadius = storedDimensions.borderRadius;
}
