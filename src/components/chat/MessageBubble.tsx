'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, memo } from 'react';
import { Message, MediaAttachment } from '../../types';
import { Wrench, User, Cpu, Copy, Check, Paperclip, Music, Video, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { formatDate, normalizeMediaUrl } from '../../lib/utils';
import { useChat } from '../../hooks/useChat';

interface MessageBubbleProps {
  message: Message;
  mediaAttachments?: MediaAttachment[];
}

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, mediaAttachments = [] }) => {
  const { openLightbox } = useChat();
  const [copied, setCopied] = useState(false);

  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // System message style
  if (isSystem) {
    return (
      <div className="my-2 flex justify-center animate-in fade-in">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 px-3 py-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 shadow-xs backdrop-blur-sm max-w-full truncate">
          <Paperclip className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="truncate">{message.content}</span>
        </div>
      </div>
    );
  }

  // Combine message specific media attachments or overall media
  const attachedMedia = message.media_attachments && message.media_attachments.length > 0
    ? message.media_attachments
    : isUser
    ? mediaAttachments
    : [];

  return (
    <div className={`flex gap-2 sm:gap-2.5 my-2 sm:my-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-1`}>
      {/* Avatar Icon */}
      <div
        className={`flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl text-xs font-semibold shadow-xs ${
          isUser
            ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 text-slate-950'
            : 'bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 text-amber-600 dark:text-amber-400'
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" /> : <Wrench className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />}
      </div>

      {/* Message Body & Metadata */}
      <div className={`flex max-w-[92%] sm:max-w-[82%] md:max-w-[78%] flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
        {/* Meta Bar */}
        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] sm:text-[11px] flex-wrap">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {isUser ? 'You' : 'Master Technician'}
          </span>

          {!isUser && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold ${
                message.is_ai_generated
                  ? 'bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
              }`}
            >
              <Cpu className="h-2.5 w-2.5" />
              {message.is_ai_generated ? 'Gemini AI' : 'Rules'}
            </span>
          )}

          <span className="text-[10px] text-slate-400 dark:text-slate-500" suppressHydrationWarning>
            {formatDate(message.created_at)}
          </span>
        </div>

        {/* Message Bubble Card */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
            isUser
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-medium rounded-tr-xs shadow-amber-500/10'
              : 'bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-xs backdrop-blur-md'
          }`}
        >
          {/* Content */}
          <div className="whitespace-pre-wrap space-y-1 font-normal select-text break-words">
            {message.content}
          </div>

          {/* Attached Media Cards if applicable */}
          {attachedMedia && attachedMedia.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2 border-t border-slate-200/80 dark:border-slate-800/60 pt-2">
              {attachedMedia.map((media) => (
                <div
                  key={media.id}
                  onClick={() => openLightbox(media)}
                  className="group/media relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-950/80 p-1.5 text-xs transition-all hover:border-amber-500/60 hover:scale-[1.02] max-w-full"
                >
                  {media.file_type === 'image' && (
                    <div className="space-y-1">
                      <div className="relative h-24 w-36 sm:h-32 sm:w-44 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                        <img
                          src={normalizeMediaUrl(media.file_url)}
                          alt={media.original_name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity">
                          <Maximize2 className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 px-0.5 truncate max-w-[140px]">
                        <ImageIcon className="h-3 w-3 text-amber-500 dark:text-amber-400 shrink-0" />
                        <span className="truncate">{media.original_name}</span>
                      </div>
                    </div>
                  )}

                  {media.file_type === 'audio' && (
                    <div className="space-y-1.5 p-1 min-w-[160px] sm:min-w-[200px]">
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-1.5 font-semibold text-xs truncate">
                          <Music className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{media.original_name}</span>
                        </div>
                      </div>
                      {media.file_url && (
                        <audio
                          controls
                          className="h-7 w-full rounded-md"
                          src={normalizeMediaUrl(media.file_url)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Audio not supported.
                        </audio>
                      )}
                    </div>
                  )}

                  {media.file_type === 'video' && (
                    <div className="space-y-1">
                      <div className="relative h-24 w-36 sm:h-32 sm:w-44 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                        <video
                          src={normalizeMediaUrl(media.file_url)}
                          className="h-full w-full object-cover rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(media);
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Video className="h-5 w-5 text-white/80" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 px-0.5 truncate max-w-[140px]">
                        <Video className="h-3 w-3 text-amber-500 dark:text-amber-400 shrink-0" />
                        <span className="truncate">{media.original_name}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Copy Button */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute bottom-1.5 right-1.5 rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all active:scale-95"
              title="Copy message"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

