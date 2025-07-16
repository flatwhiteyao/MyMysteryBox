import React from 'react';
import { useLocation } from 'react-router-dom';

const DrawnStyleDetailPage = () => {
    const location = useLocation();
    const style = location.state?.style;

    if (!style) {
        return <div className="p-4">没有找到款式信息</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">抽中款式详情</h1>
            </header>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{style.name}</h2>
                <img src={`http://localhost:7001/${style.photo}`} alt={style.name} className="w-full h-full object-cover" style={{ width: '500px', height: '500px' }} />
            </div>
        </div>
    );
};

export default DrawnStyleDetailPage;