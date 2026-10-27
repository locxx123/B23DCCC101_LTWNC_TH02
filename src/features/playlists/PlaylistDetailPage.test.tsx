import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePlayerStore } from '../player/usePlayerStore';
import { PlaylistProvider } from './PlaylistContext';
import PlaylistDetailPage from './PlaylistDetailPage';

const renderAt = (path: string) =>
  render(
    <PlaylistProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </MemoryRouter>
    </PlaylistProvider>,
  );

describe('PlaylistDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('playlist không tồn tại thì báo không tìm thấy', () => {
    renderAt('/playlists/khong-co');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('hiển thị tổng thời lượng, phát tất cả và bỏ bài', async () => {
    localStorage.setItem(
      'music-playlists',
      JSON.stringify([{ id: 'p1', name: 'Chạy bộ', songIds: ['s1', 's2'] }]),
    );
    renderAt('/playlists/p1');
    expect(screen.getByText('Tổng thời lượng: 5 phút 37 giây')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }));
    expect(usePlayerStore.getState().queue).toHaveLength(2);
    await userEvent.click(screen.getAllByRole('button', { name: 'Bỏ' })[0]);
    expect(screen.getByText('Tổng thời lượng: 3 phút 7 giây')).toBeInTheDocument();
  });
});
