import { formatDuration } from '../../utils/format';
import { usePlayerStore } from './usePlayerStore';

export function ProgressBar() {
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.queue[s.currentIndex]?.duration ?? 0);
  const percent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="progress">
      <span>
        {formatDuration(position)} / {formatDuration(duration)}
      </span>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
