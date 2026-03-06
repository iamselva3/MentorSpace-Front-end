import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherArticles, deleteArticle } from '../../api/endpoint';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { PageLoader } from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const TeacherArticles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, articleId: null });

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, categoryFilter]);

  const fetchArticles = async () => {
    try {
      const response = await getTeacherArticles();
      console.log('API Response:', response);
      
      // Extract articles from the response structure
      // Your API returns: { status: "success", results: 1, data: { articles: [...] } }
      const articlesData = response.data?.articles || [];
      
      console.log('Extracted articles:', articlesData);
      setArticles(articlesData);
      setFilteredArticles(articlesData);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Failed to fetch articles');
      setArticles([]);
      setFilteredArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!Array.isArray(articles)) {
      setFilteredArticles([]);
      return;
    }
    
    let filtered = [...articles];
    
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }
    
    setFilteredArticles(filtered);
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(deleteDialog.articleId);
      setArticles(articles.filter(a => a._id !== deleteDialog.articleId));
      toast.success('Article deleted successfully');
    } catch (error) {
      toast.error('Failed to delete article');
    } finally {
      setDeleteDialog({ open: false, articleId: null });
    }
  };

  // Safely get unique categories
  const categories = Array.isArray(articles) 
    ? [...new Set(articles.map(a => a.category).filter(Boolean))]
    : [];

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Articles</h1>
        <Link
          to="/teacher/articles/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <FiPlus /> Create New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Articles Table */}
      {!Array.isArray(filteredArticles) || filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No articles found</p>
          <Link
            to="/teacher/articles/create"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map(article => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.totalViews || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/teacher/articles/view/${article._id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/teacher/articles/edit/${article._id}`}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => setDeleteDialog({ open: true, articleId: article._id })}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, articleId: null })}
      />
    </div>
  );
};

export default TeacherArticles;