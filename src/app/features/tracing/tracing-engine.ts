export interface TraceDefinition {
  id: string;
  type: 'letter' | 'number' | 'shape';
  paths: string[];
}
export interface Point {
  x: number;
  y: number;
}
export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
/** Require ordered samples close to the guide, so scribbling over the canvas is not completion. */
export function advanceTrace(
  samples: Point[],
  current: number,
  point: Point,
  tolerance = 22,
): number {
  let next = current;
  while (
    next < samples.length &&
    next < current + 5 &&
    distance(samples[next], point) <= tolerance
  )
    next++;
  return next;
}
