import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBookOpen, 
  FiTrash2, 
  FiCalendar, 
  FiEdit2,
  FiStar,
  FiFilter,
  FiSearch,
  FiDownload,
  FiBookmark
} from 'react-icons/fi';
import { getAllHighlights, deleteHighlight, updateHighlight } from '../../api/endpoint';
import { toast } from 'react-hot-toast';
import { PageLoader } from '../common/Loader';
import { format } from 'date-fns';

const StudentHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [filteredHighlights, setFilteredHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [viewMode, setViewMode] = useState('grouped');

  useEffect(() => {
    fetchHighlights();
  }, []);

  useEffect(() => {
    filterHighlights();
  }, [highlights, searchTerm, selectedCategory]);

  const fetchHighlights = async () => {
    try {
      const response = await getAllHighlights();
      console.log('Highlights API response:', response);
      
      // Extract highlights array from response
      let highlightsData = [];
      
      if (Array.isArray(response)) {
        // Response is already an array
        highlightsData = response;
      } else if (response.data?.highlights) {
        highlightsData = response.data.highlights;
      } else if (response.highlights) {
        highlightsData = response.highlights;
      } else if (response.data && Array.isArray(response.data)) {
        highlightsData = response.data;
      }
      
      console.log('Extracted highlights:', highlightsData);
      setHighlights(highlightsData);
      setFilteredHighlights(highlightsData);
    } catch (error) {
      console.error('Failed to fetch highlights:', error);
      toast.error('Failed to load highlights');
      setHighlights([]);
      setFilteredHighlights([]);
    } finally {
      setLoading(false);
    }
  };

  const filterHighlights = () => {
    if (!Array.isArray(highlights)) {
      setFilteredHighlights([]);
      return;
    }
    
    let filtered = [...highlights];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.articleId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || // FIXED: Access title from articleId
        h.note?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(h => h.articleId?.category === selectedCategory); // FIXED: Access category from articleId
    }
    
    setFilteredHighlights(filtered);
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

  const handleEditNote = (highlight) => {
    setEditingHighlight(highlight);
    setNoteText(highlight.note || '');
  };

  const handleSaveNote = async () => {
    try {
      await updateHighlight(editingHighlight._id, { note: noteText });
      setHighlights(highlights.map(h => 
        h._id === editingHighlight._id ? { ...h, note: noteText } : h
      ));
      toast.success('Note updated successfully');
      setEditingHighlight(null);
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const exportHighlights = () => {
    const dataStr = JSON.stringify(filteredHighlights, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `highlights-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Get unique categories from articleId
  const categories = Array.isArray(highlights) 
    ? [...new Set(highlights.map(h => h.articleId?.category).filter(Boolean))]
    : [];

  // Group highlights by article
  const groupedHighlights = Array.isArray(filteredHighlights) 
    ? filteredHighlights.reduce((acc, highlight) => {
        const articleId = highlight.articleId?._id || highlight.articleId;
        if (!acc[articleId]) {
          acc[articleId] = {
            articleTitle: highlight.articleId?.title || 'Unknown Article', // FIXED: Get title from articleId
            articleId: articleId,
            category: highlight.articleId?.category,
            highlights: []
          };
        }
        acc[articleId].highlights.push(highlight);
        return acc;
      }, {})
    : {};

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Highlights</h1>
              <p className="text-gray-600 mt-2">
                {Array.isArray(filteredHighlights) ? filteredHighlights.length : 0} {' '}
                {filteredHighlights.length === 1 ? 'highlight' : 'highlights'} saved across {Object.keys(groupedHighlights).length} articles
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="bg-white rounded-lg shadow-sm p-1 flex">
                <button
                  onClick={() => setViewMode('grouped')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grouped' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grouped
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={exportHighlights}
                className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <FiDownload />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search highlights, articles, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* No Highlights State */}
        {!Array.isArray(filteredHighlights) || filteredHighlights.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookmark className="text-3xl text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Highlights Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No highlights match your filters. Try adjusting your search criteria.'
                : 'Start reading articles and highlight text to save them here!'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Link
                to="/student/articles"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiBookOpen /> Browse Articles
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Grouped View */}
            {viewMode === 'grouped' && (
              <div className="space-y-6">
                {Object.values(groupedHighlights).map(group => (
                  <div key={group.articleId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Article Header */}
                    <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link
                            to={`/student/articles/${group.articleId}`}
                            className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-2"
                          >
                            <FiBookOpen className="text-lg" />
                            {group.articleTitle}
                          </Link>
                          {group.category && (
                            <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                              {group.category}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {group.highlights.length} {group.highlights.length === 1 ? 'highlight' : 'highlights'}
                        </span>
                      </div>
                    </div>

                    {/* Highlights List */}
                    <div className="divide-y divide-gray-100">
                      {group.highlights.map(highlight => (
                        <div key={highlight._id} className="p-6 hover:bg-gray-50 transition-colors">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FiCalendar className="text-indigo-400" />
                              <span>
                                {highlight.timestamp 
                                  ? format(new Date(highlight.timestamp), 'MMMM d, yyyy • h:mm a')
                                  : 'Date unknown'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditNote(highlight)}
                                className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                                title="Edit note"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => handleDeleteHighlight(highlight._id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                title="Delete highlight"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>

                          {/* Highlighted Text */}
                          <blockquote className="pl-4 border-l-4 border-indigo-300 mb-3">
                            <p className="text-gray-700 italic leading-relaxed">
                              "{highlight.text}"
                            </p>
                          </blockquote>

                          {/* Note Section */}
                          {editingHighlight?._id === highlight._id ? (
                            <div className="mt-3 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add your note here..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                rows="3"
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => setEditingHighlight(null)}
                                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleSaveNote}
                                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : highlight.note ? (
                            <div className="mt-3 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                              <strong className="text-sm font-semibold text-yellow-800 block mb-2">
                                <FiStar className="inline mr-1" /> Your Note:
                              </strong>
                              <p className="text-gray-700 text-sm">{highlight.note}</p>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                {filteredHighlights.map(highlight => (
                  <div key={highlight._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        to={`/student/articles/${highlight.articleId?._id || highlight.articleId}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {highlight.articleId?.title || 'Unknown Article'} {/* FIXED: Get title from articleId */}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {highlight.timestamp 
                          ? format(new Date(highlight.timestamp), 'MMM d, yyyy')
                          : 'Date unknown'}
                      </span>
                    </div>
                    <p className="text-gray-700 italic mb-2">"{highlight.text}"</p>
                    {highlight.note && (
                      <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                        <span className="font-medium">Note:</span> {highlight.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentHighlights;