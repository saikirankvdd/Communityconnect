import React, { useState, useRef } from 'react';
import { serviceApi } from '../../api/serviceApi';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [category, setCategory] = useState('discussion'); // 'discussion', 'classifieds', 'notice', 'carpool'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [itemLocation, setItemLocation] = useState('Flat A-1204');
  const [selectedPresetImage, setSelectedPresetImage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const PRESET_IMAGES = [
    { label: 'Kids Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Bookshelf / Furniture', url: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=600&q=80' },
    { label: 'Home Plants / Garden', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80' },
    { label: 'Badminton / Sports', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFiles(prev => [
          ...prev,
          {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            isImage: file.type.startsWith('image/'),
            dataUrl: event.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (e.target) e.target.value = '';
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let fullContent = content;
    if (category === 'classifieds' && price) {
      fullContent = `${content}\n\n🏷️ Price: ₹${price} • Pickup Location: ${itemLocation}`;
    }

    const firstImageFile = uploadedFiles.find(f => f.isImage);
    const finalImageUrl = selectedPresetImage || (firstImageFile ? firstImageFile.dataUrl : null);

    const newPost = serviceApi.createPost({
      communityId: 'comm-bhooja',
      author: 'Arjun Kumar',
      authorRole: 'RESIDENT',
      unit: 'Flat A-1204',
      title: title.trim(),
      content: fullContent,
      type: category === 'classifieds' ? 'CLASSIFIED' : category === 'notice' ? 'ANNOUNCEMENT' : 'DISCUSSION',
      category: category,
      price: price ? `₹${price}` : null,
      imageUrl: finalImageUrl,
      attachments: uploadedFiles,
      comments: []
    });

    if (onPostCreated) onPostCreated(newPost);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#283044]/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#eaedff] flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaedff] bg-gradient-to-r from-emerald-50/60 to-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006b2c] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-lg">edit_square</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">Create Community Post</h2>
              <span className="text-xs text-gray-500">Posting as Arjun Kumar (Flat A-1204)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Category Chips */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Select Post Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'discussion', label: 'Discussion', icon: 'forum' },
                { id: 'classifieds', label: 'Classifieds / Sell', icon: 'storefront' },
                { id: 'notice', label: 'Notice / Alert', icon: 'campaign' },
                { id: 'carpool', label: 'Carpool / Ride', icon: 'directions_car' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    category === cat.id
                      ? 'border-[#006b2c] bg-emerald-50 text-[#006b2c] font-bold shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  <span className="text-[11px]">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">
              Post Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'classifieds'
                  ? 'e.g. Wooden Dining Table (6-seater) with Cushions'
                  : category === 'carpool'
                  ? 'e.g. Daily Carpool to Hitec City / Knowledge City (09:00 AM)'
                  : 'e.g. Weekend Gardening Drive at Tower A Courtyard'
              }
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none"
            />
          </div>

          {/* Specific Classifieds Price & Location */}
          {category === 'classifieds' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <div>
                <label className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                  Expected Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 3500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={itemLocation}
                  onChange={(e) => setItemLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">
              Description &amp; Details *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share details with fellow residents of Aparna Bhooja..."
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#006b2c] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Dedicated File Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#006b2c]">attach_file</span>
                <span>Upload Files &amp; Attachments <span className="text-gray-400 font-normal">(Images, PDFs, Documents)</span></span>
              </label>
              {uploadedFiles.length > 0 && (
                <span className="text-[10px] text-[#006b2c] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} attached
                </span>
              )}
            </div>

            {/* Hidden Input & Trigger Box */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-[#006b2c] bg-emerald-50/30 hover:bg-emerald-50/70 rounded-2xl p-4 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#006b2c] group-hover:bg-[#006b2c] group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#006b2c]">
                  Click to Upload Any File
                </span>
                <span className="text-xs text-gray-500 font-medium">or drag and drop</span>
              </div>
              <span className="text-[10px] text-gray-500">
                Supports PNG, JPG, PDF, DOCX, XLSX, ZIP (Max 25MB each)
              </span>
            </div>

            {/* List of Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {uploadedFiles.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {file.isImage ? (
                        <img src={file.dataUrl} alt={file.name} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006b2c] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-base">
                            {file.name.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-gray-800 truncate text-xs">{file.name}</span>
                        <span className="text-[10px] text-gray-400">{file.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optional Preset Image Selector */}
          <div>
            <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1.5">
              Or Choose Quick Stock Photo <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPresetImage(selectedPresetImage === img.url ? '' : img.url)}
                  className={`cursor-pointer rounded-xl border overflow-hidden transition relative ${
                    selectedPresetImage === img.url
                      ? 'border-[#006b2c] ring-2 ring-[#006b2c]/30'
                      : 'border-gray-200 hover:opacity-90'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-14 object-cover" />
                  <span className="text-[10px] font-medium text-gray-700 block p-1 text-center truncate bg-white">
                    {img.label}
                  </span>
                  {selectedPresetImage === img.url && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#006b2c] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
