import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateSongs } from '../../data/songs';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore } from './usePlayerStore';

describe('PlayerBar', () => {
  beforeEach(() => {
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });
  afterEach(() => vi.useRealTimers());

  it('chưa phát gì thì hiện "Chưa phát bài nào" và hàng đợi 0 bài', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
  });

  it('đang phát thì hiện tên bài và đồng hồ chạy mỗi giây', () => {
    vi.useFakeTimers();
    render(<PlayerBar />);
    act(() => usePlayerStore.getState().playQueue(generateSongs(2), 0));
    expect(screen.getByText('Đang phát: Mưa tháng Sáu 1 - Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('0:00 / 2:30')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument();
  });

  it('bấm Tạm dừng thì thời gian đứng yên, bấm Sau thì sang bài kế', async () => {
    render(<PlayerBar />);
    act(() => usePlayerStore.getState().playQueue(generateSongs(2), 0));
    await userEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    await userEvent.click(screen.getByRole('button', { name: 'Sau' }));
    expect(screen.getByText('Đang phát: Nắng tháng Sáu 1 - Quang Huy')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });
});
