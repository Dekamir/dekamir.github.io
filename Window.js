class Window {
    static footerHeight = getComputedStyle(document.querySelector("footer")).height;

    static fullScreenDimensions = {
        width: "100vw",
        height: `calc(100vh - ${ this.footerHeight })`,
        top: 0,
        bottom: this.footerHeight,
        left: 0,
        borderRadius: 0,
    };

    static changeDimensions(a, b) {
        a.width = b.width;
        a.height = b.height;
        a.top = b.top;
        a.bottom = b.bottom;
        a.left = b.left;
        a.borderRadius = b.borderRadius;
    }

    constructor(element) {
        this.element = element;
        this.titlebar = element.querySelector(".window-titlebar");
        this.controls = element.querySelector(".window-controls");
        this.resizers = element.querySelectorAll(".resizer");
        this.maximize = element.querySelector(".window-control-maximize");
        this.isMaximized = false;
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
        const left = this.element.getBoundingClientRect().left;
        const top = this.element.getBoundingClientRect().top;
        const shiftX = event.clientX - left + marginLeft;
        const shiftY = event.clientY - top + marginTop;

        const onMouseMove = event => {
            if (this.isMaximized) {
                Window.changeDimensions(this.element.style, this.storedDimensions);
                this.isMaximized = !this.isMaximized;
            }

            this.element.style.left = `${ event.pageX - shiftX }px`;
            this.element.style.top = `${ event.pageY - shiftY }px`;
        };
        const onMouseUp = event => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
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
        if (!this.isMaximized) {
            Window.changeDimensions(this.storedDimensions, this.element.style);
            Window.changeDimensions(this.element.style, Window.fullScreenDimensions);
        }
        else {
            Window.changeDimensions(this.element.style, this.storedDimensions);
        }

        this.isMaximized = !this.isMaximized;

        event.preventDefault();
    }
}

export default Window;
