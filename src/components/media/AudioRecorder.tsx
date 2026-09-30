'use client';

import React from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { Mic, Trash2, Send, Loader2, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioRecorded: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded, isUploading }) => {
  const {
    isRecording,
    formattedDuration,
    error,
    waveformData,
    startRecording,
    stopRecording,
    cancelRecording
  } = useAudioRecorder();

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleStopAndSend = async () => {
    setIsProcessing(true);
    const result = await stopRecording();
    if (result && result.file) {
      await onAudioRecorded(result.file);
    }
    setIsProcessing(false);
  };

  if (!isRecording) {
    return (
      <div className="relative inline-block shrink-0">
        <button
          type="button"
          onClick={startRecording}
          disabled={isUploading}
          className="flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 transition-all hover:border-amber-500/60 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 disabled:opacity-40"
          title="Record Engine / Exhaust Sound (Microphone)"
        >
          <Mic className="h-4 w-4" />
        </button>

        {error && (
          <div className="absolute bottom-full left-0 mb-2 w-52 sm:w-60 rounded-xl border border-rose-500/40 bg-white dark:bg-slate-900 p-2 text-[11px] text-rose-600 dark:text-rose-300 shadow-lg z-30 flex items-center gap-1.5 backdrop-blur-md">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-amber-500/40 bg-white dark:bg-slate-900/95 px-2 py-1 sm:px-3 sm:py-1.5 shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 max-w-full">
      {/* Blinking recording indicator */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500" />
        </span>
        <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-900 dark:text-slate-100">{formattedDuration}</span>
      </div>

      {/* Dynamic Waveform Visualizer */}
      <div className="flex items-center gap-0.5 h-4 sm:h-5 px-0.5 overflow-hidden max-w-[45px] sm:max-w-[80px]">
        {waveformData.slice(0, 8).map((height, idx) => (
          <span
            key={idx}
            style={{ height: `${Math.max(20, height)}%` }}
            className="w-0.5 sm:w-1 rounded-full bg-gradient-to-t from-amber-500 to-amber-300 transition-all duration-75"
          />
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={cancelRecording}
          className="rounded-lg p-1 text-slate-400 hover:text-rose-500 transition-colors"
          title="Cancel Audio"
        >
          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>

        <button
          type="button"
          onClick={handleStopAndSend}
          disabled={isProcessing || isUploading}
          className="flex items-center gap-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-slate-950 shadow-xs transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing || isUploading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3 stroke-[2.5]" />
          )}
          <span className="hidden xs:inline">Send</span>
        </button>
      </div>
    </div>
  );
};
