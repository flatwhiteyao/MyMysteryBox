// doubao/frontend/components/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const location = useLocation();
    let user = location.state?.user;
    if (!user) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            user = JSON.parse(userStr);
        }
    }
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nickname: user?.nickname || '',
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 验证密码一致性
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        try {
            const response = await fetch('http://localhost:7001/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user.id,
                    ...formData
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('个人信息更新成功');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('更新失败，请稍后重试');
        }
    };

    // 模拟查看已购盲盒和物流信息
    const viewPurchasedBlindBoxes = () => {
        navigate('/user-drawn-blind-boxes', { state: { user } });
    };

    const viewShippingInfo = () => {
        alert('查看盲盒物流功能待实现');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">个人主页</h1>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => navigate('/blind-box', { state: { user } })}
                >
                    返回盲盒列表
                </button>
            </header>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">修改个人信息</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-2">
                            昵称
                        </label>
                        <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="请输入昵称"
                            value={formData.nickname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            姓名
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="请输入姓名"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                            手机号
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="请输入手机号"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            邮箱
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="请输入邮箱"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            新密码（不修改留空）
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="请输入新密码"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            确认新密码
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="请再次输入新密码"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            更新信息
                        </button>
                    </div>
                </form>
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">已购盲盒和物流信息</h2>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-4"
                        onClick={viewPurchasedBlindBoxes}
                    >
                        查看已购盲盒
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={viewShippingInfo}
                    >
                        查看盲盒物流
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;