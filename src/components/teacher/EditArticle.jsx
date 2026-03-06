import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, updateArticle, uploadFile } from '../../api/endpoint';
import RichTextEditor from '../forms/RichTextEditor';
import FileUpload from '../forms/FileUpload';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiPlus, FiImage, FiVideo, FiType, FiBox, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { PageLoader } from '../common/Loader';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    category: '',
    description: '',
    coverImage: '',
    tags: [],
    contentBlocks: []
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    'Science',
    'Mathematics',
    'English',
    'History',
    'Geography',
    'Art',
    'Technology',
    'Physics',
    'Chemistry',
    'Biology'
  ];

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await getArticleById(id);
      
      let articleData = response;
      
      if (response.data?.article) {
        articleData = response.data.article;
      } else if (response.data) {
        articleData = response.data;
      }
      
      const processedArticle = {
        ...articleData,
        title: articleData.title || '',
        category: articleData.category || '',
        description: articleData.description || '',
        coverImage: articleData.coverImage || '',
        tags: Array.isArray(articleData.tags) ? articleData.tags : [],
        contentBlocks: Array.isArray(articleData.contentBlocks) 
          ? articleData.contentBlocks.map(block => ({
              ...block,
              id: block._id || Date.now() + Math.random()
            }))
          : []
      };
      
      setArticle(processedArticle);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('Failed to fetch article');
      navigate('/teacher/articles');
    } finally {
      setLoading(false);
    }
  };

  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now() + Math.random(),
      type,
      content: '',
      order: article.contentBlocks.length,
      metadata: {}
    };

    setArticle({
      ...article,
      contentBlocks: [...article.contentBlocks, newBlock]
    });
  };

  const updateContentBlock = (id, field, value) => {
    setArticle({
      ...article,
      contentBlocks: article.contentBlocks.map(block =>
        block.id === id ? { ...block, [field]: value } : block
      )
    });
  };

  const removeContentBlock = (id) => {
    if (window.confirm('Are you sure you want to remove this block?')) {
      setArticle({
        ...article,
        contentBlocks: article.contentBlocks.filter(block => block.id !== id)
      });
    }
  };

  const moveBlockUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...article.contentBlocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    setArticle({ ...article, contentBlocks: newBlocks });
  };

  const moveBlockDown = (index) => {
    if (index === article.contentBlocks.length - 1) return;
    const newBlocks = [...article.contentBlocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    setArticle({ ...article, contentBlocks: newBlocks });
  };

  const handleFileUpload = async (file, blockId) => {
    try {
      const result = await uploadFile(file);
      updateContentBlock(blockId, 'content', result.url);
      updateContentBlock(blockId, 'metadata', {
        ...article.contentBlocks.find(b => b.id === blockId).metadata,
        fileName: file.name,
        fileSize: file.size
      });
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle({
        ...article,
        tags: [...article.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setArticle({
      ...article,
      tags: article.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!article.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!article.category) {
      toast.error('Please select a category');
      return;
    }

    setSaving(true);
    try {
      const articleToSubmit = {
        ...article,
        contentBlocks: article.contentBlocks.map(block => {
          const { id, ...rest } = block;
          return rest;
        })
      };
      
      await updateArticle(id, articleToSubmit);
      toast.success('Article updated successfully');
      navigate('/teacher/articles');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update article');
    } finally {
      setSaving(false);
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
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher/articles')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft /> Back to Articles
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Article</h1>
          <p className="text-gray-400 mt-2">Update your article content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Article Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => setArticle({ ...article, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Description
                </label>
                <textarea
                  value={article.description}
                  onChange={(e) => setArticle({ ...article, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={article.category}
                  onChange={(e) => setArticle({ ...article, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" className="bg-gray-800">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={article.coverImage}
                  onChange={(e) => setArticle({ ...article, coverImage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                />
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt="Cover"
                    className="mt-2 h-32 object-cover rounded-lg border border-gray-700"
                  />
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(article.tags) && article.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm border border-indigo-500/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Content Blocks</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addContentBlock('text')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <FiType /> Text
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('image')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <FiImage /> Image
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('video')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <FiVideo /> Video
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('3d-object')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <FiBox /> 3D Object
                </button>
              </div>
            </div>

            {Array.isArray(article.contentBlocks) && article.contentBlocks.length > 0 ? (
              article.contentBlocks.map((block, index) => (
                <div key={block.id || index} className="border border-gray-700 rounded-lg p-4 mb-4 bg-gray-800/30">
                  {/* Block Header */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className={`
                        px-2 py-1 rounded text-xs font-medium border
                        ${block.type === 'text' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                        ${block.type === 'image' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                        ${block.type === 'video' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
                        ${block.type === '3d-object' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : ''}
                      `}>
                        {block.type?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveBlockUp(index)}
                        disabled={index === 0}
                        className={`p-1 rounded hover:bg-gray-700 ${
                          index === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400'
                        }`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlockDown(index)}
                        disabled={index === article.contentBlocks.length - 1}
                        className={`p-1 rounded hover:bg-gray-700 ${
                          index === article.contentBlocks.length - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400'
                        }`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeContentBlock(block.id)}
                        className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Block Content */}
                  {block.type === 'text' && (
                    <RichTextEditor
                      value={block.content || ''}
                      onChange={(value) => updateContentBlock(block.id, 'content', value)}
                    />
                  )}

                  {(block.type === 'image' || block.type === 'video' || block.type === '3d-object') && (
                    <div>
                      {block.content ? (
                        <div className="relative">
                          {block.type === 'image' && (
                            <img src={block.content} alt="" className="max-h-64 rounded-lg border border-gray-700" />
                          )}
                          {block.type === 'video' && (
                            <video src={block.content} controls className="max-h-64 rounded-lg border border-gray-700" />
                          )}
                          {block.type === '3d-object' && (
                            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                              <a href={block.content} target="_blank" rel="noopener noreferrer" 
                                 className="text-indigo-400 hover:text-indigo-300">
                                View 3D Model
                              </a>
                            </div>
                          )}
                          <button
                            onClick={() => updateContentBlock(block.id, 'content', '')}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <FileUpload
                          onFileSelect={(file) => handleFileUpload(file, block.id)}
                          accept={
                            block.type === 'image' ? 'image/*' :
                            block.type === 'video' ? 'video/*' :
                            '.glb,.gltf,.obj'
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-700/30 rounded-lg border border-gray-700">
                <p className="text-gray-400">No content blocks added yet</p>
                <p className="text-sm text-gray-500 mt-1">Click the buttons above to add content</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/teacher/articles')}
              className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;