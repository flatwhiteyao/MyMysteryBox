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
    state: { user: { id: 1, nickname: 'AdminUser', role: 'admin' } }
  })
}));

describe('BlindBox CRUD Functionality Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  const mockBlindBoxes = [
    {
      id: 1,
      name: '测试盲盒',
      description: '这是一个测试盲盒',
      price: 100,
      photo: 'test.jpg',
      styles: [
        { name: '款式1', probability: '50%', photo: 'style1.jpg' },
        { name: '款式2', probability: '30%', photo: 'style2.jpg' }
      ]
    }
  ];

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  describe('BlindBox Create Tests', () => {
    test('should open create modal when create button is clicked', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const createButton = screen.getByText('创建盲盒');
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        expect(screen.getByText('创建盲盒')).toBeInTheDocument();
        expect(screen.getByLabelText('名称')).toBeInTheDocument();
        expect(screen.getByLabelText('描述')).toBeInTheDocument();
        expect(screen.getByLabelText('价格')).toBeInTheDocument();
      });
    });

    test('should validate required fields when creating blindbox', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const createButton = screen.getByText('创建盲盒');
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        const submitButton = screen.getByText('创建');
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/名称和价格不能为空/)).toBeInTheDocument();
      });
    });

    test('should create blindbox successfully with valid data', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: '创建成功'
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const createButton = screen.getByText('创建盲盒');
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText('名称');
        const descriptionInput = screen.getByLabelText('描述');
        const priceInput = screen.getByLabelText('价格');

        fireEvent.change(nameInput, { target: { value: '新盲盒' } });
        fireEvent.change(descriptionInput, { target: { value: '新盲盒描述' } });
        fireEvent.change(priceInput, { target: { value: '200' } });
      });

      await waitFor(() => {
        const submitButton = screen.getByText('创建');
        fireEvent.click(submitButton);
      });

      expect(fetch).toHaveBeenCalledWith('http://localhost:7001/blind-box', {
        method: 'POST',
        body: expect.any(FormData)
      });
    });
  });

  describe('BlindBox Update Tests', () => {
    test('should open edit modal when edit button is clicked', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const editButton = screen.getByText('编辑');
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        expect(screen.getByText('编辑盲盒')).toBeInTheDocument();
        expect(screen.getByDisplayValue('测试盲盒')).toBeInTheDocument();
        expect(screen.getByDisplayValue('这是一个测试盲盒')).toBeInTheDocument();
        expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      });
    });

    test('should update blindbox successfully', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: '更新成功'
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const editButton = screen.getByText('编辑');
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText('名称');
        fireEvent.change(nameInput, { target: { value: '更新后的盲盒' } });
      });

      await waitFor(() => {
        const submitButton = screen.getByText('更新');
        fireEvent.click(submitButton);
      });

      expect(fetch).toHaveBeenCalledWith('http://localhost:7001/blind-box', {
        method: 'PUT',
        body: expect.any(FormData)
      });
    });
  });

  describe('BlindBox Delete Tests', () => {
    test('should show confirmation dialog when delete button is clicked', async () => {
      global.window.confirm = jest.fn(() => true);

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: '删除成功'
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const deleteButton = screen.getByText('删除');
        fireEvent.click(deleteButton);
      });

      expect(global.window.confirm).toHaveBeenCalledWith('确定要删除这个盲盒吗？');
    });

    test('should delete blindbox when confirmed', async () => {
      global.window.confirm = jest.fn(() => true);

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: '删除成功'
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const deleteButton = screen.getByText('删除');
        fireEvent.click(deleteButton);
      });

      expect(fetch).toHaveBeenCalledWith('http://localhost:7001/blind-box?id=1', {
        method: 'DELETE'
      });
    });
  });

  describe('BlindBox Read Tests', () => {
    test('should display blindbox list correctly', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        expect(screen.getByText('测试盲盒')).toBeInTheDocument();
        expect(screen.getByText('这是一个测试盲盒')).toBeInTheDocument();
        expect(screen.getByText('价格: 100 元')).toBeInTheDocument();
      });
    });

    test('should handle API error when fetching blindboxes', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        expect(screen.getByText('网络错误，请稍后重试')).toBeInTheDocument();
      });
    });
  });

  describe('BlindBox Form Validation Tests', () => {
    test('should validate price field', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const createButton = screen.getByText('创建盲盒');
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        const priceInput = screen.getByLabelText('价格');
        fireEvent.change(priceInput, { target: { value: 'invalid' } });
      });

      await waitFor(() => {
        const submitButton = screen.getByText('创建');
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/名称和价格不能为空/)).toBeInTheDocument();
      });
    });

    test('should validate style information', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        const createButton = screen.getByText('创建盲盒');
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText('名称');
        const priceInput = screen.getByLabelText('价格');
        
        fireEvent.change(nameInput, { target: { value: '测试盲盒' } });
        fireEvent.change(priceInput, { target: { value: '100' } });
      });

      await waitFor(() => {
        const submitButton = screen.getByText('创建');
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/名称、价格、照片和至少一个款式信息不能为空/)).toBeInTheDocument();
      });
    });
  });

  describe('BlindBox Permission Tests', () => {
    test('should show admin controls for admin user', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        expect(screen.getByText('管理模式')).toBeInTheDocument();
        expect(screen.getByText('创建盲盒')).toBeInTheDocument();
      });
    });

    test('should not show admin controls for regular user', async () => {
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
        useLocation: () => ({
          state: { user: { id: 2, nickname: 'RegularUser', role: 'user' } }
        })
      }));

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: mockBlindBoxes
        })
      });

      renderWithRouter(<BlindBoxPage />);

      await waitFor(() => {
        expect(screen.queryByText('管理模式')).not.toBeInTheDocument();
        expect(screen.queryByText('创建盲盒')).not.toBeInTheDocument();
      });
    });
  });
}); 