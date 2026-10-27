import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { PlaylistProvider } from '../playlists/PlaylistContext';
import LibraryPage from './LibraryPage';

const renderPage = (ui: ReactElement) =>
  render(
    <PlaylistProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </PlaylistProvider>,
  );

describe('LibraryPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('hiển thị tổng 10000 bài hát và chỉ render một phần nhỏ dòng', () => {
    renderPage(<LibraryPage />);
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '+ Hàng đợi' }).length).toBeLessThan(30);
  });

  it('tìm "mưa" sau khi debounce thì còn 1250 bài', async () => {
    renderPage(<LibraryPage />);
    await userEvent.type(screen.getByLabelText('Tìm kiếm'), 'mưa');
    expect(await screen.findByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();
  });

  it('lọc thể loại Rock còn 2000 bài, gõ xyz thì không tìm thấy', async () => {
    renderPage(<LibraryPage />);
    await userEvent.selectOptions(screen.getByLabelText('Thể loại'), 'Rock');
    expect(screen.getByText('Tìm thấy 2000 bài hát')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Tìm kiếm'), 'xyz');
    expect(await screen.findByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });

  it('sắp xếp Tên A-Z thì dòng đầu là "Biển bình yên 1"', async () => {
    renderPage(<LibraryPage />);
    await userEvent.selectOptions(screen.getByLabelText('Sắp xếp'), 'name');
    expect(screen.getByText('Biển bình yên 1')).toBeInTheDocument();
  });

  it('bấm Phát đặt hàng đợi là danh sách đang hiển thị, bấm yêu thích lưu id', async () => {
    renderPage(<LibraryPage />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Phát' })[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(10000);
    expect(usePlayerStore.getState().currentIndex).toBe(0);
    await userEvent.click(screen.getAllByRole('button', { name: 'Thêm vào yêu thích' })[0]);
    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
  });

  it('nút + Playlist bị khóa khi chưa chọn playlist', () => {
    renderPage(<LibraryPage />);
    expect(screen.getAllByRole('button', { name: '+ Playlist' })[0]).toBeDisabled();
  });
});
