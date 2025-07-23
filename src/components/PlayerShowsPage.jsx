import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerShowCreateForm from './PlayerShowCreateForm';

const PlayerShowsPage = () => {
  const [playerShows, setPlayerShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // 假设用户信息从localStorage获取
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.is_admin;

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:7001/player-shows')
      .then(res => res.json())
      .then(data => {
        // 兼容 images 字段为字符串的情况
        const playerShows = (data.playerShows || data.list || []).map(show => ({
          ...show,
          images: typeof show.images === 'string' ? JSON.parse(show.images) : (show.images || [])
        }));
        setPlayerShows(playerShows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchList = () => {
    setLoading(true);
    fetch('http://localhost:7001/player-shows')
      .then(res => res.json())
      .then(data => {
        setPlayerShows(data.playerShows || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除该玩家秀吗？')) return;
    try {
      const res = await fetch(`http://localhost:7001/player-shows/${id}?user_id=${user.id}&is_admin=${isAdmin}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPlayerShows(prev => prev.filter(item => item.id !== id));
      } else {
        alert(data.message || '删除失败');
      }
    } catch {
      alert('删除失败');
    }
  };

  const handleDetail = (id) => {
    navigate(`/player-show-detail/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">玩家秀</h1>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
            onClick={() => navigate('/player-show-create')}
          >
            发布玩家秀
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      </header>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div>加载中...</div>
        ) : playerShows.length === 0 ? (
          <div className="text-gray-500">暂无玩家秀</div>
        ) : (
          <div className="space-y-4">
            {playerShows.map(show => (
              <div key={show.id} className="border-b pb-4 mb-4 cursor-pointer hover:bg-gray-50 rounded flex flex-col md:flex-row md:items-center">
                <div className="flex-1" onClick={() => handleDetail(show.id)}>
                  <div className="font-bold text-lg">{show.user_nickname} 的玩家秀</div>
                  <div className="text-gray-600 text-sm mb-1">盲盒：{show.blind_box_name}</div>
                  <div className="mb-2">{show.content}</div>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400 mr-2">{'★'.repeat(show.rating)}{'☆'.repeat(5 - show.rating)}</span>
                    <span className="text-gray-400 text-xs">{show.rating}分</span>
                  </div>
                  {show.images && show.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {show.images.map((img, idx) => (
                        <img key={idx} src={`http://localhost:7001/${img}`} alt="玩家秀配图" className="w-20 h-20 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                </div>
                {(isAdmin || user?.id === show.user_id) && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded self-start md:self-auto mt-2 md:mt-0 md:ml-4"
                    onClick={e => { e.stopPropagation(); handleDelete(show.id); }}
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerShowsPage; 