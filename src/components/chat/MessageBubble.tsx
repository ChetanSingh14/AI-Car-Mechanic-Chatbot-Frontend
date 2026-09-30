'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, memo } from 'react';
import { Message, MediaAttachment } from '../../types';
import { Wrench, User, Cpu, Copy, Check, Paperclip, Music, Video, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
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
      <div className="my-3 flex justify-center animate-in fade-in">
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-400 shadow-sm backdrop-blur-sm">
          <Paperclip className="h-3.5 w-3.5 text-amber-400" />
          <span>{message.content}</span>
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
    <div className={`flex gap-3 my-4 group ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2`}>
      {/* Avatar Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-semibold shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/10'
            : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-amber-400 shadow-black/40'
        }`}
      >
        {isUser ? <User className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
      </div>

      {/* Message Body & Metadata */}
      <div className={`flex max-w-[88%] sm:max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Meta Bar */}
        <div className="flex items-center gap-2 mb-1.5 px-1 text-[11px]">
          <span className="font-bold text-slate-300">
            {isUser ? 'Car Owner' : 'Senior ASE Master Technician'}
          </span>

          {!isUser && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-bold ${
                message.is_ai_generated
                  ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              <Cpu className="h-2.5 w-2.5" />
              {message.is_ai_generated ? 'Gemini Multi-Modal AI' : 'Deterministic Logic'}
            </span>
          )}

          <span className="text-[10px] text-slate-500" suppressHydrationWarning>{formatDate(message.created_at)}</span>
        </div>

        {/* Message Bubble Card */}
        <div
          className={`relative rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-tr-xs shadow-amber-500/10'
              : 'bg-slate-900/90 border border-slate-800/90 text-slate-100 rounded-tl-xs shadow-black/40 backdrop-blur-md'
          }`}
        >
          {/* Content with rich markdown-style rendering */}
          <div className="whitespace-pre-wrap space-y-1.5 font-normal select-text">
            {message.content}
          </div>

          {/* Attached Media Cards if applicable */}
          {attachedMedia && attachedMedia.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-2 border-t border-slate-800/60 pt-3">
              {attachedMedia.map((media) => (
                <div
                  key={media.id}
                  onClick={() => openLightbox(media)}
                  className="group/media relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/80 p-2 text-xs transition-all hover:border-amber-500/60 hover:scale-[1.02]"
                >
                  {media.file_type === 'image' && (
                    <div className="space-y-1.5">
                      <div className="relative h-36 w-48 overflow-hidden rounded-xl bg-slate-900">
                        <img
                          src={media.file_url}
                          alt={media.original_name}
                          className="h-full w-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity">
                          <Maximize2 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-300 px-1 truncate max-w-[190px]">
                        <ImageIcon className="h-3 w-3 text-amber-400 shrink-0" />
                        <span className="truncate">{media.original_name}</span>
                      </div>
                    </div>
                  )}

                  {media.file_type === 'audio' && (
                    <div className="space-y-2 p-1 min-w-[220px]">
                      <div className="flex items-center justify-between text-slate-200">
                        <div className="flex items-center gap-1.5 font-semibold text-xs">
                          <Music className="h-4 w-4 text-amber-400" />
                          <span className="truncate max-w-[150px]">{media.original_name}</span>
                        </div>
                      </div>
                      {media.file_url && (
                        <audio
                          controls
                          className="h-8 w-full rounded-lg"
                          src={media.file_url}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Audio not supported.
                        </audio>
                      )}
                    </div>
                  )}

                  {media.file_type === 'video' && (
                    <div className="space-y-1.5">
                      <div className="relative h-36 w-52 overflow-hidden rounded-xl bg-slate-900">
                        <video
                          src={media.file_url}
                          className="h-full w-full object-cover rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(media);
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Video className="h-6 w-6 text-white/80" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-300 px-1 truncate max-w-[200px]">
                        <Video className="h-3 w-3 text-amber-400 shrink-0" />
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
              className="absolute bottom-2 right-2 rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
              title="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
