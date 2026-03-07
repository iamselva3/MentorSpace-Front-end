import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticleById, deleteArticle } from '../../api/endpoint';
import { PageLoader } from '../common/Loader';
import { toast } from 'react-hot-toast';
import { 
  FiEdit2, 
  FiTrash2, 
  FiArrowLeft, 
  FiEye, 
  FiClock, 
  FiTag,
  FiBookOpen,
  FiDownload,
  FiShare2
} from 'react-icons/fi';
import { format, isValid } from 'date-fns';

const ViewArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBlock, setActiveBlock] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await getArticleById(id);
      
      const articleData = response.data?.article || response;
      setArticle(articleData);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('Failed to fetch article');
      navigate('/teacher/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        toast.success('Article deleted successfully');
        navigate('/teacher/articles');
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  const handleExport = () => {
    const articleData = JSON.stringify(article, null, 2);
    const blob = new Blob([articleData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, 'MMM d');
    } catch (error) {
      return 'N/A';
    }
  };

  const renderContentBlock = (block) => {
    if (!block) return null;
    
    switch (block.type) {
      case 'text':
        return (
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );
      
      case 'image':
        return (
          <div className="my-4">
            <img 
              src={block.content} 
              alt="Article content" 
              className="max-w-full rounded-lg shadow-lg border border-gray-700"
            />
            {block.metadata?.caption && (
              <p className="text-sm text-gray-400 mt-2">{block.metadata.caption}</p>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="my-4">
            <video 
              src={block.content} 
              controls 
              className="w-full rounded-lg shadow-lg border border-gray-700"
            />
          </div>
        );
      
      case '3d-object':
        return (
          <div className="my-4 p-6 bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-600">
            <p className="text-center text-gray-400 mb-2">3D Model</p>
            <a 
              href={block.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiDownload /> Download Model
            </a>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) return <PageLoader />;
  if (!article) return <div>Article not found</div>;

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
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-600/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-600/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/teacher/articles')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft /> Back to Articles
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
              title="Share"
            >
              <FiShare2 />
            </button>
            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
              title="Export"
            >
              <FiDownload />
            </button>
            <Link
              to={`/teacher/articles/edit/${id}`}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Edit"
            >
              <FiEdit2 />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
          {article.coverImage && (
            <div className="h-64 overflow-hidden border-b border-gray-700">
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium border border-indigo-500/30">
                {article.category || 'Uncategorized'}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <FiEye /> {article.totalViews || article.views || 0} views
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <FiClock /> {formatDate(article.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
            
            {article.description && (
              <p className="text-gray-300 text-lg mb-4">{article.description}</p>
            )}

            
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <FiTag className="text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs border border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        
        <div className="space-y-6">
          {article.contentBlocks && article.contentBlocks.length > 0 ? (
            article.contentBlocks.map((block, index) => (
              <div 
                key={block._id || index}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-all border ${
                  activeBlock === index ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-gray-700'
                }`}
                onClick={() => setActiveBlock(index)}
              >
                {/* Block Type Indicator */}
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
                  <FiBookOpen className="text-indigo-400" />
                  <span className="text-sm font-medium text-gray-400">
                    Block {index + 1} • {block.type ? block.type.charAt(0).toUpperCase() + block.type.slice(1) : 'Unknown'}
                  </span>
                </div>

                
                {renderContentBlock(block)}
              </div>
            ))
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center text-gray-400 border border-gray-700">
              No content blocks available
            </div>
          )}
        </div>

        
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
          <h3 className="font-semibold text-white mb-4">Article Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-white">{article.totalViews || article.views || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Unique Readers</p>
              <p className="text-2xl font-bold text-white">{article.uniqueStudents?.length || article.uniqueReaders || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Content Blocks</p>
              <p className="text-2xl font-bold text-white">{article.contentBlocks?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="text-2xl font-bold text-white">
                {formatShortDate(article.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewArticle;