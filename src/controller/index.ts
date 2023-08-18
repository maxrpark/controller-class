import { ThemeType, PositionType } from "./globalTs.js";
import {
  backwardIcon,
  grabIcon,
  pauseIcon,
  playIcon,
  repeatIcon,
} from "./icons.js";

import { themes } from "./utils.js";

interface GSAPControllerParams {
  animations: any | any[];
  Draggable?: any;
  position?: PositionType;
  theme?: ThemeType;
  backgroundColor?: string;
  buttonColor?: string;
  textColor?: string;
  width?: string;
  disable?: boolean;
  noShadow?: boolean;
  activeAnimation?: string;
  parentSelector?: string;
  onStart?: (self: any) => any;
  onSelectAnimationChange?: (self: any) => any;
}

class GSAPController {
  // params
  private Draggable: any;
  private animations: any[];
  private buttonColor: string;
  private backgroundColor: string;
  private textColor: string;
  private parentSelector: string | null;

  private position: PositionType;
  private theme: {
    background: string;
    buttons: string;
    text: string;
  };

  ///
  private timeLine: any;
  private controllerWrapper: HTMLDivElement;
  private progressSlider: HTMLInputElement;
  private animationProgress: HTMLDivElement;
  private animationDuration: HTMLDivElement;
  private pauseButton: HTMLButtonElement;
  private repeatButton: HTMLButtonElement;

  //Styles
  private controllerWrapperStyle: string;
  private extraButtonsStyles: string;
  private selectStyles: string;
  private inputRangeStyles: string;
  private btnStyles: string;
  private grabAreaStyles: string;
  private containerWidth: string;
  private noShadow: boolean;

  onStart: (timeLine: any) => any;
  onSelectAnimationChange: (timeLine: any) => any;
  disable: boolean;

  constructor({
    animations,
    Draggable,
    buttonColor,
    backgroundColor,
    textColor,
    position = "bottom center",
    theme = "default",
    width = "500px",
    disable = false,
    noShadow = false,
    activeAnimation,
    parentSelector,
    onStart,
    onSelectAnimationChange,
  }: GSAPControllerParams) {
    this.disable = disable;
    if (this.disable) return;

    if (!animations) {
      throw new Error("Invalid or missing 'animations' parameter.");
    }

    if (Draggable && typeof Draggable !== "function") {
      throw new Error("No gsap Draggable found");
    }

    this.animations = !animations[0] ? [animations] : animations;
    this.parentSelector = parentSelector || null;

    this.animations.forEach((animation: any, idx: number) => {
      if (!animation.id) {
        animation.id = `Animation-${idx + 1}`;
      }
    });

    const activeAni = this.animations.find((ani) => ani.id === activeAnimation);
    this.timeLine = activeAni ? activeAni : this.animations[0];

    this.Draggable = Draggable || null;

    this.position = position;
    this.theme = themes[theme as ThemeType]
      ? themes[theme as ThemeType]
      : themes.default;
    this.containerWidth = width;

    this.backgroundColor = backgroundColor || this.theme.background;
    this.buttonColor = buttonColor || this.theme.buttons;
    this.textColor = textColor || this.theme.text;
    this.noShadow = noShadow;

    //callbacks
    this.onSelectAnimationChange = onSelectAnimationChange || (() => {});
    this.onStart = onStart || (() => {});

    this.setStyles();
    this.createController();

    this.sliderEvent();
    this.handleSelectAnimation();

    this.pauseButtonActions();
    this.reverseButtonAction();
    this.restartButtonAction();
    this.repeatButtonAction();

    // callback
    this.onStart(this.timeLine);

    this.onUpdate();

    if (this.Draggable) this.createDraggable();
  }

  createController() {
    this.controllerWrapper = document.createElement("div");

    if (this.parentSelector && document.querySelector(this.parentSelector)) {
      const parent = document.querySelector(this.parentSelector)!;
      parent.appendChild(this.controllerWrapper);
    } else {
      this.setPosition(this.position);
      this.controllerWrapper.style.marginTop = "200px";
      this.controllerWrapper.style.position = "fixed";
      document.body.appendChild(this.controllerWrapper);
    }

    this.controllerWrapper.style.width = "90%";
    this.controllerWrapper.style.maxWidth = `${this.containerWidth}`;
    this.controllerWrapper.style.margin = "0 auto";
    this.controllerWrapper.style.padding = "1rem";
    this.controllerWrapper.style.display = "flex";
    this.controllerWrapper.style.flexDirection = "column";
    this.controllerWrapper.style.gap = "1.2rem";
    this.controllerWrapper.style.borderRadius = "5px";
    this.controllerWrapper.style.boxSizing = "border-box";

    this.controllerWrapper.style.background = this.backgroundColor;

    if (!this.noShadow)
      this.controllerWrapper.style.boxShadow =
        "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset";

    // "rgba(0, 0, 0, 0.35) 0px 5px 15px";

    this.controllerWrapper.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:1rem">
          <select style="${this.selectStyles}" value='${
      this.timeLine.id
    }' id="selection">
          ${this.animations.map((ani: any) => {
            return `<option data-id="${ani.id}" data-ani="${
              this.timeLine.id
            }" ${this.timeLine.id === ani.id && "selected"} value="${ani.id}">${
              ani.id
            }</option>`;
          })}
          </select>
          <div id="grab-handler"style="${this.grabAreaStyles}">
            ${grabIcon(this.textColor)}
          </div>
      </div>
      <div style="${this.controllerWrapperStyle}">
        <button style="${this.btnStyles}" id="pause"> pause </button>
        <input
          id="progressSlider"
          type="range"
          min="0"
          max="1"
          value="0"
          step="0.001"

          style="${this.inputRangeStyles}"
        />
        <div style="display:flex;align-items:center;justify-content:center;">
          <p id="time" style="margin-right:0.2rem">0.00</p>
          /
          <p id="tlDuration" style="margin-left:0.2rem"></p>
        </div>


      </div>
      <div style="${this.extraButtonsStyles}">
        <button id="reverse" style="${this.btnStyles}">
        ${backwardIcon(this.textColor)}
        </button>
        <button id="restart" style="${this.btnStyles}">restart</button>
        <button id="repeat" style="${this.btnStyles}">
          ${repeatIcon(this.textColor)}
        </button>
      </div>
   `;
    this.animationProgress = this.controllerWrapper.querySelector("#time")!;
    this.animationDuration =
      this.controllerWrapper.querySelector("#tlDuration")!;

    this.animationProgress.style.minWidth = "40px";
    this.animationProgress.style.textAlign = "end";
  }

  sliderEvent() {
    this.progressSlider =
      this.controllerWrapper.querySelector("#progressSlider")!;

    this.progressSlider.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.timeLine.progress(target.value).pause();
    });

    this.progressSlider.addEventListener("change", () => {
      this.pauseButton.innerHTML = playIcon(this.textColor);
    });
  }
  handleSelectAnimation() {
    const selection = this.controllerWrapper.querySelector("#selection")!;

    selection.addEventListener("change", (event: Event) => {
      const value = (event.target as HTMLSelectElement).value;

      if (this.timeLine.id === value) return;

      this.timeLine.paused(true);
      this.timeLine.progress(0);
      this.repeatButton.style.background = this.buttonColor;

      this.timeLine = this.animations.find((ani) => ani.id === value);

      // Call the callback function
      this.onSelectAnimationChange(this.timeLine);

      this.onUpdate();
    });
  }

  reverseButtonAction() {
    const reverseButton = this.controllerWrapper.querySelector("#reverse")!;
    reverseButton.addEventListener("click", () => this.timeLine.reverse());
  }
  restartButtonAction() {
    const restartButton = this.controllerWrapper.querySelector("#restart")!;
    restartButton.addEventListener("click", () => this.timeLine.restart());
  }
  repeatButtonAction() {
    this.repeatButton = this.controllerWrapper.querySelector("#repeat")!;

    this.repeatButton.addEventListener("click", () => {
      const isRepeating = this.timeLine._repeat === 0;
      this.repeatButton.style.background = isRepeating
        ? "#A53F2B"
        : this.buttonColor;

      this.timeLine.repeat(isRepeating ? -1 : 0);
      this.timeLine.restart();
    });
  }
  pauseButtonActions() {
    this.pauseButton = this.controllerWrapper.querySelector("#pause")!;
    this.pauseButton.addEventListener("click", () => {
      this.timeLine.paused(!this.timeLine.paused());
      if (this.timeLine.progress() === 1 || this.timeLine.progress() === 0) {
        this.timeLine.restart();
      }

      this.pauseButton.innerHTML = this.timeLine.paused()
        ? playIcon(this.textColor)
        : pauseIcon(this.textColor);
    });
  }

  createDraggable() {
    const grabHandler: HTMLDivElement =
      this.controllerWrapper.querySelector("#grab-handler")!;
    grabHandler.style.display = "block";

    this.Draggable.create(this.controllerWrapper, {
      trigger: grabHandler,
    });
  }

  setPosition(position: PositionType) {
    const [vertical, horizontal] = position.split(" ");
    switch (vertical) {
      case "top":
        this.controllerWrapper.style.top = "20px";
        this.controllerWrapper.style.bottom = "auto";
        break;
      case "center":
        this.controllerWrapper.style.top = "50%";
        this.controllerWrapper.style.transform = "translateY(-50%)";
        break;
      case "bottom":
        this.controllerWrapper.style.bottom = "20px";
        this.controllerWrapper.style.top = "auto";
        break;

      default:
        this.controllerWrapper.style.bottom = "20px";
        this.controllerWrapper.style.top = "auto";
        break;
    }

    switch (horizontal) {
      case "left":
        this.controllerWrapper.style.left = "20px";
        this.controllerWrapper.style.right = "auto";
        break;
      case "right":
        this.controllerWrapper.style.right = "20px";
        this.controllerWrapper.style.left = "auto";
        break;
      case "center":
        this.controllerWrapper.style.left = "50%";
        this.controllerWrapper.style.right = "auto";
        this.controllerWrapper.style.transform += "translateX(-50%)";
        break;
      default:
        this.controllerWrapper.style.left = "50%";
        this.controllerWrapper.style.right = "auto";
        this.controllerWrapper.style.transform += "translateX(-50%)";
        break;
    }
  }

  setStyles() {
    const customStyles = document.createElement("style");
    customStyles.innerHTML = `
      #progressSlider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: ew-resize;
        border: 3px solid ${this.buttonColor} ;
        background-color: white;
        cursor: pointer;
        appearance: none;
      }
    `;
    document.head.appendChild(customStyles);

    this.inputRangeStyles = `width: 100%; 
                      max-width: 400px;  
                      height: 5px;
                      background-color: rgb(180, 155, 192);
                      margin-top: 7px;
                      border-radius: 25px;
                      appearance: none;
                      margin-left:1rem`;

    this.controllerWrapperStyle = `display: flex;
                                width: 100%;
                                justify-content: center;
                                align-items: center;
                   
                         
        `;
    this.btnStyles = `display: flex;
                      width:100%;
                      max-width: 70px;
                      height: 42px;
                      padding: 1rem;
                      justify-content: center;
                      align-items: center;
                      border-radius: 10px;
                      background: ${this.buttonColor};
                      border: none;
                      color: white;
                      font-weight: 600;
                      cursor:pointer;
                      text-transform: capitalize;
                      color:${this.textColor}
                      `;

    this.extraButtonsStyles = `display: flex;
                                align-items: center;
                                flex-wrap:wrap;
                                width:100%;
                                justify-content: center;
                                max-width: 500px;
                                width:100%;
                                margin:0 auto;
                                gap:0.5rem`;

    this.selectStyles = `border-radius: 5px;
                      border: 2px solid ${this.buttonColor};
                      background: #fff;
                      width: 100%;
                      margin: 0 auto;
                      display: block;
                      padding: 5px;
                      text-align: center;`;

    this.grabAreaStyles = `background:${this.buttonColor};
                      width: fit-content;
                      padding: 0.1rem;
                      border-radius: 5px;
                      display:none`;
  }

  onUpdate() {
    this.timeLine.restart();
    this.pauseButton.innerHTML = pauseIcon(this.textColor);

    this.timeLine.eventCallback("onUpdate", () => {
      this.progressSlider.value = this.timeLine.progress();
      this.animationProgress.innerHTML = this.timeLine.time().toFixed(2);
      this.animationDuration.innerHTML = this.timeLine._dur;

      if (this.timeLine.progress() === 1 || this.timeLine.progress() === 0)
        this.pauseButton.innerHTML = playIcon(this.textColor);
      else if (
        this.timeLine.progress() !== 1 &&
        this.pauseButton.innerHTML !== pauseIcon(this.textColor)
      )
        this.pauseButton.innerHTML = pauseIcon(this.textColor);
    });
  }
}

export default GSAPController;
