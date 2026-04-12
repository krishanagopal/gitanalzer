import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  Share2,
  Globe,
  ExternalLink,
  Download,
  Loader2
} from 'lucide-react';
import { generatePDFReport } from '../lib/pdfGenerator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  score: number;
  data?: any;
  targetRef?: React.RefObject<HTMLDivElement>;
}

export default function ShareModal({ isOpen, onClose, username, score, data, targetRef }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Create a richer share text with highlights
  const topSkills = data?.repoStats?.languageBreakdown 
    ? Object.entries(data.repoStats.languageBreakdown)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 2)
        .map(([name]) => name)
        .join(' & ')
    : '';

  const topSignal = data?.recruiterSignals?.pros?.[0]?.title || 'High Engineering Depth';
  
  const shareText = `Check out my Developer Score on GitAnalyzer! 
🚀 Score: ${score}/100
🛠️ Focus: ${topSkills}
✨ Signal: ${topSignal}

View full report:`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!targetRef?.current) return;
    
    setIsGeneratingPDF(true);
    try {
      await generatePDFReport(targetRef.current, `GitAnalyzer-Report-${username}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sharePlatforms = [
    {
      name: 'WhatsApp',
      icon: <MessageSquare className="w-5 h-5 text-green-400" />,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'hover:bg-green-500/10'
    },
    {
      name: 'LinkedIn',
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-600/10'
    },
    {
      name: 'Twitter / X',
      icon: <Globe className="w-5 h-5 text-zinc-300" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-zinc-800/20'
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GitAnalyzer Scorecard',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-md z-[101] p-0 sm:p-6"
          >
            <div className="liquid-glass rounded-3xl border border-white/20 bg-zinc-900/90 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-xl">
                    <Share2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading italic text-white">Share Report</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 gap-4 mb-6">
                   <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center gap-3 hover:from-blue-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isGeneratingPDF ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    {isGeneratingPDF ? 'Generating Report...' : 'Download PDF Report'}
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-white/60 text-sm mb-3 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold">Copy Link & Highlights</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] sm:text-sm text-white/80 line-clamp-1 flex items-center min-h-[44px]">
                      {shareUrl}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="liquid-glass rounded-xl px-4 py-3 sm:py-2 flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 bg-white/5"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-white/60 text-sm mb-3 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold">Share to Social</p>
                  <div className="grid grid-cols-1 gap-2">
                    {sharePlatforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 ${platform.color} transition-all group`}
                      >
                        <div className="flex items-center gap-3">
                          {platform.icon}
                          <span className="text-sm font-medium text-white/90 group-hover:text-white">{platform.name}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                      </a>
                    ))}
                  </div>
                </div>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full mt-6 py-3 rounded-xl border border-white/20 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition-colors active:scale-[0.98]"
                  >
                    <Share2 className="w-4 h-4" />
                    Open Native Share
                  </button>
                )}
              </div>
              
              <div className="bg-white/5 p-4 border-t border-white/10">
                <p className="text-[10px] text-center text-white/40 uppercase tracking-widest">GitAnalyzer Professional Report</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
