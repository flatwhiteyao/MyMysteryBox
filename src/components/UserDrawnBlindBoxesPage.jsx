import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserDrawnBlindBoxesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 用户信息从location.state或localStorage获取
  let user = location.state?.user;
  if (!user) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  }
  const [drawnBlindBoxes, setDrawnBlindBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取已抽取盲盒列表
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`http://localhost:7001/user-drawn-blind-boxes?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDrawnBlindBoxes(data.drawnBlindBoxes || []);
        } else {
          alert(data.message || '获取盲盒记录失败');
        }
        setLoading(false);
      })
      .catch(() => {
        alert('获取盲盒记录失败');
        setLoading(false);
      });
  }, [user?.id]);

  // 删除订单
  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除该订单吗？')) return;
    try {
      const res = await fetch(`http://localhost:7001/user-drawn-blind-boxes/user-delete-drawn-blind-box`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setDrawnBlindBoxes(prev => prev.filter(item => item.id !== id));
      } else {
        alert(data.message || '删除失败');
      }
    } catch {
      alert('删除失败');
    }
  };

  // 跳转到款式详情页
  const handleDetail = (box) => {
    navigate('/drawn-style-detail', { state: { styleId: box.style_id, styleName: box.style_name, stylePhoto: box.style_photo, blindBoxName: box.blind_box_name } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">已购盲盒</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => navigate(-1)}
        >
          返回
        </button>
      </header>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div>加载中...</div>
        ) : drawnBlindBoxes.length === 0 ? (
          <div className="text-gray-500">暂无已购盲盒</div>
        ) : (
          <div className="space-y-4">
            {drawnBlindBoxes.map(box => (
              <div key={box.id} className="flex items-center border-b pb-4 mb-4">
                <img
                  src={`http://localhost:7001/${box.style_photo}`}
                  alt={box.style_name}
                  className="w-24 h-24 object-cover rounded mr-4 border"
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">盲盒：{box.blind_box_name}</div>
                  <div>款式：{box.style_name}</div>
                  <div className="text-gray-500 text-sm">抽取时间：{box.drawn_at}</div>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                  onClick={() => handleDetail(box)}
                >
                  详情
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(box.id)}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDrawnBlindBoxesPage;
