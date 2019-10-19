// Use OLED screen on NeoTrellis to visualize state
// https://memory.grid.robotjamie.com/pixil-frame-0.png

const fixtureControl = (column, nextControl, valueTopic, upTopic, downTopic, toggleTopic) => {
  // Display an interface on column
  // ⃞ current value - button triggers "next"
  // ⃞ current value unsaturated and brightened with limit - button triggers "upTopic"
  // ⃞ current value unsaturated and dimmed with limit - button triggers "downTopic"
  // ⃞ dull red/green (depending on toggleState) + mixed current value - button triggers "toggleTopic"
}

const spectrumControl = (returnButton) => {
  // Display entire rainbow across Trellis
  // Keep one button blank as escape key, all others return their RGB value
  // (make it fancy with a transition that fades rainbow out from circle around returnButton)
} 

import Two from 'two.js';


var elem = document.getElementById('app');
var two = new Two({ width: 285, height: 200, type: Two.Types.webgl }).appendTo(elem);


var rect = two.makeRectangle(0, 0, 30, 30);

rect.fill = 'rgba(0, 200, 255, 0.75)';
rect.stroke = '#1C75BC';

// Groups can take an array of shapes and/or groups.
var group = two.makeGroup(rect);

// And have translation, rotation, scale like all shapes.
group.translation.set(two.width / 2, two.height / 2);
group.rotation = Math.PI;
group.scale = 0.75;

// You can also set the same properties a shape have.
group.linewidth = 2;

two.update();