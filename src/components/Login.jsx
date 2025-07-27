import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert('请输入有效的手机号');
            return;
        }

        try {
            const response = await fetch('http://localhost:7001/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone,
                    password
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('登录成功');
                // 存储用户ID到localStorage
                localStorage.setItem('userId', data.user.id || data.user.userId || data.userId);
                localStorage.setItem('user', JSON.stringify(data.user));
                // 跳转到盲盒商品主页面，并传递完整用户信息
                navigate('/blind-box', { state: { user: data.user } });
            } else {
                alert(data.message);
            }
        } catch {
            alert('登录失败，请稍后重试');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                        手机号
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="请输入手机号"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        密码
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        登录
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-gray-600">还没有账号？</span>
                    <Link to="/register" className="text-blue-500 hover:text-blue-700 ml-1">
                        去注册
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;