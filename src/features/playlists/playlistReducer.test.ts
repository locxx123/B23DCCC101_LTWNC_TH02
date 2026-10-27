import { describe, expect, it } from 'vitest';
import type { Playlist } from '../../types';
import { playlistReducer } from './playlistReducer';

const base: Playlist[] = [{ id: 'p1', name: 'Chạy bộ', songIds: ['s1'] }];

describe('playlistReducer', () => {
  it('tạo playlist mới với danh sách bài rỗng', () => {
    const state = playlistReducer([], { type: 'create', id: 'p1', name: 'Chạy bộ' });
    expect(state).toEqual([{ id: 'p1', name: 'Chạy bộ', songIds: [] }]);
  });
  it('thêm bài vào playlist', () => {
    const state = playlistReducer(base, { type: 'addSong', playlistId: 'p1', songId: 's2' });
    expect(state[0].songIds).toEqual(['s1', 's2']);
  });
  it('không thêm bài trùng vào playlist', () => {
    const state = playlistReducer(base, { type: 'addSong', playlistId: 'p1', songId: 's1' });
    expect(state[0].songIds).toEqual(['s1']);
  });
  it('xóa bài khỏi playlist', () => {
    const state = playlistReducer(base, { type: 'removeSong', playlistId: 'p1', songId: 's1' });
    expect(state[0].songIds).toEqual([]);
  });
  it('xóa playlist không tồn tại thì state giữ nguyên', () => {
    const state = playlistReducer(base, { type: 'remove', id: 'khong-co' });
    expect(state).toEqual(base);
  });
  it('xóa playlist đang có khỏi danh sách', () => {
    expect(playlistReducer(base, { type: 'remove', id: 'p1' })).toEqual([]);
  });
  it('đổi tên playlist và không sửa trực tiếp state cũ', () => {
    const state = playlistReducer(base, { type: 'rename', id: 'p1', name: 'Tập gym' });
    expect(state[0].name).toBe('Tập gym');
    expect(base[0].name).toBe('Chạy bộ');
  });
});
