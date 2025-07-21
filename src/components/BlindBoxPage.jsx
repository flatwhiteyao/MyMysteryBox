// doubao/frontend/components/BlindBoxPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BlindBoxPage = () => {
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [filteredBlindBoxes, setFilteredBlindBoxes] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isManageMode, setIsManageMode] = useState(false);
    const [selectedBlindBox, setSelectedBlindBox] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', photo: null, styles: [] });
    const [styleFormData, setStyleFormData] = useState({ name: '', photo: null, probability: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('edit');
    const [editingStyleIndex, setEditingStyleIndex] = useState(-1); // 正在编辑的款式索引，-1表示未编辑任何款式

    const navigate = useNavigate();
    const location = useLocation();
    let user = location.state?.user;
    if (!user) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            user = JSON.parse(userStr);
        }
    }

    // 获取盲盒列表
    useEffect(() => {
        fetchBlindBoxes();
    }, []);

    // 搜索过滤效果
    useEffect(() => {
        if (searchKeyword.trim() === '') {
            setFilteredBlindBoxes(blindBoxes);
        } else {
            const filtered = blindBoxes.filter(box => 
                box.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                box.description.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            setFilteredBlindBoxes(filtered);
        }
    }, [searchKeyword, blindBoxes]);

    const fetchBlindBoxes = async () => {
        try {
            const response = await fetch('http://localhost:7001/blind-box');
            const data = await response.json();
            if (data.success) {
                setBlindBoxes(data.blindBoxes);
                setFilteredBlindBoxes(data.blindBoxes);
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
        console.log('切换管理模式');
        setIsManageMode(!isManageMode);
        setIsModalOpen(false);
        setSelectedBlindBox(null);
        setErrorMessage('');
        setEditingStyleIndex(-1);
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

    // 打开编辑弹窗
    const openEditModal = (blindBox) => {
        console.log('打开编辑弹窗:', blindBox);
        
        try {
            if (!blindBox) {
                throw new Error('未选择盲盒');
            }
            
            if (!blindBox.id || !blindBox.name || !blindBox.price) {
                throw new Error('盲盒数据不完整');
            }
            
            setSelectedBlindBox(blindBox);
            
            // 确保正确初始化表单数据，包括款式信息
            setFormData({
                id: blindBox.id,
                name: blindBox.name,
                description: blindBox.description,
                price: blindBox.price,
                photo: null, // 保留原照片，除非用户上传新照片
                styles: [...(blindBox.styles || [])] // 复制款式数据
            });
            
            setModalType('edit');
            setIsModalOpen(true);
            setErrorMessage('');
            setEditingStyleIndex(-1); // 重置编辑状态
        } catch (error) {
            console.error('打开编辑弹窗错误:', error);
            setErrorMessage(`打开编辑弹窗错误: ${error.message}`);
        }
    };

    // 打开创建弹窗
    const openCreateModal = () => {
        console.log('打开创建弹窗');
        setSelectedBlindBox(null);
        setFormData({ name: '', description: '', price: '', photo: null, styles: [] });
        setModalType('create');
        setIsModalOpen(true);
        setErrorMessage('');
        setEditingStyleIndex(-1); // 重置编辑状态
    };

    // 关闭弹窗
    const closeModal = () => {
        console.log('关闭弹窗');
        setIsModalOpen(false);
        setErrorMessage('');
        setEditingStyleIndex(-1); // 重置编辑状态
    };

    // 更新盲盒
    const handleUpdate = async () => {
        try {
            if (!formData.name || !formData.price) {
                throw new Error('名称和价格不能为空');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('id', selectedBlindBox.id);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            if (formData.photo) {
                formDataToSend.append('photo', formData.photo);
            }

            formData.styles.forEach((style, index) => {
                formDataToSend.append(`styleName`, style.name);
                formDataToSend.append(`styleProbability`, style.probability);
                if (style.photo) {
                    formDataToSend.append(`stylePhoto`, style.photo);
                }
            });

            const response = await fetch('http://localhost:7001/blind-box', {
                method: 'PUT',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                alert('更新成功');
                fetchBlindBoxes();
                closeModal();
            } else {
                throw new Error(data.message || '更新失败');
            }
        } catch (error) {
            console.error('更新盲盒错误:', error);
            setErrorMessage(`更新错误: ${error.message}`);
        }
    };

    // 创建盲盒
    const handleCreate = async () => {
        try {
            if (!formData.name || !formData.price || !formData.photo || formData.styles.length === 0) {
                throw new Error('名称、价格、照片和至少一个款式信息不能为空');
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

            const response = await fetch('http://localhost:7001/blind-box', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                alert('创建成功');
                fetchBlindBoxes();
                closeModal();
            } else {
                throw new Error(data.message || '创建失败');
            }
        } catch (error) {
            console.error('创建盲盒错误:', error);
            setErrorMessage(`创建错误: ${error.message}`);
        }
    };

    // 表单输入处理
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`输入变化: ${name}=${value}`);
        if (name === 'photo') {
            setFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 款式表单输入处理 - 用于添加新款式
    const handleStyleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`款式输入变化: ${name}=${value}`);
        if (name === 'photo') {
            setStyleFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
        } else {
            setStyleFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 编辑中的款式表单输入处理
    const handleEditingStyleInputChange = (e, index) => {
        const { name, value } = e.target;
        console.log(`编辑款式 ${index} 输入变化: ${name}=${value}`);
        
        setFormData(prev => {
            const newStyles = [...prev.styles];
            if (name === 'photo') {
                newStyles[index] = { ...newStyles[index], [name]: e.target.files[0] };
            } else {
                newStyles[index] = { ...newStyles[index], [name]: value };
            }
            return { ...prev, styles: newStyles };
        });
    };

    // 添加款式信息
    const addStyle = () => {
        try {
            if (!styleFormData.name || !styleFormData.photo || !styleFormData.probability) {
                throw new Error('款式名称、照片和抽取概率不能为空');
            }
            
            setFormData(prev => ({
                ...prev,
                styles: [...prev.styles, { ...styleFormData }]
            }));
            
            setStyleFormData({ name: '', photo: null, probability: '' });
            setErrorMessage('');
        } catch (error) {
            console.error('添加款式错误:', error);
            setErrorMessage(`添加款式错误: ${error.message}`);
        }
    };

    // 删除款式信息
    const removeStyle = (index) => {
        console.log(`删除款式: 索引=${index}`);
        setFormData(prev => ({
            ...prev,
            styles: prev.styles.filter((_, i) => i !== index)
        }));
        // 如果删除的是正在编辑的款式，重置编辑状态
        if (index === editingStyleIndex) {
            setEditingStyleIndex(-1);
        }
    };

    // 开始编辑款式
    const startEditingStyle = (index) => {
        console.log(`开始编辑款式: 索引=${index}`);
        setEditingStyleIndex(index);
    };

    // 取消编辑款式
    const cancelEditingStyle = () => {
        console.log('取消编辑款式');
        setEditingStyleIndex(-1);
    };

    // 保存编辑的款式
    const saveEditingStyle = (index) => {
        try {
            const style = formData.styles[index];
            if (!style.name || !style.probability) {
                throw new Error('款式名称和抽取概率不能为空');
            }
            
            console.log(`保存编辑的款式: 索引=${index}`);
            setEditingStyleIndex(-1);
            setErrorMessage('');
        } catch (error) {
            console.error('保存款式错误:', error);
            setErrorMessage(`保存款式错误: ${error.message}`);
        }
    };

    // 查看盲盒详情，跳转到详情页
    const viewBlindBoxDetails = (id) => {
        console.log(`查看盲盒详情: id=${id}`);
        navigate(`/blind-box/${id}`);
    };

    // 抽取盲盒
    const drawBlindBox = (id, price) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('请先登录');
            navigate('/login');
            return;
        }
        navigate('/payment', { state: { blindBoxId: id, price } });
    };

    // 搜索处理
    const handleSearch = (e) => {
        console.log(`搜索关键词: ${e.target.value}`);
        setSearchKeyword(e.target.value);
    };

    // 清除搜索
    const clearSearch = () => {
        console.log('清除搜索');
        setSearchKeyword('');
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
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-4"
                        onClick={() => navigate('/user-profile', { state: { user } })}
                    >
                        个人主页
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={() => navigate('/')}
                    >
                        退出登录
                    </button>
                </div>
            </header>

            {/* 错误提示 */}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>错误:</strong> {errorMessage}
                </div>
            )}

            {/* 用户视图 - 普通用户 */}
            {!isManageMode && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">盲盒列表</h2>
                        {user?.role === 'admin' && (
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
                                onClick={toggleManageMode}
                            >
                                管理模式
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="搜索盲盒"
                        value={searchKeyword}
                        onChange={handleSearch}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                    />
                    <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors mb-4"
                        onClick={clearSearch}
                    >
                        清除搜索
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBlindBoxes.map(box => (
                            <div key={box.id} className="bg-white shadow-md rounded-lg p-4">
                                <img src={`http://localhost:7001/${box.photo}`} alt={box.name} className="w-full h-full object-cover" style={{ height: '200px' }} />
                                <h3 className="text-lg font-bold text-gray-800 mt-2">{box.name}</h3>
                                <p className="text-gray-600">{box.description}</p>
                                <p className="text-gray-600">价格: {box.price} 元</p>
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                        onClick={() => viewBlindBoxDetails(box.id)}
                                    >
                                        查看详情
                                    </button>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                        onClick={() => drawBlindBox(box.id, box.price)}
                                    >
                                        抽取盲盒
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 管理视图 - 管理员 */}
            {isManageMode && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">盲盒管理</h2>
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
                            onClick={toggleManageMode}
                        >
                            退出管理模式
                        </button>
                    </div>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors mb-4"
                        onClick={openCreateModal}
                    >
                        创建盲盒
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBlindBoxes.map(box => (
                            <div key={box.id} className="bg-white shadow-md rounded-lg p-4">
                                <img src={`http://localhost:7001/${box.photo}`} alt={box.name} className="w-full h-full object-cover" style={{ height: '200px' }} />
                                <h3 className="text-lg font-bold text-gray-800 mt-2">{box.name}</h3>
                                <p className="text-gray-600">{box.description}</p>
                                <p className="text-gray-600">价格: {box.price} 元</p>
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
                                        onClick={() => openEditModal(box)}
                                    >
                                        编辑
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                                        onClick={() => handleDelete(box.id)}
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 弹窗组件 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {modalType === 'edit' ? '编辑盲盒' : '创建盲盒'}
                                </h2>
                                <button
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={closeModal}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            {/* 错误提示 */}
                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    <strong>错误:</strong> {errorMessage}
                                </div>
                            )}
                            
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                        名称
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="请输入名称"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                                        描述
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="请输入描述"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                                        价格
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="请输入价格"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">
                                        照片
                                    </label>
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        onChange={handleInputChange}
                                    />
                                    {selectedBlindBox && selectedBlindBox.photo && (
                                        <div className="mt-2">
                                            <img src={`http://localhost:7001/${selectedBlindBox.photo}`} alt="当前照片" className="w-32 h-32 object-cover" />
                                            <p className="text-sm text-gray-500 mt-1">当前照片</p>
                                        </div>
                                    )}
                                </div>
                                {/* 款式信息 */}
                                <h3 className="text-lg font-bold text-gray-800 mb-2">款式信息</h3>
                                
                                {/* 显示现有款式 */}
                                {formData.styles.map((style, index) => (
                                    <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg">
                                        {/* 编辑状态 */}
                                        {index === editingStyleIndex ? (
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <img 
                                                        src={style.photo ? 
                                                            URL.createObjectURL(style.photo) : 
                                                            (style.photoUrl || `http://localhost:7001/${style.photo}`)} 
                                                        alt={style.name} 
                                                        className="w-16 h-16 mr-2 object-cover" 
                                                    />
                                                    <span className="text-gray-600 font-bold">编辑款式: {style.name}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-1">
                                                        款式名称
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="请输入款式名称"
                                                        value={style.name}
                                                        onChange={(e) => handleEditingStyleInputChange(e, index)}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-1">
                                                        款式照片
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="photo"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        onChange={(e) => handleEditingStyleInputChange(e, index)}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-1">
                                                        抽取概率
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="probability"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="请输入抽取概率"
                                                        value={style.probability}
                                                        onChange={(e) => handleEditingStyleInputChange(e, index)}
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
                                                        onClick={cancelEditingStyle}
                                                    >
                                                        取消
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                                        onClick={() => saveEditingStyle(index)}
                                                    >
                                                        保存
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // 查看状态
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <img 
                                                        src={style.photo ? 
                                                            URL.createObjectURL(style.photo) : 
                                                            (style.photoUrl || `http://localhost:7001/${style.photo}`)} 
                                                        alt={style.name} 
                                                        className="w-16 h-16 mr-2 object-cover" 
                                                    />
                                                    <div>
                                                        <p className="text-gray-800 font-bold">{style.name}</p>
                                                        <p className="text-gray-600">抽取概率: {style.probability}</p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <button
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md mr-2"
                                                        onClick={() => startEditingStyle(index)}
                                                    >
                                                        编辑
                                                    </button>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                                                        onClick={() => removeStyle(index)}
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {/* 添加新款式表单 */}
                                <h4 className="text-base font-bold text-gray-800 mb-2">添加新款式</h4>
                                <div className="mb-4">
                                    <label htmlFor="styleName" className="block text-gray-700 text-sm font-bold mb-2">
                                        款式名称
                                    </label>
                                    <input
                                        type="text"
                                        id="styleName"
                                        name="name"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="请输入款式名称"
                                        value={styleFormData.name}
                                        onChange={handleStyleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="stylePhoto" className="block text-gray-700 text-sm font-bold mb-2">
                                        款式照片
                                    </label>
                                    <input
                                        type="file"
                                        id="stylePhoto"
                                        name="photo"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        onChange={handleStyleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="styleProbability" className="block text-gray-700 text-sm font-bold mb-2">
                                        抽取概率
                                    </label>
                                    <input
                                        type="number"
                                        id="styleProbability"
                                        name="probability"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="请输入抽取概率"
                                        value={styleFormData.probability}
                                        onChange={handleStyleInputChange}
                                    />
                                </div>
                                <button
                                    type="button" // 防止表单提交
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mb-4"
                                    onClick={addStyle}
                                >
                                    添加款式
                                </button>
                                <div className="flex justify-between items-center">
                                    <button
                                        type="button" // 防止表单提交
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                        onClick={modalType === 'edit' ? handleUpdate : handleCreate}
                                    >
                                        {modalType === 'edit' ? '保存修改' : '创建'}
                                    </button>
                                    <button
                                        type="button" // 防止表单提交
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                                        onClick={closeModal}
                                    >
                                        取消
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlindBoxPage;