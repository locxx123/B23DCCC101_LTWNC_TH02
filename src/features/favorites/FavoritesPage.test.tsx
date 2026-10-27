import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePlayerStore } from '../player/usePlayerStore';
import FavoritesPage from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';

describe('FavoritesPage', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('chưa có bài yêu thích thì hiện thông báo', () => {
    render(<FavoritesPage />);
    expect(screen.getByText('Bạn chưa có bài hát yêu thích')).toBeInTheDocument();
  });

  it('liệt kê bài đã thích, Phát tất cả đưa vào hàng đợi, bỏ thích thì biến mất', async () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    render(<FavoritesPage />);
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }));
    expect(usePlayerStore.getState().queue.map((s) => s.id)).toEqual(['s1', 's3']);
    await userEvent.click(screen.getAllByRole('button', { name: 'Bỏ yêu thích' })[0]);
    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
  });

  it('bấm Phát ở một dòng thì phát từ bài đó', async () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    render(<FavoritesPage />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Phát' })[1]);
    expect(usePlayerStore.getState().currentIndex).toBe(1);
  });
});
