/* mapper function, takes an object of mappings as direct translations
 * or special strings such as a range to alter the input value
 * returns a single mapped value.
 */
const rangeRegex = /([0-9]+)-([0-9]+)/;

export default (map, value) => {
  if (!map) return value; // No mapping
  if (Object.hasOwnProperty.call(map, value)) return map[value] || value;  // Direct mapping
  const ranges = Object.keys(map)
    .map(mapKey => mapKey.match(rangeRegex))
    .filter(match => match !== null)
    .map(([input, inMin, inMax]) => {
      const [, outMin, outMax] = map[input].match(rangeRegex);
      return {
        inMin: Number(inMin),
        inMax: Number(inMax),
        outMin: Number(outMin),
        outMax: Number(outMax),
      }
    });
  const range = ranges.find(({ inMin, inMax }) => value >= inMin && value <= inMax);
  if (range) { // Range mapping
    const { inMin, inMax, outMin, outMax } = range;
    return Math.round((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
  }
  return value;
}
