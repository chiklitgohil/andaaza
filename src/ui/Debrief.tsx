import { LABEL_COLOR, LABEL_MEANING, type Label } from '../content/types';

export function Chip({ label }: { label: Label }) {
  return (
    <span className="chip" style={{ ['--c' as string]: LABEL_COLOR[label] }} title={LABEL_MEANING[label]}>
      {label}
    </span>
  );
}
