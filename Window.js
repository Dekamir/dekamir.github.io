class Window {
    static footerHeight = getComputedStyle(document.querySelector("footer")).height;

    static fullScreenDimensions = {
        width: "100vw",
        height: `calc(100vh - ${ this.footerHeight })`,
        top: 0,
        left: 0,
        borderRadius: 0,
    };

    static changeDimensions(a, b) {
        a.width = b.width;
        a.height = b.height;
        a.top = b.top;
        a.left = b.left;
        a.borderRadius = b.borderRadius;
    }

    constructor(element) {
        this.element = element;
        this.titlebar = element.querySelector(".window-titlebar");
        this.controls = element.querySelector(".window-controls");
        this.resizers = element.querySelectorAll(".resizer");
        this.maximize = element.querySelector(".window-control-maximize");
        this.storedDimensions = {};

        this.element.addEventListener("mousedown", this.onWindowFocus.bind(this));
        this.titlebar.addEventListener("mousedown", this.onTitlebarMouseDown.bind(this));
        this.resizers.forEach(resizer => resizer.addEventListener("mousedown", this.onResizerMouseDown.bind(this)));
        this.maximize?.addEventListener("click", this.onMaximizeClick.bind(this));
    }

    onWindowFocus(event) {
        document.querySelectorAll(".window").forEach(window => window.style.zIndex = 0);
        this.element.style.zIndex = 1;
    }

    onTitlebarMouseDown(event) {
        if (event.button !== 0) { return; }
        if (this.controls.contains(event.target)) { return; }

        const marginLeft = parseInt(getComputedStyle(this.element).marginLeft, 10);
        const marginTop = parseInt(getComputedStyle(this.element).marginTop, 10);
        const { left, top } = this.element.getBoundingClientRect();
        let shiftX = event.clientX + 1 - left + marginLeft;
        let shiftY = event.clientY + 1 - top + marginTop;

        const onMouseMove = event => {
            this.element.classList.add("moving");

            if (!this.element.classList.contains("maximized")) {
                this.element.style.left = `${ event.pageX + 1 - shiftX }px`;
                this.element.style.top = `${ event.pageY + 1 - shiftY }px`;
                return;
            }

            const fullRectWidth = this.element.getBoundingClientRect().width;
            const controlsRectWidth = this.controls.getBoundingClientRect().width;
            const titleRectWidth = Array.from(this.titlebar.querySelectorAll(".window-title > *"))
                .reduce((width, elem) => width + elem.getBoundingClientRect().width, 0);
            const fullWidth = fullRectWidth - controlsRectWidth - titleRectWidth;
            const fullRatio = (event.clientX + 1 - titleRectWidth) / fullWidth;

            this.element.style.width = this.storedDimensions.width;
            this.element.style.height = this.storedDimensions.height;
            this.element.style.borderRadius = this.storedDimensions.borderRadius;
            this.element.style.top = Window.fullScreenDimensions.top;

            const smallRectWidth = this.element.getBoundingClientRect().width;
            const smallWidth = smallRectWidth - controlsRectWidth - titleRectWidth;
            const left = Math.ceil(Math.max(event.clientX + 1 - titleRectWidth - fullRatio * smallWidth, 0));
            this.element.style.left = `${ left }px`;

            shiftX -= left;

            this.element.classList.toggle("maximized");
        };
        const onMouseUp = event => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            this.element.classList.remove("moving");
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        event.preventDefault();
    }

    onResizerMouseDown(event) {
        const currentResizer = event.target;
        const rect = this.element.getBoundingClientRect();

        const initialWidth = rect.width;
        const initialHeight = rect.height;
        const initialX = rect.x;
        const initialY = rect.y;

        const initialClientX = event.clientX;
        const initialClientY = event.clientY;

        const resize = event => {
            const mouseDeltaX = event.clientX - initialClientX;
            const mouseDeltaY = event.clientY - initialClientY;

            switch (currentResizer.classList[1]) {
                case "resizer-right":
                    this.element.style.width = `${ initialWidth + mouseDeltaX }px`;
                    break;
                case "resizer-left":
                    this.element.style.width = `${ initialWidth - mouseDeltaX }px`;
                    this.element.style.left = `${ initialX + mouseDeltaX }px`;
                    break;
                case "resizer-bottom":
                    this.element.style.height = `${ initialHeight + mouseDeltaY }px`;
                    break;
                case "resizer-top":
                    this.element.style.height = `${ initialHeight - mouseDeltaY }px`;
                    this.element.style.top = `${ initialY + mouseDeltaY }px`;
                    break;
                case "resizer-top-left":
                    this.element.style.width = `${ initialWidth - mouseDeltaX }px`;
                    this.element.style.height = `${ initialHeight - mouseDeltaY }px`;
                    this.element.style.left = `${ initialX + mouseDeltaX }px`;
                    this.element.style.top = `${ initialY + mouseDeltaY }px`;
                    break;
                case "resizer-top-right":
                    this.element.style.width = `${ initialWidth + mouseDeltaX }px`;
                    this.element.style.height = `${ initialHeight - mouseDeltaY }px`;
                    this.element.style.top = `${ initialY + mouseDeltaY }px`;
                    break;
                case "resizer-bottom-left":
                    this.element.style.width = `${ initialWidth - mouseDeltaX }px`;
                    this.element.style.height = `${ initialHeight + mouseDeltaY }px`;
                    this.element.style.left = `${ initialX + mouseDeltaX }px`;
                    break;
                case "resizer-bottom-right":
                    this.element.style.width = `${ initialWidth + mouseDeltaX }px`;
                    this.element.style.height = `${ initialHeight + mouseDeltaY }px`;
                    break;
            }
        };

        const stopResize = event => {
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
        };

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);

        event.preventDefault();
    }

    onMaximizeClick(event) {
        if (this.element.classList.contains("maximized")) {
            Window.changeDimensions(this.element.style, this.storedDimensions);
        }
        else {
            Window.changeDimensions(this.storedDimensions, this.element.style);
            Window.changeDimensions(this.element.style, Window.fullScreenDimensions);
        }

        this.element.classList.toggle("maximized");

        event.preventDefault();
    }
}

export default Window;
