import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, uploadFile } from '../../api/endpoint';
import RichTextEditor from '../forms/RichTextEditor';
import FileUpload from '../forms/FileUpload';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiImage, FiVideo, FiType, FiBox, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const addContentBlock = (type) => {
    const newBlock = {
      type,
      content: '',
      order: article.contentBlocks.length,
      metadata: {}
    };

    if (type === 'text') {
      newBlock.content = '';
    } else if (type === 'image' || type === 'video') {
      newBlock.metadata = {
        fileName: '',
        fileSize: 0,
        fileType: type === 'image' ? 'image/*' : 'video/*'
      };
    } else if (type === '3d-object') {
      newBlock.metadata = {
        fileName: '',
        fileSize: 0,
        modelType: 'glb',
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      };
    }

    setArticle({
      ...article,
      contentBlocks: [...article.contentBlocks, newBlock]
    });
  };

  const updateContentBlock = (index, field, value) => {
    const updatedBlocks = [...article.contentBlocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      [field]: value
    };
    
    setArticle({
      ...article,
      contentBlocks: updatedBlocks
    });
  };

  const removeContentBlock = (index) => {
    const updatedBlocks = article.contentBlocks.filter((_, i) => i !== index);
    setArticle({
      ...article,
      contentBlocks: updatedBlocks
    });
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

  const handleFileUpload = async (file, index) => {
    try {
      const result = await uploadFile(file);
      
      const updatedBlocks = [...article.contentBlocks];
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        content: result.url,
        metadata: {
          ...updatedBlocks[index].metadata,
          fileName: file.name,
          fileSize: file.size
        }
      };
      
      setArticle({
        ...article,
        contentBlocks: updatedBlocks
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
    if (article.contentBlocks.length === 0) {
      toast.error('Please add at least one content block');
      return;
    }

    setLoading(true);
    try {
      const articleToSend = {
        ...article,
        contentBlocks: article.contentBlocks.map(block => {
          const { id, ...rest } = block;
          return rest;
        })
      };
      
      await createArticle(articleToSend);
      toast.success('Article created successfully');
      navigate('/teacher/articles');
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create article');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-600/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-600/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
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
          <h1 className="text-3xl font-bold text-white">Create New Article</h1>
          <p className="text-gray-400 mt-2">Create engaging content for your students</p>
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
                  placeholder="e.g., Introduction to Quantum Physics"
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
                  placeholder="Brief overview of the article..."
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
                  Cover Image URL (optional)
                </label>
                <input
                  type="url"
                  value={article.coverImage}
                  onChange={(e) => setArticle({ ...article, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                />
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt="Cover preview"
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
                    placeholder="Add tags and press Enter"
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
                  {article.tags.map(tag => (
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
              <div className="flex gap-2 flex-wrap">
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

            {/* Content Blocks List */}
            {article.contentBlocks.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/30 rounded-lg border border-gray-700">
                <p className="text-gray-400">No content blocks added yet</p>
                <p className="text-sm text-gray-500 mt-1">Click the buttons above to add content</p>
              </div>
            ) : (
              <div className="space-y-4">
                {article.contentBlocks.map((block, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30">
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
                          {block.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">
                          Block {index + 1} of {article.contentBlocks.length}
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
                          onClick={() => removeContentBlock(index)}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* Block Content */}
                    {block.type === 'text' && (
                      <RichTextEditor
                        value={block.content}
                        onChange={(value) => updateContentBlock(index, 'content', value)}
                      />
                    )}

                    {(block.type === 'image' || block.type === 'video' || block.type === '3d-object') && (
                      <div>
                        {block.content ? (
                          <div className="relative">
                            {block.type === 'image' && (
                              <img
                                src={block.content}
                                alt="Content"
                                className="max-h-64 rounded-lg object-cover border border-gray-700"
                              />
                            )}
                            {block.type === 'video' && (
                              <video
                                src={block.content}
                                controls
                                className="max-h-64 rounded-lg border border-gray-700"
                              />
                            )}
                            {block.type === '3d-object' && (
                              <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <p className="text-sm text-gray-300 mb-2">3D Model: {block.metadata.fileName}</p>
                                <a
                                  href={block.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                                >
                                  View Model
                                </a>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => updateContentBlock(index, 'content', '')}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ) : (
                          <FileUpload
                            onFileSelect={(file) => handleFileUpload(file, index)}
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
                ))}
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
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave /> Create Article
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;