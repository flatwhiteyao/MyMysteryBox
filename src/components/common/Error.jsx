import React from 'react';
const Error = ({ message = '出错了' }) => (
  <div className="flex justify-center items-center py-8 text-red-500">{message}</div>
);
export default Error; 