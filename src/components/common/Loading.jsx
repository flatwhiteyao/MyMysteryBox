import React from 'react';
const Loading = ({ text = '加载中...' }) => (
  <div className="flex justify-center items-center py-8 text-gray-500">{text}</div>
);
export default Loading; 