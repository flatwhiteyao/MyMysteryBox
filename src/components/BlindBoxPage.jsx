import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BlindBoxPage = () => {
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [isManageMode, setIsManageMode] = useState(false);
    const [selectedBlindBox, setSelectedBlindBox] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });
    
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

        try {
            const response = await fetch('http://localhost:7001/blind-box', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedBlindBox.id,
                    ...formData
                })
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
        if (!formData.name || !formData.price) {
            return alert('名称和价格不能为空');
        }

        try {
            const response = await fetch('http://localhost:7001/blind-box', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('创建成功');
                fetchBlindBoxes();
                setShowCreateForm(false);
                setFormData({ name: '', description: '', price: '' });
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
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setFormData({ name: '', description: '', price: '' });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            {/* 顶部导航栏 */}
            <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">盲盒商城</h1>
                <div>
                    {user && (
                        <span className="text-gray-600 mr-4">
                            欢迎，{user.username} ({user.role})
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
                                    <span className="text-gray-400">盲盒图片</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                        {box.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{box.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800">¥{box.price}</span>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                            购买
                                        </button>
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
                            <div className="mb-6">
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
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setSelectedBlindBox(null);
                                        setShowCreateForm(false);
                                    }}
                                >
                                    取消
                                </button>
                                {selectedBlindBox ? (
                                    <button
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                        onClick={handleUpdate}
                                    >
                                        更新盲盒
                                    </button>
                                ) : (
                                    <button
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                                        onClick={handleCreate}
                                    >
                                        创建盲盒
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-end mb-4">
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                    onClick={showCreate}
                                >
                                    创建盲盒
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">ID</th>
                                            <th className="py-3 px-6 text-left">名称</th>
                                            <th className="py-3 px-6 text-left">描述</th>
                                            <th className="py-3 px-6 text-left">价格</th>
                                            <th className="py-3 px-6 text-center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm">
                                        {blindBoxes.map(box => (
                                            <tr key={box.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-6">{box.id}</td>
                                                <td className="py-3 px-6 font-medium">{box.name}</td>
                                                <td className="py-3 px-6 line-clamp-1">{box.description}</td>
                                                <td className="py-3 px-6">¥{box.price}</td>
                                                <td className="py-3 px-6 text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs transition-colors"
                                                            onClick={() => handleEdit(box)}
                                                        >
                                                            编辑
                                                        </button>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                                                            onClick={() => handleDelete(box.id)}
                                                        >
                                                            删除
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlindBoxPage;    