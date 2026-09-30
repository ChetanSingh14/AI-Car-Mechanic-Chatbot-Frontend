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
      <div className="relative inline-block">
        <button
          type="button"
          onClick={startRecording}
          disabled={isUploading}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all hover:border-amber-500/60 hover:bg-slate-800 hover:text-amber-400 hover:scale-105 active:scale-95 disabled:opacity-40"
          title="Record Engine / Exhaust Noise (Microphone)"
        >
          <Mic className="h-4 w-4" />
        </button>

        {error && (
          <div className="absolute bottom-full left-0 mb-2 w-60 rounded-xl border border-rose-500/40 bg-slate-900 p-2 text-[11px] text-rose-300 shadow-xl z-30 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-slate-900/95 px-3 py-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
      {/* Blinking recording indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
        </span>
        <span className="font-mono text-xs font-bold text-slate-100">{formattedDuration}</span>
      </div>

      {/* Dynamic Waveform Visualizer */}
      <div className="flex items-center gap-0.5 h-6 px-1">
        {waveformData.map((height, idx) => (
          <span
            key={idx}
            style={{ height: `${height}%` }}
            className="w-1 rounded-full bg-gradient-to-t from-amber-500 to-amber-300 transition-all duration-75"
          />
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={cancelRecording}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
          title="Cancel Audio Recording"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={handleStopAndSend}
          disabled={isProcessing || isUploading}
          className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isProcessing || isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5 stroke-[2.5]" />
          )}
          <span>Send Clip</span>
        </button>
      </div>
    </div>
  );
};
