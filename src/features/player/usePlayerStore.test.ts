import { beforeEach, describe, expect, it } from 'vitest';
import { generateSongs } from '../../data/songs';
import { usePlayerStore } from './usePlayerStore';

const songs = generateSongs(3);

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('playQueue đặt đúng hàng đợi và bài bắt đầu', () => {
    usePlayerStore.getState().playQueue(songs, 1);
    const s = usePlayerStore.getState();
    expect(s.queue).toEqual(songs);
    expect(s.currentIndex).toBe(1);
    expect(s.isPlaying).toBe(true);
    expect(s.position).toBe(0);
  });

  it('tick tăng position thêm 1 giây', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState().position).toBe(1);
  });

  it('tick ở giây cuối tự sang bài sau', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.setState({ position: songs[0].duration - 1 });
    usePlayerStore.getState().tick();
    const s = usePlayerStore.getState();
    expect(s.currentIndex).toBe(1);
    expect(s.position).toBe(0);
  });

  it('next ở bài cuối thì isPlaying là false', () => {
    usePlayerStore.getState().playQueue(songs, 2);
    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('prev khi đã phát quá 3 giây thì tua về 0:00', () => {
    usePlayerStore.getState().playQueue(songs, 1);
    usePlayerStore.setState({ position: 10 });
    usePlayerStore.getState().prev();
    const s = usePlayerStore.getState();
    expect(s.currentIndex).toBe(1);
    expect(s.position).toBe(0);
  });

  it('prev trong 3 giây đầu thì lùi bài trước', () => {
    usePlayerStore.getState().playQueue(songs, 1);
    usePlayerStore.getState().prev();
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });

  it('addToQueue bỏ qua bài đã có trong hàng đợi', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.getState().addToQueue(songs[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(3);
    usePlayerStore.getState().addToQueue(generateSongs(4)[3]);
    expect(usePlayerStore.getState().queue).toHaveLength(4);
  });

  it('togglePlay đổi trạng thái phát/tạm dừng', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });
});
