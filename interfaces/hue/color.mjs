import Color from 'c0lor';

const gamma = 2.1;

const A = Color.space.rgb(Color.xyY(0.704, 0.296), Color.xyY(0.2151, 0.7106), Color.xyY(0.138, 0.08), Color.white.A, gamma);
const B = Color.space.rgb(Color.xyY(0.675, 0.322), Color.xyY(0.409, 0.518), Color.xyY(0.167, 0.04), Color.white.B, gamma);
const C = Color.space.rgb(Color.xyY(0.692, 0.308), Color.xyY(0.17, 0.7), Color.xyY(0.153, 0.048), Color.white.C, gamma);