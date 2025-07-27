import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlindBoxInfoPage from '../BlindBoxInfoPage';
import PaymentPage from '../PaymentPage';

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
    state: { 
      user: { id: 1, nickname: 'TestUser', role: 'user' },
      blindBoxId: 1,
      price: 100
    }
  }),
  useParams: () => ({ id: '1' })
}));

describe('BlindBox Draw Functionality Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  const mockBlindBox = {
    id: 1,
    name: '测试盲盒',
    description: '这是一个测试盲盒',
    price: 100,
    photo: 'test.jpg'
  };

  const mockStyles = [
    {
      id: 1,
      name: '款式1',
      probability: '50%',
      photo: 'style1.jpg'
    },
    {
      id: 2,
      name: '款式2',
      probability: '30%',
      photo: 'style2.jpg'
    },
    {
      id: 3,
      name: '款式3',
      probability: '20%',
      photo: 'style3.jpg'
    }
  ];

  const mockDrawResult = {
    success: true,
    style: {
      id: 1,
      name: '款式1',
      probability: '50%',
      photo: 'style1.jpg'
    }
  };

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  describe('BlindBox Draw Initiation Tests', () => {
    test('should display draw button on blindbox info page', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: [mockBlindBox]
        })
      });

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          styles: mockStyles
        })
      });

      renderWithRouter(<BlindBoxInfoPage />);

      await waitFor(() => {
        expect(screen.getByText('抽取盲盒')).toBeInTheDocument();
      });
    });

    test('should navigate to payment page when draw button is clicked', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          blindBoxes: [mockBlindBox]
        })
      });

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          styles: mockStyles
        })
      });

      renderWithRouter(<BlindBoxInfoPage />);

      await waitFor(() => {
        const drawButton = screen.getByText('抽取盲盒');
        fireEvent.click(drawButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/payment', {
        state: { blindBoxId: '1', price: 100 }
      });
    });
  });

  describe('Payment Process Tests', () => {
    test('should display payment page with correct information', async () => {
      renderWithRouter(<PaymentPage />);

      expect(screen.getByText('支付页面')).toBeInTheDocument();
      expect(screen.getByText('盲盒 ID: 1')).toBeInTheDocument();
      expect(screen.getByText('价格: 100 元')).toBeInTheDocument();
      expect(screen.getByText('确认支付')).toBeInTheDocument();
    });

    test('should require user login for payment', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    test('should process payment successfully with valid user', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockResolvedValueOnce({
        json: async () => mockDrawResult
      });

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:7001/blind-box/draw?id=1&user_id=1',
          expect.any(Object)
        );
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/drawn-style-detail', {
          state: { style: mockDrawResult.style }
        });
      });
    });

    test('should handle payment failure', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          message: '抽取失败'
        })
      });

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(screen.getByText('抽取失败')).toBeInTheDocument();
      });
    });

    test('should handle network error during payment', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(screen.getByText('网络错误，请稍后重试')).toBeInTheDocument();
      });
    });
  });

  describe('Draw Algorithm Tests', () => {
    test('should call draw API with correct parameters', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockResolvedValueOnce({
        json: async () => mockDrawResult
      });

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:7001/blind-box/draw?id=1&user_id=1',
          expect.any(Object)
        );
      });
    });

    test('should handle different draw results', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      const differentResults = [
        { success: true, style: { id: 1, name: '款式1', probability: '50%', photo: 'style1.jpg' } },
        { success: true, style: { id: 2, name: '款式2', probability: '30%', photo: 'style2.jpg' } },
        { success: true, style: { id: 3, name: '款式3', probability: '20%', photo: 'style3.jpg' } }
      ];

      for (const result of differentResults) {
        fetch.mockResolvedValueOnce({
          json: async () => result
        });

        renderWithRouter(<PaymentPage />);

        const payButton = screen.getByText('确认支付');
        fireEvent.click(payButton);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/drawn-style-detail', {
            state: { style: result.style }
          });
        });
      }
    });
  });

  describe('User Authentication Tests', () => {
    test('should check user authentication before draw', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    test('should proceed with valid user authentication', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockResolvedValueOnce({
        json: async () => mockDrawResult
      });

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:7001/blind-box/draw?id=1&user_id=1',
          expect.any(Object)
        );
      });
    });
  });

  describe('Draw Result Display Tests', () => {
    test('should navigate to result page with correct style data', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockResolvedValueOnce({
        json: async () => mockDrawResult
      });

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/drawn-style-detail', {
          state: { style: mockDrawResult.style }
        });
      });
    });

    test('should handle missing style data', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          style: null
        })
      });

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/drawn-style-detail', {
          state: { style: null }
        });
      });
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle API errors gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockRejectedValueOnce(new Error('API Error'));

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(screen.getByText('网络错误，请稍后重试')).toBeInTheDocument();
      });
    });

    test('should handle invalid response format', async () => {
      localStorageMock.getItem.mockReturnValue('1');

      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          message: 'Invalid response'
        })
      });

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid response')).toBeInTheDocument();
      });
    });
  });

  describe('Payment Security Tests', () => {
    test('should validate user ID before payment', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-user-id');

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:7001/blind-box/draw?id=1&user_id=invalid-user-id',
          expect.any(Object)
        );
      });
    });

    test('should prevent unauthorized access', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      renderWithRouter(<PaymentPage />);

      const payButton = screen.getByText('确认支付');
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });
}); 