import "./style.css";
import GUI from "lil-gui";
import { PositionType, ThemeType } from "./controller/globalTs";
import GSAPController from "./controller/index";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

// GUI configurator
const gui = new GUI();

let draggableItem: string | boolean = localStorage.getItem("draggableEnable")!;
if (draggableItem) {
  if (draggableItem === "false") {
    draggableItem = false;
  } else {
    draggableItem = true;
  }
}
let wrapperShadow: string | boolean = localStorage.getItem("noShadow")!;
if (wrapperShadow) {
  if (wrapperShadow === "false") {
    wrapperShadow = false;
  } else {
    wrapperShadow = true;
  }
}

const debugObject = {
  theme: localStorage.getItem("theme") || "default",
  position: localStorage.getItem("position") || "bottom center",
  noShadow: localStorage.getItem("noShadow") ? wrapperShadow : false,
  draggableEnable: localStorage.getItem("draggableEnable")
    ? draggableItem
    : true,
  resetValues: () => {
    localStorage.clear();
    window.location.reload();
  },
};
////

const title = document.querySelector("#active-ani")!;
const descriptionElements = gsap.utils.toArray("#desc-el");

const squareTl = gsap.timeline({ ease: "none" });
squareTl
  .to(".square", { x: 500, duration: 1.5 })
  .to(".square", {
    rotate: 360,
    scale: 1.5,
    background: "blue",
    borderRadius: 50,
  })
  .to(".square", { x: 0 })
  .to(".square", {
    rotate: "+=360",
    scale: 1,
    background: "red",
    borderRadius: 0,
  });

squareTl.id = "Square Animation";

const circle = gsap.to(".circle", {
  background: "blue",
  xPercent: 500,
  yPercent: 400,
  duration: 2,
  borderRadius: 0,
  paused: true,
  scale: 2,
});
const dscElementAni = gsap.timeline().from(descriptionElements, {
  yPercent: 100,
  opacity: 0,
  stagger: 0.5,
});

dscElementAni.id = "Main Title";

new GSAPController({
  animations: [squareTl, circle, dscElementAni], // pass a single tween ot tl or and array of them
  Draggable: debugObject.draggableEnable && Draggable, // draggable instance to make it draggable.
  theme: debugObject.theme as ThemeType,
  position: debugObject.position as PositionType,
  activeAnimation: "Square Animation",
  noShadow: debugObject.noShadow as boolean,
  onStart: (tl) => {
    // callback when the class is created
    title.textContent = tl.id;
  },
  onSelectAnimationChange: (tl) => {
    // callback every time a active animation is selected
    title.textContent = tl.id;
  },
});

// Debugger GUI

gui
  .add(debugObject, "theme", {
    Default: "default",
    Dark: "dark",
    Elegant: "elegant",
    Cool: "cool",
    Warm: "warm",
  })
  .onChange((value: string) => {
    updateController("theme", value);
  })
  .name("Theme");
gui
  .add(debugObject, "position", {
    "top left": "top left",
    "top center": "top center",
    "top right": "top right",
    "center left": "center left",
    "center center": "center center",
    "center right": "center right",
    "bottom left": "bottom left",
    "bottom center": "bottom center",
    "bottom right": "bottom right",
  })
  .onChange((value: string) => {
    updateController("position", value);
  })
  .name("Position");

gui
  .add(debugObject, "draggableEnable")
  .onChange((value: string) => {
    updateController("draggableEnable", value);
  })
  .name("Draggable Enable");
gui
  .add(debugObject, "noShadow")
  .onChange((value: string) => {
    updateController("noShadow", value);
  })
  .name("No Shadow");

gui.add(debugObject, "resetValues").name("Reset values");

const updateController = (itemName: string, value: string) => {
  localStorage.setItem(itemName, value);
  window.location.reload();
};
