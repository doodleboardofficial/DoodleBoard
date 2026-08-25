import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Paintbrush, Image as ImageIcon, Sparkles, Undo2, Trash2, Check, Loader2 } from 'lucide-react';
import { Post, User, FilterCategory } from '../types';
import { supabaseDb, getSupabaseConfig } from '../services/supabase';

interface UploadModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CATEGORIES: FilterCategory[] = [
  'Minimalist',
  'Botanical',
  'Characters',
  'Architecture',
  'Animals',
  'Abstract',
  'Daily Life',
];

const BRUSH_COLORS = ['#111111', '#555555', '#E11D48', '#2563EB', '#059669', '#D97706', '#7C3AED'];
const BRUSH_SIZES = [2, 5, 10, 18];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onPostCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Minimalist');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1.2);
  const [mode, setMode] = useState<'upload' | 'draw'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushColor, setBrushColor] = useState('#111111');
  const [brushSize, setBrushSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize canvas when switching to draw mode
  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Save initial blank state
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      }
    }
  }, [mode]);

  if (!isOpen) return null;

  // Compress & convert file to Base64 image
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, SVG)');
      return;
    }
    setErrorMsg('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawBase64 = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Calculate canvas compression to fit in localStorage safely
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setImageSrc(compressed);
          setAspectRatio(height / width);
        }
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Scale coordinate based on canvas internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    isDrawingRef.current = true;
    lastPosRef.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, (isErasing ? brushSize * 2 : brushSize) / 2, 0, Math.PI * 2);
      ctx.fillStyle = isErasing ? '#FFFFFF' : brushColor;
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = (clientX - rect.left) * scaleX;
    const currentY = (clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = isErasing ? '#FFFFFF' : brushColor;
      ctx.lineWidth = isErasing ? brushSize * 3 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    lastPosRef.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;
    
    // Push to undo history
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const snapshot = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHistory((prev) => [...prev.slice(-15), snapshot]);
      }
    }
  };

  const handleUndo = () => {
    if (history.length <= 1 || !canvasRef.current) return;
    const newHistory = [...history];
    newHistory.pop(); // remove current state
    const previousState = newHistory[newHistory.length - 1];
    const ctx = canvasRef.current.getContext('2d');
    if (ctx && previousState) {
      ctx.putImageData(previousState, 0, 0);
      setHistory(newHistory);
    }
  };

  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHistory([ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please give your doodle a title');
      return;
    }

    let finalSrc = imageSrc;

    if (mode === 'draw') {
      if (!canvasRef.current) {
        setErrorMsg('Please draw something on the canvas');
        return;
      }
      finalSrc = canvasRef.current.toDataURL('image/jpeg', 0.85);
    }

    if (!finalSrc) {
      setErrorMsg('Please upload an image or sketch your doodle');
      return;
    }

    setIsSubmitting(true);

    try {
      const { isConfigured } = getSupabaseConfig();
      let publicImageUrl = finalSrc;

      if (isConfigured) {
        // Convert data URL to Blob for storage upload
        let blobToUpload: Blob;
        if (selectedFile) {
          blobToUpload = selectedFile;
        } else {
          const res = await fetch(finalSrc);
          blobToUpload = await res.blob();
        }

        // Upload to drawings bucket in Supabase Storage
        publicImageUrl = await supabaseDb.uploadDrawing(
          blobToUpload,
          selectedFile?.name || 'doodle.jpg',
          currentUser.id
        );

        // Insert into Supabase posts table
        const createdPost = await supabaseDb.createPost({
          userId: currentUser.id,
          title: title.trim(),
          imageUrl: publicImageUrl,
        });

        if (createdPost) {
          createdPost.description = description.trim() || undefined;
          createdPost.tags = [selectedCategory];
          onPostCreated(createdPost);
          setIsSubmitting(false);
          onClose();
          return;
        }
      }

      // Fallback or Local mode
      const newPost: Post = {
        id: 'post_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        title: title.trim(),
        description: description.trim() || undefined,
        src: publicImageUrl,
        aspectRatio: aspectRatio || 1.2,
        tags: [selectedCategory],
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatarBg: currentUser.avatarColor,
        userAvatarLetter: currentUser.avatarLetter,
        likes: 0,
        likedBy: [],
        timestamp: Date.now(),
      };

      onPostCreated(newPost);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error('Post creation error:', err);
      setErrorMsg(err.message || 'Failed to publish post');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="upload-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="upload-modal-content"
        className="relative bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl overflow-y-auto border border-gray-100 p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-upload-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Upload to DoodleBoard
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Share your sketches, line art, or digital drawings with the community
          </p>
        </div>

        {/* Mode Switcher: Upload Image vs Draw Canvas */}
        <div className="flex bg-gray-100 p-1 rounded-full mb-5 w-full max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'draw'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Doodle Pad</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Main Artwork Input Area */}
          {mode === 'upload' ? (
            <div className="space-y-3">
              {imageSrc ? (
                <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 max-h-72 flex items-center justify-center group">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-h-72 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setImageSrc(null)}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-bold rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Replace Image
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50/70 transition-all rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    Click to choose file or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP, or SVG (from camera or photo gallery)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileProcess(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Doodle Canvas Pad */
            <div className="space-y-2">
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-inner bg-white">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={450}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-56 sm:h-64 object-contain bg-white cursor-crosshair touch-none"
                />
              </div>

              {/* Canvas Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                {/* Palette */}
                <div className="flex items-center gap-1.5">
                  {BRUSH_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setBrushColor(c);
                        setIsErasing(false);
                      }}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                        brushColor === c && !isErasing ? 'scale-125 ring-2 ring-black ring-offset-1' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsErasing(!isErasing)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                      isErasing
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Eraser
                  </button>
                </div>

                {/* Brush size */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-gray-500 font-medium">Size:</span>
                  {BRUSH_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setBrushSize(sz)}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold cursor-pointer ${
                        brushSize === sz ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length <= 1}
                    className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-40 cursor-pointer"
                    title="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="p-1 text-gray-600 hover:text-red-600 cursor-pointer"
                    title="Clear Canvas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="upload-title-input"
              type="text"
              required
              placeholder="e.g., Midnight Cityscape or Sleeping Fox..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
            />
          </div>

          {/* Category Pill Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="upload-desc-input"
              rows={2}
              placeholder="Add some notes about your tools, inspiration, or technique..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Error display */}
          {errorMsg && (
            <p className="text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-upload-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-black hover:bg-gray-800 transition-transform active:scale-95 shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Doodle'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
