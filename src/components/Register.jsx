import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 验证必填字段
        if (!formData.nickname || !formData.name || !formData.phone || !formData.password) {
            alert('请填写所有必填字段（昵称、姓名、手机号、密码）');
            return;
        }

        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert('请输入有效的手机号');
            return;
        }

        // 密码强度校验
        const password = formData.password;
        const strengthChecks = [
            /[A-Z]/.test(password), // 大写字母
            /[a-z]/.test(password), // 小写字母
            /[0-9]/.test(password), // 数字
            /[^A-Za-z0-9]/.test(password) // 特殊字符
        ];
        const passedChecks = strengthChecks.filter(Boolean).length;
        if (password.length < 8 || passedChecks < 3) {
            alert('密码强度不足，需至少8位且包含大写字母、小写字母、数字、特殊字符中的三种');
            return;
        }

        // 验证密码一致性
        if (formData.password !== formData.confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        try {
            const response = await fetch('http://localhost:7001/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('注册成功');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('注册失败，请稍后重试');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">注册</h2>

                <div className="mb-4">
                    <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-2">
                        昵称 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="请输入昵称"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="请输入姓名"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                        手机号 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="请输入手机号"
                        value={formData.phone}
                        onChange={handleChange}
                        required
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
                        placeholder="请输入邮箱（选填）"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        密码 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="请输入密码"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                        确认密码 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="请再次输入密码"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                        身份
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="user">普通用户</option>
                        <option value="admin">管理员</option>
                    </select>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        注册
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-gray-600">已有账号？</span>
                    <Link to="/login" className="text-blue-500 hover:text-blue-700 ml-1">
                        去登录
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;