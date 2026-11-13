import type { Label } from '../data/types';
import { LABEL_INFO } from '../data/labels';

export function LabelChip({ label, compact = false }: { label: Label; compact?: boolean }) {
  const info = LABEL_INFO[label];
  const dashed = label === 'WHAT-IF' || label === 'FICTIONAL';
  return (
    <span
      className={`chip ${dashed ? 'chip-dashed' : ''}`}
      style={{ ['--chip' as string]: info.color }}
      title={info.long}
    >
      <span className="chip-dot" aria-hidden="true" />
      {compact ? info.short : label}
      <span className="sr-only">: {info.long}</span>
    </span>
  );
}

export function IllustrativeTag() {
  return (
    <span className="chip chip-illus" title="This number is invented to illustrate a mechanism. It is not a measurement.">
      ILLUSTRATIVE
    </span>
  );
}
