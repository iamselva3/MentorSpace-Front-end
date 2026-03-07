import React, { useEffect, useState } from 'react';
import { getAllHighlights, deleteHighlight } from '../../api/endpoint';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiBookOpen, FiTrash2, FiCalendar } from 'react-icons/fi';
import { PageLoader } from '../../components/common/Loader';

const StudentHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [groupedHighlights, setGroupedHighlights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
  }, []);

  useEffect(() => {
    const grouped = highlights.reduce((acc, highlight) => {
      if (!acc[highlight.articleId]) {
        acc[highlight.articleId] = {
          articleTitle: highlight.articleTitle,
          articleId: highlight.articleId,
          highlights: []
        };
      }
      acc[highlight.articleId].highlights.push(highlight);
      return acc;
    }, {});
    setGroupedHighlights(grouped);
  }, [highlights]);

  const fetchHighlights = async () => {
    try {
      const data = await getAllHighlights();
      setHighlights(data);
    } catch (error) {
      console.error('Failed to fetch highlights:', error);
      toast.error('Failed to load highlights');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHighlight = async (highlightId) => {
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      try {
        await deleteHighlight(highlightId);
        setHighlights(highlights.filter(h => h._id !== highlightId));
        toast.success('Highlight deleted successfully');
      } catch (error) {
        toast.error('Failed to delete highlight');
      }
    }
  };

  if (loading) return <PageLoader />;

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Highlights & Notes</h1>
          <p className="text-gray-400 mt-2">
            All your saved highlights and notes from articles you've read
          </p>
        </div>

        {/* No Highlights State */}
        {Object.keys(groupedHighlights).length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
              <FiBookOpen className="text-3xl text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Highlights Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start reading articles and highlight text to save them here. Your highlights will help you remember important points!
            </p>
            <Link
              to="/student/articles"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <FiBookOpen /> Browse Articles
            </Link>
          </div>
        ) : (
          // Grouped Highlights by Article
          <div className="space-y-8">
            {Object.values(groupedHighlights).map(group => (
              <div key={group.articleId} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                {/* Article Header */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-transparent px-6 py-4 border-b border-gray-700">
                  <Link
                    to={`/student/articles/${group.articleId}`}
                    className="text-xl font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-2 transition-colors"
                  >
                    <FiBookOpen className="text-lg" />
                    {group.articleTitle}
                  </Link>
                </div>

                {/* Highlights List */}
                <div className="divide-y divide-gray-700">
                  {group.highlights.map((highlight, index) => (
                    <div key={highlight._id} className="p-6 hover:bg-gray-700/30 transition-colors">
                      {/* Header with Date and Delete */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiCalendar className="text-indigo-400" />
                          <span>{new Date(highlight.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteHighlight(highlight._id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
                          title="Delete highlight"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>

                      {/* Highlighted Text */}
                      <blockquote className="pl-4 border-l-4 border-indigo-500/50 mb-3">
                        <p className="text-gray-300 italic leading-relaxed">
                          "{highlight.text}"
                        </p>
                      </blockquote>

                      {/* Note if exists */}
                      {highlight.note && (
                        <div className="mt-3 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                          <strong className="text-sm font-semibold text-yellow-400 block mb-2">
                            Your Note:
                          </strong>
                          <p className="text-gray-300 text-sm">{highlight.note}</p>
                        </div>
                      )}

                      {/* Highlight Position Indicator */}
                      {highlight.position && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                          <span>Position: {highlight.position.start} - {highlight.position.end}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Article Stats Footer */}
                <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-indigo-400">{group.highlights.length}</span>
                      {group.highlights.length === 1 ? 'highlight' : 'highlights'}
                    </span>
                    <span className="text-gray-600">|</span>
                    <Link
                      to={`/student/articles/${group.articleId}`}
                      className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                    >
                      Continue Reading →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats Summary */}
        {Object.keys(groupedHighlights).length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-indigo-400">{highlights.length}</div>
              <div className="text-sm text-gray-400">Total Highlights</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-indigo-400">
                {Object.keys(groupedHighlights).length}
              </div>
              <div className="text-sm text-gray-400">Articles with Highlights</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-indigo-400">
                {highlights.filter(h => h.note).length}
              </div>
              <div className="text-sm text-gray-400">Notes Added</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHighlights;