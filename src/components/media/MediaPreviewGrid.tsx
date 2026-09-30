'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { MediaAttachment } from '../../types';
import { Image as ImageIcon, Music, Video, X, Eye } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';

interface MediaPreviewGridProps {
  attachments: MediaAttachment[];
  onRemove?: (id: string) => void;
  onPreview?: (media: MediaAttachment) => void;
}

export const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = ({
  attachments,
  onRemove,
  onPreview
}) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 py-1">
      {attachments.map((media) => {
        const isImage = media.file_type === 'image';
        const isAudio = media.file_type === 'audio';
        const isVideo = media.file_type === 'video';

        return (
          <div
            key={media.id}
            className="group relative flex items-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-1 pr-2.5 text-xs shadow-xs transition-all hover:border-amber-500/50"
          >
            {/* Thumbnail or Icon */}
            <div
              onClick={() => onPreview && onPreview(media)}
              className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-amber-400 group-hover:opacity-90"
            >
              {isImage && media.file_url ? (
                <img
                  src={media.file_url}
                  alt={media.original_name}
                  className="h-full w-full object-cover"
                />
              ) : isAudio ? (
                <Music className="h-4 w-4" />
              ) : isVideo ? (
                <Video className="h-4 w-4" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}

              {onPreview && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Eye className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Media Metadata */}
            <div
              onClick={() => onPreview && onPreview(media)}
              className="cursor-pointer max-w-[120px] truncate"
            >
              <p className="truncate font-medium text-slate-800 dark:text-slate-200 text-[11px]">{media.original_name}</p>
              <div className="flex items-center gap-1 text-[9px] text-slate-400">
                <span className="uppercase font-semibold text-amber-600 dark:text-amber-400">{media.file_type}</span>
                {media.file_size && <span>• {formatFileSize(media.file_size)}</span>}
              </div>
            </div>

            {/* Remove Action */}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(media.id)}
                className="ml-0.5 rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500"
                title="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
