import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Paintbrush, Image as ImageIcon, Sparkles, Undo2, Trash2, Check, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Post, User, FilterCategory } from '../types';

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

const BRUSH_COLORS = ['#FFFFFF', '#111111', '#E11D48', '#2563EB', '#059669', '#D97706', '#7C3AED'];
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
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [mode, setMode] = useState<'upload' | 'draw'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setImageSrc(null);
      setSelectedFile(null);
      setErrorMsg('');
      setHistory([]);
      setMode('upload');
    }
  }, [isOpen]);

  // Init canvas with dark background
  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && history.length === 0) {
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      }
    }
  }, [mode, history.length]);

  if (!isOpen) return null;

  // Drawing Handlers
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current || !lastPosRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPos = getCanvasPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isErasing) {
      ctx.strokeStyle = '#121212';
      ctx.lineWidth = brushSize * 2.5;
    } else {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    }

    ctx.stroke();
    lastPosRef.current = currentPos;
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const snap = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHistory((prev) => [...prev.slice(-20), snap]);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const newHistory = history.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const snap = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory([snap]);
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    setErrorMsg('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageSrc(result);
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give your doodle a title.');
      return;
    }

    let finalSrc = imageSrc;
    if (mode === 'draw' && canvasRef.current) {
      finalSrc = canvasRef.current.toDataURL('image/png');
    }

    if (!finalSrc) {
      setErrorMsg('Please upload an image or draw something on the canvas.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const newPostId = 'post_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const postPayload: Post = {
        id: newPostId,
        title: title.trim(),
        description: description.trim() || '',
        imageUrl: finalSrc,
        src: finalSrc,
        aspectRatio: 1,
        tags: [selectedCategory],
        userId: currentUser.id,
        userName: currentUser.name,
        userUsername: currentUser.username || currentUser.name.toLowerCase().replace(/\s+/g, '_'),
        userAvatarBg: currentUser.avatarColor || '#18181b',
        userAvatarLetter: currentUser.avatarLetter || currentUser.name.charAt(0).toUpperCase(),
        userAvatarImage: currentUser.avatarImage || undefined,
        isVerified: Boolean(currentUser.isVerified),
        isOwner: Boolean(currentUser.isOwner),
        is_verified: Boolean(currentUser.isVerified),
        is_owner: Boolean(currentUser.isOwner),
        likes: 0,
        likedBy: [],
        timestamp: Date.now(),
      };

      // Save to Firebase Firestore collection 'posts'
      if (db) {
        try {
          const postsCol = collection(db, 'posts');
          await addDoc(postsCol, {
            title: postPayload.title,
            description: postPayload.description,
            imageUrl: postPayload.imageUrl,
            src: postPayload.src,
            aspectRatio: 1,
            category: selectedCategory,
            tags: [selectedCategory],
            userId: currentUser.id,
            userName: currentUser.name,
            userUsername: postPayload.userUsername,
            userAvatarBg: postPayload.userAvatarBg,
            userAvatarLetter: postPayload.userAvatarLetter,
            userAvatarImage: postPayload.userAvatarImage || null,
            isVerified: Boolean(currentUser.isVerified),
            isOwner: Boolean(currentUser.isOwner),
            is_verified: Boolean(currentUser.isVerified),
            is_owner: Boolean(currentUser.isOwner),
            likes: 0,
            likedBy: [],
            timestamp: Date.now(),
            createdAt: Date.now(),
          });
        } catch (firebaseErr) {
          console.warn('Firestore addDoc error (falling back to local):', firebaseErr);
        }
      }

      onPostCreated(postPayload);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="upload-modal-content"
        className="relative bg-black text-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl overflow-y-auto border border-neutral-900 p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-upload-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-zinc-300 flex items-center justify-center border border-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Create New Doodle Post
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Share your drawings and creative line art with the community
          </p>
        </div>

        {/* Mode Switcher: Upload Image vs Draw Canvas */}
        <div className="flex bg-neutral-900 p-1 rounded-xl mb-5 w-full max-w-xs mx-auto border border-neutral-800">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'draw'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
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
                <div className="relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 max-h-72 flex items-center justify-center group">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-h-72 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setImageSrc(null)}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-bold rounded-lg border border-neutral-800 backdrop-blur-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
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
                  className="border-2 border-dashed border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950 transition-all rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-zinc-400 mb-3 border border-neutral-800">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-zinc-200">
                    Click to choose image or drag and drop
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    PNG, JPG, WEBP, or SVG
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
              <div className="border border-neutral-800 rounded-xl overflow-hidden shadow-inner bg-neutral-950">
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
                  className="w-full h-56 sm:h-64 object-contain bg-[#121212] cursor-crosshair touch-none"
                />
              </div>

              {/* Canvas Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
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
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer border border-neutral-700 ${
                        brushColor === c && !isErasing ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsErasing(!isErasing)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      isErasing
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-zinc-300 hover:bg-neutral-700'
                    }`}
                  >
                    Eraser
                  </button>
                </div>

                {/* Brush size */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-zinc-400 font-medium">Size:</span>
                  {BRUSH_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setBrushSize(sz)}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold cursor-pointer ${
                        brushSize === sz ? 'bg-white text-black' : 'bg-neutral-800 text-zinc-300'
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
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-40 cursor-pointer"
                    title="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="p-1 text-zinc-400 hover:text-red-400 cursor-pointer"
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
            <label className="block text-xs font-semibold text-zinc-300">
              Title <span className="text-[#ff3040]">*</span>
            </label>
            <input
              id="upload-title-input"
              type="text"
              required
              placeholder="e.g., Midnight Botanical Lines..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-900 rounded-xl border border-neutral-800 text-xs text-white placeholder-zinc-500 focus:border-neutral-700 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Pill Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-black font-bold shadow-xs'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-zinc-300 border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Caption / Description <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="upload-desc-input"
              rows={2}
              placeholder="Add caption, tags, or tools used..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-900 rounded-xl border border-neutral-800 text-xs text-white placeholder-zinc-500 focus:border-neutral-700 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Error display */}
          {errorMsg && (
            <p className="text-xs font-medium text-red-400 bg-red-950/40 border border-red-900/50 px-3 py-2 rounded-lg">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-upload-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0095f6] hover:bg-[#1877f2] transition-transform active:scale-95 shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Share Doodle</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
