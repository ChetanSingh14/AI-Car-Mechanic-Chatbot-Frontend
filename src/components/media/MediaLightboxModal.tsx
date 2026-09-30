'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { X, Download, Image as ImageIcon, Music, Video, Sparkles } from 'lucide-react';
import { formatFileSize, formatDate } from '../../lib/utils';

export const MediaLightboxModal: React.FC = () => {
  const { activeLightboxMedia, closeLightbox } = useChat();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeLightboxMedia) {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxMedia, closeLightbox]);

  if (!activeLightboxMedia) return null;

  const isImage = activeLightboxMedia.file_type === 'image';
  const isAudio = activeLightboxMedia.file_type === 'audio';
  const isVideo = activeLightboxMedia.file_type === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 dark:bg-slate-950/90 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={closeLightbox}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              {isImage && <ImageIcon className="h-4 w-4" />}
              {isAudio && <Music className="h-4 w-4" />}
              {isVideo && <Video className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-base max-w-md truncate">
                {activeLightboxMedia.original_name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-400" suppressHydrationWarning>
                Uploaded {formatDate(activeLightboxMedia.uploaded_at)}{' '}
                {activeLightboxMedia.file_size ? `• ${formatFileSize(activeLightboxMedia.file_size)}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {activeLightboxMedia.file_url && (
              <a
                href={activeLightboxMedia.file_url}
                download={activeLightboxMedia.original_name}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>
            )}

            <button
              onClick={closeLightbox}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Media Viewer Area */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-950/40">
          {isImage && (
            <div className="relative max-h-[60vh] max-w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={activeLightboxMedia.file_url}
                alt={activeLightboxMedia.original_name}
                className="max-h-[60vh] max-w-full object-contain rounded-xl sm:rounded-2xl"
              />
            </div>
          )}

          {isAudio && (
            <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center space-y-3 shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 animate-pulse">
                <Music className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Audio Sample</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Acoustic recording for frequency inspection</p>
              </div>
              <audio
                ref={audioRef}
                controls
                autoPlay
                className="w-full rounded-xl"
                src={activeLightboxMedia.file_url}
              >
                Your browser does not support audio playback.
              </audio>
            </div>
          )}

          {isVideo && (
            <div className="relative max-h-[60vh] max-w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <video
                controls
                autoPlay
                className="max-h-[60vh] max-w-full rounded-xl sm:rounded-2xl"
                src={activeLightboxMedia.file_url}
              >
                Your browser does not support video playback.
              </video>
            </div>
          )}

          {/* AI Analysis Summary if available */}
          {activeLightboxMedia.analysis_summary && (
            <div className="mt-3 w-full max-w-lg rounded-xl sm:rounded-2xl border border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 p-3 text-xs text-purple-800 dark:text-purple-200 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300 mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Multi-Modal Telemetry Extraction</span>
              </div>
              <p className="leading-relaxed">{activeLightboxMedia.analysis_summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
