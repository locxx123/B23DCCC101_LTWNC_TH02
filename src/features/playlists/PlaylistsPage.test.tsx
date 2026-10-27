import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { PlaylistProvider } from './PlaylistContext';
import PlaylistsPage from './PlaylistsPage';

const renderWithProviders = (ui: ReactElement) =>
  render(
    <PlaylistProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </PlaylistProvider>,
  );

describe('PlaylistsPage', () => {
  beforeEach(() => localStorage.clear());

  it('bấm Tạo khi để trống thì báo lỗi tên không được để trống', async () => {
    renderWithProviders(<PlaylistsPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByText('Tên playlist không được để trống')).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    renderWithProviders(<PlaylistsPage />);
    await userEvent.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('link', { name: 'Chạy bộ' })).toBeInTheDocument();
  });

  it('tạo trùng tên (không phân biệt hoa thường) thì báo đã tồn tại', async () => {
    renderWithProviders(<PlaylistsPage />);
    const input = screen.getByLabelText('Tên playlist');
    await userEvent.type(input, 'Chạy bộ');
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    await userEvent.type(input, 'chạy bộ');
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
  });
});
