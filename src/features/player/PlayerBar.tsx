import { useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore } from './usePlayerStore';

export function PlayerBar() {
  const song = usePlayerStore((s) => s.queue[s.currentIndex]);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => usePlayerStore.getState().tick(), 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <footer className="player-bar">
      <div className="now-playing">
        {song ? `Đang phát: ${song.title} - ${song.artist}` : 'Chưa phát bài nào'}
      </div>
      <ProgressBar />
      <div className="controls">
        <button type="button" onClick={prev}>
          Trước
        </button>
        <button type="button" onClick={togglePlay}>
          {isPlaying ? 'Tạm dừng' : 'Phát'}
        </button>
        <button type="button" onClick={next}>
          Sau
        </button>
      </div>
      <div className="queue-info">Hàng đợi: {queueLength} bài</div>
    </footer>
  );
}
