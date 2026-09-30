'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useChat } from '../../hooks/useChat';
import { AudioRecorder } from '../media/AudioRecorder';
import { MediaPreviewGrid } from '../media/MediaPreviewGrid';
import { QuickPrompts } from './QuickPrompts';
import { validateMediaFile } from '../../lib/utils';
import {
  Send,
  Paperclip,
  Loader2,
  Sparkles,
  X
} from 'lucide-react';

export const ChatInput: React.FC = () => {
  const {
    sendMessage,
    uploadFile,
    mediaAttachments,
    removeAttachment,
    openLightbox,
    isLoading,
    isUploading,
    addToast
  } = useChat();

  const [text, setText] = useState('');
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle textarea auto-resize
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;

    const msg = text;
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Process File Uploads with validation
  const processFile = useCallback(
    async (file: File) => {
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        addToast({
          type: 'error',
          title: 'Invalid File',
          message: validation.error || 'File validation failed.'
        });
        return;
      }

      await uploadFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [uploadFile, addToast]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setText(prompt);
    setShowQuickPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-t border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/80 p-2 sm:p-3 backdrop-blur-xl transition-all shrink-0 ${
        isDragOver ? 'border-amber-500/80 bg-amber-500/5' : ''
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,audio/*,video/*"
        className="hidden"
      />

      {/* Drag Over Overlay Alert */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 dark:bg-slate-950/90 border-2 border-dashed border-amber-500 rounded-2xl backdrop-blur-sm animate-in fade-in">
          <div className="text-center space-y-1">
            <Sparkles className="h-6 w-6 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">Drop Media to Upload</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Photos, Audio clips, or Diagnostic Videos</p>
          </div>
        </div>
      )}

      {/* Quick Prompts Bar if toggled */}
      {showQuickPrompts && (
        <div className="mb-2 animate-in fade-in slide-in-from-bottom-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Quick Symptoms</span>
            <button
              onClick={() => setShowQuickPrompts(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <QuickPrompts onSelectPrompt={handleSelectPrompt} disabled={isLoading} />
        </div>
      )}

      {/* Active Attachment Previews */}
      {mediaAttachments.length > 0 && (
        <div className="mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Attached ({mediaAttachments.length})
          </span>
          <MediaPreviewGrid
            attachments={mediaAttachments}
            onRemove={removeAttachment}
            onPreview={openLightbox}
          />
        </div>
      )}

      {/* Main Input Controls Row */}
      <form onSubmit={handleSend} className="flex items-end gap-1.5 sm:gap-2">
        {/* Media Attachments Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
            className="flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 transition-all hover:border-amber-500/60 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 disabled:opacity-40"
            title="Attach Photo / Video / Audio File"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-500 dark:text-amber-400" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Live Audio Microphone Recorder */}
        <AudioRecorder onAudioRecorded={processFile} isUploading={isUploading} />

        {/* Textarea Input */}
        <div className="relative flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Describe vehicle symptoms... (Enter to send)"
            className="w-full resize-none rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-3 py-2 sm:px-3.5 sm:py-2.5 pr-8 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/80 disabled:opacity-50 min-h-[36px] sm:min-h-[40px] max-h-[100px]"
          />

          {/* Prompt Suggestion Toggle Icon */}
          <button
            type="button"
            onClick={() => setShowQuickPrompts(!showQuickPrompts)}
            className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            title="Toggle Quick Symptom Suggestions"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Send Action Button */}
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100"
          title="Send message to mechanic AI"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4 stroke-[2.5]" />
          )}
        </button>
      </form>
    </div>
  );
};
