// src_frontend/components/BlindBoxPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BlindBoxPage = () => {
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [isManageMode, setIsManageMode] = useState(false);
    const [selectedBlindBox, setSelectedBlindBox] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', photo: null, styles: [] });
    const [styleFormData, setStyleFormData] = useState({ name: '', photo: null, probability: '' });

    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    // 获取盲盒列表
    useEffect(() => {
        fetchBlindBoxes();
    }, []);

    const fetchBlindBoxes = async () => {
        try {
            const response = await fetch('http://localhost:7001/blind-box');
            const data = await response.json();
            if (data.success) {
                setBlindBoxes(data.blindBoxes);
            } else {
                alert(data.message || '获取盲盒列表失败');
            }
        } catch (error) {
            console.error('获取盲盒列表错误:', error);
            alert('网络错误，请稍后重试');
        }
    };

    // 管理模式切换
    const toggleManageMode = () => {
        setIsManageMode(!isManageMode);
        setShowCreateForm(false);
        setSelectedBlindBox(null);
    };

    // 删除盲盒
    const handleDelete = async (id) => {
        if (window.confirm('确定要删除这个盲盒吗？')) {
            try {
                const response = await fetch(`http://localhost:7001/blind-box?id=${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    alert('删除成功');
                    fetchBlindBoxes();
                } else {
                    alert(data.message || '删除失败');
                }
            } catch (error) {
                console.error('删除盲盒错误:', error);
                alert('网络错误，请稍后重试');
            }
        }
    };

    // 编辑盲盒
    const handleEdit = (blindBox) => {
        setSelectedBlindBox(blindBox);
        setFormData({ ...blindBox });
        setShowCreateForm(false);
    };

    // 更新盲盒
    const handleUpdate = async () => {
        if (!formData.name || !formData.price) {
            return alert('名称和价格不能为空');
        }

        const formDataToSend = new FormData();
        formDataToSend.append('id', selectedBlindBox.id);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        if (formData.photo) {
            formDataToSend.append('photo', formData.photo);
        }

        try {
            const response = await fetch('http://localhost:7001/blind-box', {
                method: 'PUT',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                alert('更新成功');
                fetchBlindBoxes();
                setSelectedBlindBox(null);
            } else {
                alert(data.message || '更新失败');
            }
        } catch (error) {
            console.error('更新盲盒错误:', error);
            alert('网络错误，请稍后重试');
        }
    };

    // 创建盲盒
    const handleCreate = async () => {
        if (!formData.name || !formData.price || !formData.photo || formData.styles.length === 0) {
            return alert('名称、价格、照片和至少一个款式信息不能为空');
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('photo', formData.photo);

        formData.styles.forEach((style, index) => {
            formDataToSend.append(`styleName`, style.name);
            formDataToSend.append(`styleProbability`, style.probability);
            formDataToSend.append(`stylePhoto`, style.photo);
        });

        try {
            const response = await fetch('http://localhost:7001/blind-box', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                alert('创建成功');
                fetchBlindBoxes();
                setShowCreateForm(false);
                setFormData({ name: '', description: '', price: '', photo: null, styles: [] });
            } else {
                alert(data.message || '创建失败');
            }
        } catch (error) {
            console.error('创建盲盒错误:', error);
            alert('网络错误，请稍后重试');
        }
    };

    // 表单输入处理
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'photo') {
            setFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 款式表单输入处理
    const handleStyleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'photo') {
            setStyleFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
        } else {
            setStyleFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 添加款式信息
    const addStyle = () => {
        if (!styleFormData.name || !styleFormData.photo || !styleFormData.probability) {
            return alert('款式名称、照片和抽取概率不能为空');
        }
        setFormData(prev => ({
            ...prev,
            styles: [...prev.styles, styleFormData]
        }));
        setStyleFormData({ name: '', photo: null, probability: '' });
    };

    // 删除款式信息
    const removeStyle = (index) => {
        setFormData(prev => ({
            ...prev,
            styles: prev.styles.filter((_, i) => i !== index)
        }));
    };

    // 返回主视图
    const goBack = () => {
        setIsManageMode(false);
        setShowCreateForm(false);
        setSelectedBlindBox(null);
    };

    // 显示创建表单
    const showCreate = () => {
        setShowCreateForm(true);
        setSelectedBlindBox(null);
        setFormData({ name: '', description: '', price: '', photo: null, styles: [] });
    };

    // 查看盲盒详情，跳转到详情页
    const viewBlindBoxDetails = (id) => {
        navigate(`/blind-box/${id}`);
    };

    // 抽取盲盒
    const drawBlindBox = async (id) => {
        try {
            const response = await fetch(`http://localhost:7001/blind-box/draw?id=${id}`);
            const data = await response.json();
            if (data.success) {
                alert(`恭喜你抽到了：${data.style.name}`);
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
            {/* 顶部导航栏 */}
            <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">盲盒商城</h1>
                <div>
                    {user && (
                        <span className="text-gray-600 mr-4">
                            欢迎，{user.nickname} ({user.role})
                        </span>
                    )}
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={() => navigate('/')}
                    >
                        退出登录
                    </button>
                </div>
            </header>

            {/* 用户视图 - 普通用户 */}
            {!isManageMode && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">盲盒列表</h2>
                        {user?.role === 'admin' && (
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                onClick={toggleManageMode}
                            >
                                管理盲盒
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {blindBoxes.map(box => (
                            <div key={box.id} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow group">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    {box.photo ? (
                                        <img src={`http://localhost:7001/${box.photo}`} alt={box.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400">盲盒图片</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                        {box.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{box.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800">¥{box.price}</span>
                                        <div className="flex space-x-2">
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                onClick={() => viewBlindBoxDetails(box.id)}
                                            >
                                                详情
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 管理员视图 */}
            {isManageMode && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {selectedBlindBox ? '编辑盲盒' : (showCreateForm ? '创建盲盒' : '管理盲盒')}
                        </h2>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                            onClick={goBack}
                        >
                            返回
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto"
                            onClick={showCreate}
                        >
                            <i className="fa fa-plus mr-1"></i> 创建新盲盒
                        </button>
                    </div>

                    {/* 编辑/创建表单 */}
                    {selectedBlindBox || showCreateForm ? (
                        <div className="max-w-md mx-auto">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                                    名称
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                                    描述
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                                    价格
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="number"
                                    step="0.01"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="photo">
                                    照片
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* 款式信息表单 */}
                            <h3 className="text-lg font-bold mb-2">盲盒款式信息</h3>
                            {formData.styles.map((style, index) => (
                                <div key={index} className="mb-4 border p-4 rounded-md">
                                    <p className="font-bold">款式 {index + 1}</p>
                                    <p>名称: {style.name}</p>
                                    <p>抽取概率: {style.probability}</p>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeStyle(index)}
                                    >
                                        删除
                                    </button>
                                </div>
                            ))}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="styleName">
                                    款式名称
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="text"
                                    id="styleName"
                                    name="name"
                                    value={styleFormData.name}
                                    onChange={handleStyleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="styleProbability">
                                    抽取概率
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="number"
                                    step="0.01"
                                    id="styleProbability"
                                    name="probability"
                                    value={styleFormData.probability}
                                    onChange={handleStyleInputChange}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="stylePhoto">
                                    款式照片
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="file"
                                    id="stylePhoto"
                                    name="photo"
                                    onChange={handleStyleInputChange}
                                />
                            </div>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                onClick={addStyle}
                            >
                                添加款式
                            </button>
                            <div className="flex justify-between mt-6">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                    onClick={selectedBlindBox ? handleUpdate : handleCreate}
                                >
                                    {selectedBlindBox ? '更新盲盒' : '创建盲盒'}
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                                    onClick={goBack}
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {blindBoxes.map(box => (
                                <div key={box.id} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow group">
                                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                                        {box.photo ? (
                                            <img src={`http://localhost:7001/${box.photo}`} alt={box.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400">盲盒图片</span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                            {box.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{box.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-800">¥{box.price}</span>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                    onClick={() => handleDelete(box.id)}
                                                >
                                                    删除
                                                </button>
                                                <button
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                    onClick={() => handleEdit(box)}
                                                >
                                                    编辑
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlindBoxPage;