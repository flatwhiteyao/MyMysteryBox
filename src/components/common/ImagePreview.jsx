import React from 'react';
const ImagePreview = ({ images = [], baseUrl = 'http://localhost:7001/' }) => (
  <div className="flex flex-wrap gap-2 mb-2">
    {images.map((img, idx) => (
      <img key={idx} src={img.startsWith('http') ? img : baseUrl + img} alt="预览" className="w-20 h-20 object-cover rounded border" />
    ))}
  </div>
);
export default ImagePreview; 