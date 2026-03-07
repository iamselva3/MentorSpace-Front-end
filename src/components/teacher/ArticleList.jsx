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
      
      const articlesData = response.data?.articles || [];
      
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

  const categories = Array.isArray(articles) 
    ? [...new Set(articles.map(a => a.category).filter(Boolean))]
    : [];

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-900 py-8 pt-24 relative overflow-hidden">
      
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
       
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Articles</h1>
            <p className="text-gray-400 mt-2">Manage and organize your educational content</p>
          </div>
          <Link
            to="/teacher/articles/create"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <FiPlus /> Create New Article
          </Link>
        </div>

       
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" className="bg-gray-800">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
            ))}
          </select>
        </div>

       
        {!Array.isArray(filteredArticles) || filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
              <FiSearch className="text-3xl text-indigo-400" />
            </div>
            <p className="text-gray-300 text-lg mb-2">No articles found</p>
            <p className="text-gray-400 mb-4">Get started by creating your first article</p>
            <Link
              to="/teacher/articles/create"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <FiPlus /> Create your first article
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                  {filteredArticles.map(article => (
                    <tr key={article._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {article.totalViews || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/teacher/articles/view/${article._id}`}
                            className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            to={`/teacher/articles/edit/${article._id}`}
                            className="text-green-400 hover:text-green-300 p-1 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => setDeleteDialog({ open: true, articleId: article._id })}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-colors"
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

        
        {Array.isArray(filteredArticles) && filteredArticles.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Total Articles</p>
              <p className="text-2xl font-bold text-white">{filteredArticles.length}</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-white">
                {filteredArticles.reduce((sum, article) => sum + (article.totalViews || 0), 0)}
              </p>
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
    </div>
  );
};

export default TeacherArticles;