import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerShowCreateForm from './PlayerShowCreateForm';

const PlayerShowCreatePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">发布玩家秀</h1>
      <PlayerShowCreateForm onSuccess={() => navigate('/player-shows')} />
    </div>
  );
};

export default PlayerShowCreatePage; 