import { describe, expect, it } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  const songs = generateSongs(10000);

  it('sinh đúng 10000 bài hát', () => {
    expect(songs).toHaveLength(10000);
  });
  it('mọi id đều không trùng nhau', () => {
    expect(new Set(songs.map((s) => s.id)).size).toBe(10000);
  });
  it('mọi thời lượng nằm trong khoảng 150–300 giây', () => {
    expect(songs.every((s) => s.duration >= 150 && s.duration <= 300)).toBe(true);
  });
  it('các bài đầu khớp với dữ liệu mẫu', () => {
    expect(songs[0]).toMatchObject({ id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 });
    expect(songs[1]).toMatchObject({ title: 'Nắng tháng Sáu 1', artist: 'Quang Huy', genre: 'Indie', duration: 187 });
  });
});
