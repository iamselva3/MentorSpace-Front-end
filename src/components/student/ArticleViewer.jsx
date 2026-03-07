import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  getArticleById,
  trackArticleView,
  trackReadingTime,
  createHighlight
} from '../../api/endpoint';
import Loader from '../common/Loader';
import HighlightModal from './HighlightModal';
import { FiClock, FiEye, FiBookOpen } from 'react-icons/fi';

const StudentArticleView = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });

  const startTime = useRef(Date.now());
  const hasTrackedView = useRef(false);
  const hasTrackedDuration = useRef(false);
  const trackingInterval = useRef(null);

  useEffect(() => {
    startTime.current = Date.now();
    hasTrackedView.current = false;
    hasTrackedDuration.current = false;
    setTimeSpent(0);

    fetchArticle();
    
    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
      trackDuration();
    };
  }, [id]);

  useEffect(() => {
    trackingInterval.current = setInterval(() => {
      const currentDuration = Math.floor((Date.now() - startTime.current) / 1000);
      setTimeSpent(currentDuration);
    }, 1000);

    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackDuration();
      }
    };

    const handleBeforeUnload = () => {
      trackDuration();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const fetchArticle = async () => {
    try {
      const response = await getArticleById(id);
      
      let articleData;
      if (response.data?.article) {
        articleData = response.data.article;
      } else if (response.data) {
        articleData = response.data;
      } else {
        articleData = response;
      }

      setArticle(articleData);
      trackView();
      
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    
    try {
      await trackArticleView(id);
      console.log('View tracked once');
    } catch (error) {
      console.error('Failed to track view:', error);
      hasTrackedView.current = false;
    }
  };

  const trackDuration = async () => {
    if (hasTrackedDuration.current) return;
    
    const duration = Math.floor((Date.now() - startTime.current) / 1000);
    
    if (duration <= 5) return;
    
    hasTrackedDuration.current = true;
    
    try {
      await trackReadingTime(id, duration);
      console.log(`Duration tracked once: ${duration} seconds`);
    } catch (error) {
      console.error('Failed to track reading time:', error);
      hasTrackedDuration.current = false;
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setShowHighlightModal(true);

      selection.removeAllRanges();
    }
  };

  const handleSaveHighlight = async (text, note, color) => {
    try {
      await createHighlight({
        articleId: id,
        text,
        note,
        color
      });
      console.log('Highlight saved');
      setShowHighlightModal(false);
    } catch (error) {
      console.error('Failed to save highlight:', error);
    }
  };

  if (loading) return <Loader />;

  if (!article) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <FiBookOpen className="text-3xl text-red-400" />
        </div>
        <p className="text-gray-300 text-lg">Article not found</p>
        <p className="text-gray-500 mt-2">The article you're looking for doesn't exist or has been removed</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 pt-24 relative overflow-hidden">
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Timer Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-700">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-gray-300">
              <FiEye className="text-indigo-400" />
              <span className="text-sm">
                Views: {article?.totalViews || 0}
              </span>
            </span>
            <span className="flex items-center gap-2 text-gray-300">
              <FiClock className="text-indigo-400" />
              <span className="text-sm">
                Reading: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </span>
            </span>
          </div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/30">
            {article?.category || 'Uncategorized'}
          </span>
        </div>

        {/* Article Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
          {article?.coverImage && (
            <div className="h-64 overflow-hidden border-b border-gray-700">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {article?.title}
            </h1>
            {article?.description && (
              <p className="text-gray-300 text-lg mb-4">
                {article.description}
              </p>
            )}
            {article?.createdBy && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiBookOpen className="text-indigo-400" />
                <span>
                  By {article.createdBy.name || 'Unknown'}
                </span>
                <span className="text-gray-600">•</span>
                <span>
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div
          className="space-y-6"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
        >
          {article?.contentBlocks?.map((block, index) => (
            <div
              key={block._id || index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:border-indigo-500/30 transition-colors"
            >
              {block.type === 'text' && (
                <div
                  className="prose prose-invert text-white max-w-none cursor-text select-text"
                  dangerouslySetInnerHTML={{ __html: block.content || '' }}
                />
              )}
              {block.type === 'image' && (
                <img
                  src={block.content}
                  alt="Article"
                  className="rounded-lg shadow-lg border border-gray-700"
                />
              )}
              {block.type === 'video' && (
                <video
                  src={block.content}
                  controls
                  className="w-full rounded-lg shadow-lg border border-gray-700"
                />
              )}
            </div>
          ))}
        </div>

        {/* Reading Progress Footer */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Reading progress</span>
            <span>{Math.floor(timeSpent / 60)} minutes spent</span>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (timeSpent / 300) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Highlight Modal */}
      <HighlightModal
        isOpen={showHighlightModal}
        onClose={() => setShowHighlightModal(false)}
        onSave={handleSaveHighlight}
        selectedText={selectedText}
        position={selectionPosition}
      />
    </div>
  );
};

export default StudentArticleView;