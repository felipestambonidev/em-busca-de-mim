/**
 * Raminho botânico em traço fino — desenhado à mão via DrawSVG.
 * Cada folha é um caminho independente para que possa ser "traçada" em sequência.
 */
type Leaf = [x: number, y: number, angle: number, length: number];

const STEM = "M22 318 C 40 262, 66 214, 78 160 C 90 104, 110 58, 146 10";

const LEAVES: Leaf[] = [
  [30, 290, -150, 46],
  [40, 262, -28, 44],
  [54, 232, -158, 42],
  [64, 208, -34, 40],
  [74, 178, -152, 38],
  [80, 150, -40, 36],
  [88, 118, -150, 32],
  [98, 90, -46, 30],
  [112, 64, -142, 26],
  [126, 42, -54, 22],
];

function leafPath(l: number) {
  const w = l * 0.34;
  return `M0 0 Q ${l * 0.48} ${-w} ${l} 0 Q ${l * 0.52} ${w} 0 0`;
}

export default function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg className={`sprig ${className}`} viewBox="0 0 170 330" aria-hidden="true" focusable="false">
      <path className="sprig__stem" d={STEM} />
      {LEAVES.map(([x, y, a, l], i) => (
        <path key={i} className="sprig__leaf" d={leafPath(l)} transform={`translate(${x} ${y}) rotate(${a})`} />
      ))}
      <circle className="sprig__bud" cx="150" cy="7" r="3" />
    </svg>
  );
}
