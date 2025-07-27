import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlindBoxPage from '../BlindBoxPage';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { user: { id: 1, nickname: 'TestUser', role: 'user' } }
  })
}));

describe('Search Functionality Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  const mockBlindBoxes = [
    {
      id: 1,
      name: '测试盲盒1',
      description: '这是一个测试盲盒',
      price: 100,
      photo: 'test1.jpg'
    },
    {
      id: 2,
      name: '特殊盲盒',
      description: '这是一个特殊的盲盒',
      price: 200,
      photo: 'test2.jpg'
    },
    {
      id: 3,
      name: '普通盲盒',
      description: '这是一个普通的盲盒',
      price: 150,
      photo: 'test3.jpg'
    }
  ];

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  describe('Search Input Tests', () => {
    test('should render search input field', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        expect(searchInput).toBeInTheDocument();
      });
    });

    test('should update search keyword when typing', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        fireEvent.change(searchInput, { target: { value: '测试' } });
        expect(searchInput.value).toBe('测试');
      });
    });
  });

  describe('Search Filtering Tests', () => {
    test('should filter blind boxes by name', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        fireEvent.change(searchInput, { target: { value: '测试' } });
      });

      await waitFor(() => {
        expect(screen.getByText('测试盲盒1')).toBeInTheDocument();
        expect(screen.queryByText('特殊盲盒')).not.toBeInTheDocument();
        expect(screen.queryByText('普通盲盒')).not.toBeInTheDocument();
      });
    });

    test('should filter blind boxes by description', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        fireEvent.change(searchInput, { target: { value: '特殊' } });
      });

      await waitFor(() => {
        expect(screen.getByText('特殊盲盒')).toBeInTheDocument();
        expect(screen.queryByText('测试盲盒1')).not.toBeInTheDocument();
        expect(screen.queryByText('普通盲盒')).not.toBeInTheDocument();
      });
    });

    test('should show all blind boxes when search is empty', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        expect(screen.getByText('测试盲盒1')).toBeInTheDocument();
        expect(screen.getByText('特殊盲盒')).toBeInTheDocument();
        expect(screen.getByText('普通盲盒')).toBeInTheDocument();
      });
    });

    test('should be case insensitive', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        fireEvent.change(searchInput, { target: { value: 'TEST' } });
      });

      await waitFor(() => {
        expect(screen.getByText('测试盲盒1')).toBeInTheDocument();
      });
    });
  });

  describe('Search Performance Tests', () => {
    test('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        name: `盲盒${index + 1}`,
        description: `这是第${index + 1}个盲盒`,
        price: 100 + index,
        photo: `photo${index + 1}.jpg`
      }));

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: largeDataset
        })
      });

      const startTime = performance.now();
      
      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        fireEvent.change(searchInput, { target: { value: '盲盒1' } });
      });

      const endTime = performance.now();
      const searchTime = endTime - startTime;

      // 搜索应该在合理时间内完成（小于100ms）
      expect(searchTime).toBeLessThan(100);
    });
  });

  describe('Search Edge Cases', () => {
    test('should handle special characters in search', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        fireEvent.change(searchInput, { target: { value: '!@#$%' } });
      });

      await waitFor(() => {
        // 应该显示无结果或所有结果
        expect(screen.queryByText('测试盲盒1')).not.toBeInTheDocument();
      });
    });

    test('should handle empty search results', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索盲盒');
        fireEvent.change(searchInput, { target: { value: '不存在的盲盒' } });
      });

      await waitFor(() => {
        expect(screen.queryByText('测试盲盒1')).not.toBeInTheDocument();
        expect(screen.queryByText('特殊盲盒')).not.toBeInTheDocument();
        expect(screen.queryByText('普通盲盒')).not.toBeInTheDocument();
      });
    });
  });
}); 