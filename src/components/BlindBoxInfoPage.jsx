import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlindBoxInfoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blindBox, setBlindBox] = useState(null);
    const [styles, setStyles] = useState([]);

    useEffect(() => {
        const fetchBlindBox = async () => {
            try {
                const response = await fetch(`http://localhost:7001/blind-box?id=${id}`);
                const data = await response.json();
                if (data.success) {
                    setBlindBox(data.blindBoxes[0]);
                } else {
                    alert(data.message || '获取盲盒信息失败');
                }
            } catch (error) {
                console.error('获取盲盒信息错误:', error);
                alert('网络错误，请稍后重试');
            }
        };

        const fetchStyles = async () => {
            try {
                const response = await fetch(`http://localhost:7001/blind-box/styles?id=${id}`);
                const data = await response.json();
                if (data.success) {
                    setStyles(data.styles);
                } else {
                    alert(data.message || '获取盲盒款式信息失败');
                }
            } catch (error) {
                console.error('获取盲盒款式信息错误:', error);
                alert('网络错误，请稍后重试');
            }
        };

        fetchBlindBox();
        fetchStyles();
    }, [id]);

    const handleDraw = () => {
        if (blindBox) {
            navigate('/payment', { state: { blindBoxId: id, price: blindBox.price } });
        }
    };

    if (!blindBox) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">盲盒详情</h1>
            </header>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{blindBox.name}</h2>
                <p className="text-gray-600 mb-4">{blindBox.description}</p>
                <img src={`http://localhost:7001/${blindBox.photo}`} alt={blindBox.name} className="w-full h-full object-cover" style={{ width: '500px', height: '500px' }} />

                <h3 className="text-lg font-bold text-gray-800 mb-2">款式信息</h3>

                <ul>
                    {styles.map(style => (
                        <li key={style.id} className="flex items-center mb-2">
                            <img src={`http://localhost:7001/${style.photo}`} alt={style.name} className="w-16 h-16 mr-2" />
                            <span className="text-gray-600">{style.name} (抽取概率: {style.probability})</span>
                        </li>
                    ))}
                </ul>

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mt-4"
                    onClick={handleDraw}
                >
                    抽取盲盒
                </button>
            </div>
        </div>
    );
};

export default BlindBoxInfoPage;