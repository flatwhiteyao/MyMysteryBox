import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserDrawnBlindBoxesPage = () => {
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();
    const [drawnBlindBoxes, setDrawnBlindBoxes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            alert('未获取到用户信息，请重新登录');
            navigate('/login');
            return;
        }
        fetch(`http://localhost:7001/user-drawn-blind-boxes?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setDrawnBlindBoxes(data.drawnBlindBoxes);
                } else {
                    alert(data.message || '获取已购盲盒信息失败');
                }
                setLoading(false);
            })
            .catch(() => {
                alert('网络错误，请稍后重试');
                setLoading(false);
            });
    }, [userId, navigate]);

    const handleRowClick = (style) => {
        navigate('/drawn-style-detail', { state: { style } });
    };

    if (loading) return <div className="p-4">加载中...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">已抽中盲盒列表</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    onClick={() => navigate(-1)}
                >
                    返回
                </button>
            </header>
            <div className="bg-white rounded-xl shadow-lg p-6">
                {drawnBlindBoxes.length === 0 ? (
                    <div>您还没有抽中过盲盒</div>
                ) : (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">盲盒名称</th>
                                <th className="px-4 py-2">盲盒图片</th>
                                <th className="px-4 py-2">抽中款式</th>
                                <th className="px-4 py-2">款式图片</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drawnBlindBoxes.map((box, idx) => (
                                <tr
                                    key={idx}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleRowClick({
                                        name: box.style_name,
                                        photo: box.style_photo
                                    })}
                                >
                                    <td className="border px-4 py-2">{box.blind_box_name}</td>
                                    <td className="border px-4 py-2">
                                        <img src={`http://localhost:7001/${box.blind_box_photo}`} alt={box.blind_box_name} className="w-20 h-20 object-cover" />
                                    </td>
                                    <td className="border px-4 py-2">{box.style_name}</td>
                                    <td className="border px-4 py-2">
                                        <img src={`http://localhost:7001/${box.style_photo}`} alt={box.style_name} className="w-20 h-20 object-cover" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserDrawnBlindBoxesPage;
