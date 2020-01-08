import Color from 'c0lor';
import xyz from 'color-space/xyz';
import temperature from 'color-temperature';
import mired from 'mired';

const gamma = 2.1;

// Color space values documented at https://homeautotechs.com/philips-hue-light-models-full-list/
export const A = Color.space.rgb(Color.xyY(0.704, 0.296), Color.xyY(0.2151, 0.7106), Color.xyY(0.138, 0.08), Color.white.A, gamma);
export const B = Color.space.rgb(Color.xyY(0.675, 0.322), Color.xyY(0.409, 0.518), Color.xyY(0.167, 0.04), Color.white.B, gamma);
export const C = Color.space.rgb(Color.xyY(0.692, 0.308), Color.xyY(0.17, 0.7), Color.xyY(0.153, 0.048), Color.white.C, gamma);

const divisions = 6; // 6 matches primary and secondary colors, 12 is tertiary.

const divided_rgb = [...Array(divisions + 1).keys()].map(i => i * 360 / divisions).map(hue => Color.hsv(hue / 360,1,1).rgb());

const white = ({ white: { X, Y, Z } }) => ([X, Y, Z]);

const dividedSpace = space => divided_rgb.map(rgb => space.XYZ(rgb)).map(({ X, Y, Z }) => xyz.rgb([X, Y, Z], white(space)))

export const divided_A = dividedSpace(A);
export const divided_B = dividedSpace(B);
export const divided_C = dividedSpace(C);

export const loop = colors => [...colors, colors[0]];

export const miredToRGB = m => (({ red, green, blue }) => [red, green, blue])(temperature.colorTemperature2rgb(mired.miredToKelvin(m)));

export const miredRange = r => [...Array(divisions + 1).keys()].map(i => (i * (Math.max(...r) - Math.min(...r)) / divisions) + Math.min(...r)).map(miredToRGB);

export const visibleChromaticity = [
  [0.177552, 0.013201],
  [0.177442, 0.013217],
  [0.177229, 0.013151],
  [0.176994, 0.013158],
  [0.176762, 0.013031],
  [0.176444, 0.013008],
  [0.175992, 0.013031],
  [0.175495, 0.013063],
  [0.174805, 0.01333],
  [0.173682, 0.014013],
  [0.172229, 0.015121],
  [0.170219, 0.016771],
  [0.167698, 0.019066],
  [0.164333, 0.021995],
  [0.159806, 0.025895],
  [0.154044, 0.030918],
  [0.146902, 0.037868],
  [0.138285, 0.048035],
  [0.12668, 0.06595],
  [0.111852, 0.09499],
  [0.093162, 0.140862],
  [0.07007, 0.208877],
  [0.046225, 0.303041],
  [0.023805, 0.420426],
  [0.008188, 0.545406],
  [0.003783, 0.660625],
  [0.013933, 0.754417],
  [0.039217, 0.814541],
  [0.075015, 0.834925],
  [0.115171, 0.82639],
  [0.155958, 0.805392],
  [0.194252, 0.780704],
  [0.231059, 0.753119],
  [0.267224, 0.722956],
  [0.303004, 0.690898],
  [0.338659, 0.65749],
  [0.374237, 0.623227],
  [0.409656, 0.588587],
  [0.444712, 0.553963],
  [0.479106, 0.519776],
  [0.512455, 0.486535],
  [0.544366, 0.454774],
  [0.574321, 0.424986],
  [0.601689, 0.397671],
  [0.625405, 0.374058],
  [0.646238, 0.353329],
  [0.663443, 0.336271],
  [0.677497, 0.322271],
  [0.688698, 0.311093],
  [0.697619, 0.302233],
  [0.704787, 0.295104],
  [0.710779, 0.289129],
  [0.715674, 0.284243],
  [0.719586, 0.280341],
  [0.722479, 0.277458],
  [0.724574, 0.275369],
  [0.725939, 0.274007],
  [0.727227, 0.272723],
  [0.72821, 0.271742],
  [0.728919, 0.271035],
  [0.729413, 0.270542],
  [0.729714, 0.270242],
  [0.729876, 0.270081],
  [0.730037, 0.26992],
  [0.7301, 0.269857],
  [0.730065, 0.269892],
  [0.729957, 0.27],
  [0.729795, 0.270162],
  [0.729586, 0.27037],
  [0.729331, 0.270624],
  [0.729049, 0.270906],
  [0.728739, 0.271215],
  [0.728408, 0.271545],
  [0.728063, 0.271889],
  [0.727689, 0.272262],
  [0.727304, 0.272646],
  [0.726901, 0.273048],
  [0.726463, 0.273485],
  [0.726021, 0.273925],
  [0.725564, 0.274381],
  [0.725083, 0.274861],
  [0.724592, 0.275351],
  [0.724094, 0.275848],
  [0.723582, 0.276359],
  [0.723065, 0.276874],
  [0.722533, 0.277405],
  [0.721995, 0.277941],
  [0.721458, 0.278476],
  [0.720898, 0.279035],
  [0.720345, 0.279587]
];