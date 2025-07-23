import React, { useEffect, useState, useRef } from 'react';

const PlayerShowCreateForm = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [blindBoxes, setBlindBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  // 用户信息
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    // 获取已购盲盒
    if (!user?.id) return;
    fetch(`http://localhost:7001/user-drawn-blind-boxes?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setBlindBoxes(data.drawnBlindBoxes || []);
      });
  }, [user?.id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    // 生成所有图片的本地预览URL
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(urls => setImages(prev => [...prev, ...urls]));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBox) return alert('请选择盲盒');
    if (!content.trim()) return alert('请输入评价内容');
    setLoading(true);
    let uploadedImages = [];
    if (imageFiles.length > 0) {
      const formData = new FormData();
      imageFiles.forEach(file => formData.append('file', file)); // 多文件同名字段
      const res = await fetch('http://localhost:7001/player-show-upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        uploadedImages = data.urls;
      } else {
        alert('图片上传失败');
        setLoading(false);
        return;
      }
    }
    // 创建玩家秀
    const res = await fetch('http://localhost:7001/player-shows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        blind_box_id: selectedBox,
        content,
        images: uploadedImages,
        rating
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      alert('发布成功');
      setContent('');
      setRating(5);
      setImages([]);
      setImageFiles([]);
      setSelectedBox('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess && onSuccess();
    } else {
      alert(data.message || '发布失败');
    }
  };

  return (
    <form className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto mb-8" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-1 font-bold">选择盲盒</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedBox}
          onChange={e => setSelectedBox(e.target.value)}
          required
        >
          <option value="">请选择已购盲盒</option>
          {blindBoxes.map(box => (
            <option key={box.id} value={box.blind_box_id}>
              {box.blind_box_name}（{box.style_name}）
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold">评价内容</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold">上传图片（可多选）</label>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((img, idx) => (
            <img key={idx} src={img} alt="预览" className="w-20 h-20 object-cover rounded border" />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold">打分</label>
        <div className="flex items-center">
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              className={star <= rating ? 'text-yellow-400 text-2xl cursor-pointer' : 'text-gray-300 text-2xl cursor-pointer'}
              onClick={() => setRating(star)}
            >★</span>
          ))}
          <span className="ml-2 text-gray-500">{rating}分</span>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-bold"
        disabled={loading}
      >
        {loading ? '发布中...' : '发布玩家秀'}
      </button>
    </form>
  );
};

export default PlayerShowCreateForm; 