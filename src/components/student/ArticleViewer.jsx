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
  
  // Missing state declarations - ADD THESE
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });

  const startTime = useRef(Date.now());
  const hasTrackedView = useRef(false);
  const hasTrackedDuration = useRef(false);
  const trackingInterval = useRef(null);

  useEffect(() => {
    // Reset tracking refs when article changes
    startTime.current = Date.now();
    hasTrackedView.current = false;
    hasTrackedDuration.current = false;
    setTimeSpent(0);

    fetchArticle();
    
    return () => {
      // Clean up interval and track final duration
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
      trackDuration();
    };
  }, [id]);

  useEffect(() => {
    // Start timer interval
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
        // Page is hidden, track current duration
        trackDuration();
      }
    };

    const handleBeforeUnload = () => {
      // User is leaving the page, track duration
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
      
      // Track view only once when article loads
      trackView();
      
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    // Prevent multiple view tracking
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    
    try {
      await trackArticleView(id);
      console.log('View tracked once');
    } catch (error) {
      console.error('Failed to track view:', error);
      // Reset flag if failed to allow retry
      hasTrackedView.current = false;
    }
  };

  const trackDuration = async () => {
    // Prevent multiple duration tracking
    if (hasTrackedDuration.current) return;
    
    const duration = Math.floor((Date.now() - startTime.current) / 1000);
    
    // Only track if duration is significant (more than 5 seconds)
    if (duration <= 5) return;
    
    hasTrackedDuration.current = true;
    
    try {
      await trackReadingTime(id, duration);
      console.log(`Duration tracked once: ${duration} seconds`);
    } catch (error) {
      console.error('Failed to track reading time:', error);
      // Reset flag if failed to allow retry
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
      setShowHighlightModal(false); // Close modal after saving
    } catch (error) {
      console.error('Failed to save highlight:', error);
    }
  };

  if (loading) return <Loader />;

  if (!article) return (
    <div className="text-center py-12">
      Article not found
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Timer Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-gray-600">
              <FiEye className="text-indigo-600" />
              <span className="text-sm">
                Views: {article?.totalViews || 0}
              </span>
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <FiClock className="text-indigo-600" />
              <span className="text-sm">
                Reading: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </span>
            </span>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {article?.category || 'Uncategorized'}
          </span>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {article?.coverImage && (
            <div className="h-64 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {article?.title}
            </h1>
            {article?.description && (
              <p className="text-gray-600 text-lg mb-4">
                {article.description}
              </p>
            )}
            {article?.createdBy && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiBookOpen className="text-indigo-400" />
                <span>
                  By {article.createdBy.name || 'Unknown'}
                </span>
                <span className="text-gray-300">•</span>
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
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {block.type === 'text' && (
                <div
                  className="prose max-w-none cursor-text select-text"
                  dangerouslySetInnerHTML={{ __html: block.content || '' }}
                />
              )}
              {block.type === 'image' && (
                <img
                  src={block.content}
                  alt="Article"
                  className="rounded-lg shadow-lg"
                />
              )}
              {block.type === 'video' && (
                <video
                  src={block.content}
                  controls
                  className="w-full rounded-lg shadow-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Highlight Modal - Now all variables are defined */}
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