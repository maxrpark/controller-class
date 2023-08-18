# controller-class

```js
// Define your GSAP animations using `gsap.to()` or `gsap.timeline()`, and give them distinct IDs for better identification:

const squareTl = gsap.timeline({ paused: true });
squareTl
  .to(".square", { x: 300 })
  .to(".square", {
    rotate: "360",
  })
  .to(".square", { scale: 1.5 }, "<");

squareTl.id = "Animation Square";

const circle = gsap.to(".circle", {
  background: "blue",
  x: 400,
  duration: 10,
});

new GSAPController({
  animations: [squareTl, circle], // pass array of tweens or timeline
  // animations: squareTl, // pass a single tween or timeline
});
```

## Configuration Options

- animations: A single tween timeline or and array of tweens and timelines. **_Required_**
- Draggable: A Draggable instance for making the controller draggable. **_Optional_**
- position: The position of the controller (default: 'bottom center').**_Optional_**
- theme: The theme for the controller (default: 'default').**_Optional_**
- backgroundColor: Background color for the controller (string).**_Optional_**
- buttonColor: Button color for the controller (string).**_Optional_**
- textColor: Text color for the controller (string).**_Optional_**
- width: Width of container, default 500px,(eg:"100px" or "100%"). **_Optional_**
- disable: Default false.(boolean) **_Optional_**
- activeAnimation: Animation id. Set default animation. **_Optional_**
- noShadow: If **_true_**, the container will not have box-shadow, default false. **_Optional_**
- parentSelector: Class name or Id. The controller will be appended to that element. **_Optional_**
- onStart: Callback function that fires when the controller is instantiated. This function receives the active animation timeline as a parameter.
- onSelectAnimationChange: Callback function that fires every time a new animation is selected. This function also receives the active animation timeline as a parameter.

```js
new GSAPController({
  animations: [squareTl, circle],
  Draggable,
  theme: "cool",
  position: "top right",
  width: "700px",
  buttonColor: "red",
  backgroundColor: "orange",
  textColor: "blue",
  activeAnimation: "Square Animation", // Set default the animation
  parentSelector: "#parent", // Append the controller to a specific DOM ELEMENT
  noShadow: true, // Default false
  onStart: (animation) => {}, // callback that fire when instantiated,
  onSelectAnimationChange: (animation) => {}, // callback that fire every time a new animation is selected
});
```

## Select Active Animation

You can easily choose and control different animations using the select dropdown provided by the GSAP Controller. This feature allows you to manage multiple animations and control their playback seamlessly.

1. Define your GSAP animations using `gsap.to()` or `gsap.timeline()`, and give them distinct IDs for better identification:

```javascript
const squareTl = gsap.timeline({ paused: true });
squareTl
  .to(".square", { x: 300 })
  .to(".square", {
    rotate: "360",
  })
  .to(".square", { scale: 1.5 }, "<");

squareTl.id = "Square Animation"; // Customize the animation ID

const circle = gsap.to(".circle", {
  background: "blue",
  x: 400,
  duration: 10,
});

circle.id = "Circle Animation"; // Customize the animation ID
```

## Enabling the Draggable Feature

The GSAP Controller package offers the ability to make the controller itself draggable using the GSAP Draggable plugin. This allows you to easily move the controller around the screen as needed. To enable this feature, follow these steps:

1. First, make sure you have the necessary modules imported at the beginning of your script:

```javascript
import GSAPController from "gsap-controller";
import Draggable from "gsap/Draggable.js";
import gsap from "gsap";
gsap.registerPlugin(Draggable);

const squareTl = gsap.timeline({ paused: true });
squareTl
  .to(".square", { x: 300 })
  .to(".square", {
    rotate: "360",
  })
  .to(".square", { scale: 1.5 }, "<");

const controller = new GSAPController({
  animations: squareTl,
  Draggable, // Enable the draggable feature
});
```

2. Drag the container around grabbing it from the top right corner.

## Positions

If you don't want to use the draggable feature you can still position the container using the following values.

- 'top left'
- 'top center'
- 'top right'
- 'center left'
- 'center center'
- 'center right'
- 'bottom left'
- 'bottom center'
- 'bottom right'

### Appending Controller to Specified Parent Element

The GSAP Controller supports appending the controller to a specified parent element using the `parentSelector` property. This feature provides more flexibility in where the controller is placed within the DOM.

To use this feature, follow these guidelines:

1. Include the `parentSelector` property when creating a new instance of the GSAP Controller. You can pass a class name, or ID as the value.

2. If `parentSelector` corresponds to a valid DOM element, the controller will be appended to that parent element. If the element is not found or the `parentSelector` is not provided, the controller will be appended to the `body` element by default.

## Themes

The package provides several themes you can choose from:

- default: A default light theme.
- elegant: An elegant dark theme.
- cool: A cool blue theme.
- warm: A warm orange theme.
- dark: A dark theme suitable for low-light environments.
