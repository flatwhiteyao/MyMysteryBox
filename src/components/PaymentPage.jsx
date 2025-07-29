import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { blindBoxId, price } = location.state;
    const [onlineCount, setOnlineCount] = useState(1); // 默认显示1人
    const [isLoading, setIsLoading] = useState(true);

    // 获取在线人数
    const fetchOnlineCount = async () => {
        try {
            const response = await fetch('http://localhost:7001/online-count');
            const data = await response.json();
            if (data.success) {
                setOnlineCount(data.count || 1);
            } else {
                // 如果接口失败，默认显示1人
                setOnlineCount(1);
            }
        } catch (error) {
            console.error('获取在线人数错误:', error);
            // 网络错误时默认显示1人
            setOnlineCount(1);
        } finally {
            setIsLoading(false);
        }
    };

    // 组件加载时获取在线人数
    useEffect(() => {
        fetchOnlineCount();
        
        // 每30秒更新一次在线人数
        const interval = setInterval(fetchOnlineCount, 30000);
        
        return () => clearInterval(interval);
    }, []);

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
            
            {/* 在线人数显示 */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold text-lg">
                            {isLoading ? '加载中...' : `无需排队，当前仅${onlineCount}人在线抽取盲盒`}
                        </span>
                    </div>
                </div>
            </div>
            
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