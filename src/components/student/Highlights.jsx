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
    // Group highlights by article
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Highlights & Notes</h1>
        <p className="text-gray-600 mt-2">
          All your saved highlights and notes from articles you've read
        </p>
      </div>

      {/* No Highlights State */}
      {Object.keys(groupedHighlights).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBookOpen className="text-3xl text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Highlights Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start reading articles and highlight text to save them here. Your highlights will help you remember important points!
          </p>
          <Link
            to="/student/articles"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiBookOpen /> Browse Articles
          </Link>
        </div>
      ) : (
        // Grouped Highlights by Article
        <div className="space-y-8">
          {Object.values(groupedHighlights).map(group => (
            <div key={group.articleId} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-100">
                <Link
                  to={`/student/articles/${group.articleId}`}
                  className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-2"
                >
                  <FiBookOpen className="text-lg" />
                  {group.articleTitle}
                </Link>
              </div>

              {/* Highlights List */}
              <div className="divide-y divide-gray-100">
                {group.highlights.map((highlight, index) => (
                  <div key={highlight._id} className="p-6 hover:bg-gray-50 transition-colors">
                    {/* Header with Date and Delete */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiCalendar className="text-indigo-400" />
                        <span>{new Date(highlight.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteHighlight(highlight._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete highlight"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>

                    {/* Highlighted Text */}
                    <blockquote className="pl-4 border-l-4 border-indigo-300 mb-3">
                      <p className="text-gray-700 italic leading-relaxed">
                        "{highlight.text}"
                      </p>
                    </blockquote>

                    {/* Note if exists */}
                    {highlight.note && (
                      <div className="mt-3 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <strong className="text-sm font-semibold text-yellow-800 block mb-2">
                          Your Note:
                        </strong>
                        <p className="text-gray-700 text-sm">{highlight.note}</p>
                      </div>
                    )}

                    {/* Highlight Position Indicator */}
                    {highlight.position && (
                      <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                        <span>Position: {highlight.position.start} - {highlight.position.end}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Article Stats Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-indigo-600">{group.highlights.length}</span>
                    {group.highlights.length === 1 ? 'highlight' : 'highlights'}
                  </span>
                  <span className="text-gray-300">|</span>
                  <Link
                    to={`/student/articles/${group.articleId}`}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
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
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-indigo-600">{highlights.length}</div>
            <div className="text-sm text-gray-600">Total Highlights</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-indigo-600">
              {Object.keys(groupedHighlights).length}
            </div>
            <div className="text-sm text-gray-600">Articles with Highlights</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-indigo-600">
              {highlights.filter(h => h.note).length}
            </div>
            <div className="text-sm text-gray-600">Notes Added</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHighlights;