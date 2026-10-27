import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Song } from '../../types';
import { SongRow } from './SongRow';

const song: Song = { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 };

describe('SongRow', () => {
  it('hiển thị tên bài và thời lượng 2:30', () => {
    render(
      <SongRow song={song} index={0} isFavorite={false} onPlay={vi.fn()} onToggleFavorite={vi.fn()} onAddToQueue={vi.fn()} />,
    );
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('bấm Phát thì hàm onPlay được gọi với đúng bài hát', async () => {
    const onPlay = vi.fn();
    render(
      <SongRow song={song} index={0} isFavorite={false} onPlay={onPlay} onToggleFavorite={vi.fn()} onAddToQueue={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Phát' }));
    expect(onPlay).toHaveBeenCalledWith(song);
  });

  it('nút yêu thích đổi aria-label theo trạng thái', () => {
    render(
      <SongRow song={song} index={0} isFavorite onPlay={vi.fn()} onToggleFavorite={vi.fn()} onAddToQueue={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Bỏ yêu thích' })).toBeInTheDocument();
  });
});
