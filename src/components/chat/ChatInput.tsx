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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
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
      className={`relative border-t border-slate-800/90 bg-slate-950/80 p-3 sm:p-4 backdrop-blur-xl transition-all ${
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
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 border-2 border-dashed border-amber-500 rounded-2xl backdrop-blur-sm animate-in fade-in">
          <div className="text-center space-y-1">
            <Sparkles className="h-8 w-8 text-amber-400 mx-auto animate-bounce" />
            <p className="font-bold text-slate-100 text-sm">Drop Media to Upload</p>
            <p className="text-xs text-slate-400">Photos, Audio clips, or Diagnostic Videos</p>
          </div>
        </div>
      )}

      {/* Quick Prompts Bar if toggled */}
      {showQuickPrompts && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-bold text-amber-400">Select Common Vehicle Symptom</span>
            <button
              onClick={() => setShowQuickPrompts(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <QuickPrompts onSelectPrompt={handleSelectPrompt} disabled={isLoading} />
        </div>
      )}

      {/* Active Attachment Previews */}
      {mediaAttachments.length > 0 && (
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Attached Diagnostic Media ({mediaAttachments.length})
          </span>
          <MediaPreviewGrid
            attachments={mediaAttachments}
            onRemove={removeAttachment}
            onPreview={openLightbox}
          />
        </div>
      )}

      {/* Main Input Controls Row */}
      <form onSubmit={handleSend} className="flex items-end gap-2">
        {/* Media Attachments Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-300 transition-all hover:border-amber-500/60 hover:bg-slate-800 hover:text-amber-400 hover:scale-105 active:scale-95 disabled:opacity-40"
            title="Attach Photo / Video / Audio File"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Live Audio Microphone Recorder */}
        <AudioRecorder onAudioRecorded={processFile} isUploading={isUploading} />

        {/* Textarea Input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Describe vehicle symptoms, noises, smells, or warning lights... (Enter to send)"
            className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/80 disabled:opacity-50 min-h-[42px] max-h-[140px]"
          />

          {/* Prompt Suggestion Toggle Icon */}
          <button
            type="button"
            onClick={() => setShowQuickPrompts(!showQuickPrompts)}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-400 transition-colors"
            title="Toggle Quick Symptom Suggestions"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        {/* Send Action Button */}
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-bold shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100"
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
