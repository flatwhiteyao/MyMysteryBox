import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { blindBoxId, price } = location.state;

    const handlePaymentSuccess = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('请先登录');
                navigate('/login');
                return;
            }
            const response = await fetch(`http://localhost:7001/blind-box/draw?id=${blindBoxId}&user_id=${userId}`);
            const data = await response.json();
            if (data.success) {
                navigate('/drawn-style-detail', { state: { style: data.style } });
            } else {
                alert(data.message || '抽取失败');
            }
        } catch (error) {
            console.error('抽取盲盒错误:', error);
            alert('网络错误，请稍后重试');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="bg-white shadow-md rounded-lg p-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">支付页面</h1>
            </header>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <p>盲盒 ID: {blindBoxId}</p>
                <p>价格: {price} 元</p>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={handlePaymentSuccess}
                >
                    确认支付
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;