import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from './common/StarRating';
import ImagePreview from './common/ImagePreview';

const PlayerShowDetailPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:7001/player-shows/${id}`)
      .then(async res => {
        const text = await res.text();
        if (!text) {
          setShow(null);
          setLoading(false);
          return;
        }
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setShow(null);
          setLoading(false);
          return;
        }
        let show = data.detail || data.playerShow || data.data || data;
        if (show && typeof show.images === 'string') {
          try {
            show.images = JSON.parse(show.images);
          } catch {
            show.images = [];
          }
        }
        if (!show || Object.keys(show).length === 0) {
          setShow(null);
        } else {
          setShow(show);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8">加载中...</div>;
  if (!show) return <div className="p-8 text-gray-500">未找到该玩家秀</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">玩家秀详情</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => navigate(-1)}
        >
          返回
        </button>
      </header>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        {/* <pre className="bg-gray-100 text-xs p-2 mb-4 text-left">{JSON.stringify(show, null, 2)}</pre> */}
        <div className="font-bold text-lg mb-2">{show.user_nickname || '-'} 的玩家秀</div>
        <div className="text-gray-600 text-sm mb-1">盲盒：{show.blind_box_name || '-'}</div>
        <div className="mb-2">{show.content || '-'}</div>
        <div className="flex items-center mb-2">
          <StarRating rating={show.rating || 0} />
          <span className="text-gray-400 text-xs">{show.rating ? show.rating + '分' : '-'}</span>
        </div>
        {Array.isArray(show.images) && show.images.length > 0 && (
          <ImagePreview images={show.images} baseUrl="http://localhost:7001/" />
        )}
        <div className="text-gray-400 text-xs mt-4">创建时间：{show.created_at || '-'}</div>
      </div>
    </div>
  );
};

export default PlayerShowDetailPage; 