import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  Video,
  Play,
  Pause,
  Sparkles,
  Check,
  Clock,
  Film,
  Camera,
} from "lucide-react";
import { SalesContentPack } from "../types";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: SalesContentPack;
  onUpdateVideo: (videoFile: {
    fileName: string;
    previewUrl: string;
    duration: number;
    startSeconds: number;
    endSeconds: number;
  }) => void;
}

export default function VideoUploadModal({
  isOpen,
  onClose,
  pack,
  onUpdateVideo,
}: VideoUploadModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    pack.brief.videoPreview || null
  );
  const [videoDuration, setVideoDuration] = useState<number>(
    pack.brief.videoDuration || 45
  );
  const [startTime, setStartTime] = useState<number>(10);
  const [endTime, setEndTime] = useState<number>(38);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoPlayerRef.current) {
      const dur = Math.round(videoPlayerRef.current.duration);
      setVideoDuration(dur);
      setStartTime(Math.min(5, dur));
      setEndTime(Math.min(dur, Math.max(15, Math.round(dur * 0.7))));
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSaveVideo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpdateVideo({
        fileName: videoFile ? videoFile.name : pack.brief.videoFileName || "product-clip.mp4",
        previewUrl: previewUrl || "",
        duration: videoDuration,
        startSeconds: startTime,
        endSeconds: endTime,
      });
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#FFFBF7] rounded-3xl border-2 border-[#1A1A1A] max-w-2xl w-full p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1A1A1A] relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white hover:bg-[#FFD8C2] border-2 border-[#1A1A1A] text-[#1A1A1A] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black uppercase tracking-wider bg-[#FDF2EB] text-[#FF6B00] border border-[#FFD8C2] px-3 py-1 rounded-full">
            Video Input for {pack.brief.productTitle}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mb-2">
          Upload or Replace Video
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-6">
          Provide your phone-recorded video clip (cake decoration, fashion fit, skincare, unboxing) to preview it live in AfriCut Sell and lock your best selling moment.
        </p>

        {/* Upload Dropzone or Video Preview */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#1A1A1A] hover:border-[#FF6B00] bg-white hover:bg-[#FFF3E8] rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-14 h-14 rounded-2xl bg-[#FDF2EB] text-[#FF6B00] border-2 border-[#1A1A1A] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-[3px_3px_0px_0px_#1A1A1A]">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#1A1A1A] mb-1">
              Select Video from Phone or Drag & Drop
            </h3>
            <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto mb-3">
              Supports MP4, MOV, WebM clips (up to 150MB). Perfect for 30s to 3-minute raw footage.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-xs font-bold px-4 py-2 rounded-xl border border-[#1A1A1A]">
              <Camera className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Browse Camera Roll</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {/* Real Video Player */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#1A1A1A] bg-black shadow-[4px_4px_0px_0px_#1A1A1A]">
              <video
                ref={videoPlayerRef}
                src={previewUrl}
                controls
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full max-h-72 object-contain mx-auto"
              />
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setVideoFile(null);
                }}
                className="absolute top-3 right-3 text-xs bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded-xl border border-white/30 font-bold backdrop-blur-sm cursor-pointer"
              >
                Change Video
              </button>
            </div>

            {/* Visual Highlight Trimmer */}
            <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <div className="flex items-center justify-between text-xs font-black text-[#1A1A1A] mb-2">
                <span className="flex items-center gap-1.5 text-[#FF6B00]">
                  <Film className="w-4 h-4" />
                  <span>Highlight Window: {formatSeconds(startTime)} – {formatSeconds(endTime)}</span>
                </span>
                <span className="bg-[#F8F7F2] border border-[#1A1A1A] px-2 py-0.5 rounded-md font-mono">
                  {Math.max(1, endTime - startTime)}s Duration
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">
                    Start Time (seconds): {startTime}s
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(1, endTime - 5)}
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="w-full accent-[#FF6B00] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">
                    End Time (seconds): {endTime}s
                  </label>
                  <input
                    type="range"
                    min={startTime + 5}
                    max={videoDuration}
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="w-full accent-[#FF6B00] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EBE5]">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border-2 border-[#1A1A1A] bg-white hover:bg-gray-100 text-xs sm:text-sm font-bold text-[#1A1A1A] cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!previewUrl || isProcessing}
            onClick={handleSaveVideo}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1A1A1A] text-xs sm:text-sm font-black transition-all cursor-pointer shadow-[3px_3px_0px_0px_#1A1A1A] ${
              previewUrl && !isProcessing
                ? "bg-[#FF6B00] hover:bg-[#e05e00] text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? "Analyzing Video..." : "Attach Video & Update Kit"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
