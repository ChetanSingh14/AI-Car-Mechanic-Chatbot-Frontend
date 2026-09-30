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
    <div className="flex flex-wrap gap-2 py-2">
      {attachments.map((media) => {
        const isImage = media.file_type === 'image';
        const isAudio = media.file_type === 'audio';
        const isVideo = media.file_type === 'video';

        return (
          <div
            key={media.id}
            className="group relative flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 pr-3 text-xs shadow-md transition-all hover:border-amber-500/50 hover:bg-slate-850"
          >
            {/* Thumbnail or Icon */}
            <div
              onClick={() => onPreview && onPreview(media)}
              className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-950 border border-slate-800 text-amber-400 group-hover:opacity-90"
            >
              {isImage && media.file_url ? (
                <img
                  src={media.file_url}
                  alt={media.original_name}
                  className="h-full w-full object-cover"
                />
              ) : isAudio ? (
                <Music className="h-5 w-5" />
              ) : isVideo ? (
                <Video className="h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}

              {onPreview && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Eye className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Media Metadata */}
            <div
              onClick={() => onPreview && onPreview(media)}
              className="cursor-pointer max-w-[140px] truncate"
            >
              <p className="truncate font-medium text-slate-200">{media.original_name}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="uppercase font-semibold text-amber-400/90">{media.file_type}</span>
                {media.file_size && <span>• {formatFileSize(media.file_size)}</span>}
              </div>
            </div>

            {/* Remove Action */}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(media.id)}
                className="ml-1 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-rose-400"
                title="Remove attachment"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
