import Color from 'c0lor';
import xyz from 'color-space/xyz';
import temperature from 'color-temperature';
import mired from 'mired';

const gamma = 2.1;

// Color space values documented at https://homeautotechs.com/philips-hue-light-models-full-list/
const A = Color.space.rgb(Color.xyY(0.704, 0.296), Color.xyY(0.2151, 0.7106), Color.xyY(0.138, 0.08), Color.white.A, gamma);
const B = Color.space.rgb(Color.xyY(0.675, 0.322), Color.xyY(0.409, 0.518), Color.xyY(0.167, 0.04), Color.white.B, gamma);
const C = Color.space.rgb(Color.xyY(0.692, 0.308), Color.xyY(0.17, 0.7), Color.xyY(0.153, 0.048), Color.white.C, gamma);

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
