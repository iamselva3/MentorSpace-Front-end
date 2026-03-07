import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, updateArticle } from '../../api/endpoint';
import RichTextEditor from '../forms/RichTextEditor';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiImage, FiVideo, FiType, FiBox, FiTrash2, FiArrowLeft, FiUpload, FiLink, FiFile, FiEye, FiDownload } from 'react-icons/fi';
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
  const [showUrlInput, setShowUrlInput] = useState(null);
  
  // Create refs for file inputs
  const fileInputRefs = useRef({});

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
    'Biology',
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
      
      // Process content blocks to add unique IDs for React keys
      const processedArticle = {
        ...articleData,
        title: articleData.title || '',
        category: articleData.category || '',
        description: articleData.description || '',
        coverImage: articleData.coverImage || '',
        tags: Array.isArray(articleData.tags) ? articleData.tags : [],
        contentBlocks: Array.isArray(articleData.contentBlocks) 
          ? articleData.contentBlocks.map((block, index) => ({
              ...block,
              id: block._id || `block-${Date.now()}-${index}`,
              // For media blocks, ensure metadata exists
              metadata: block.metadata || {}
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
      id: `new-${Date.now()}-${Math.random()}`,
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

  const updateContentBlock = (id, field, value) => {
    setArticle({
      ...article,
      contentBlocks: article.contentBlocks.map(block =>
        block.id === id ? { ...block, [field]: value } : block
      )
    });
  };

  const removeContentBlock = (id) => {
    const updatedBlocks = article.contentBlocks.filter(block => block.id !== id);
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

 const handleFileUpload = (file, blockId) => {
  try {
    // Find the block index
    const blockIndex = article.contentBlocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
      console.error('❌ Block not found with id:', blockId);
      return;
    }

    // Create a preview URL for the file
    const previewUrl = URL.createObjectURL(file);
    
    const updatedBlocks = [...article.contentBlocks];
    updatedBlocks[blockIndex] = {
      ...updatedBlocks[blockIndex],
      content: file, // Store the File object here - this is CRITICAL
      type: updatedBlocks[blockIndex].type || 'image', // Ensure type is set
      metadata: {
        ...updatedBlocks[blockIndex].metadata,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        previewUrl: previewUrl
      }
    };
    
    setArticle({
      ...article,
      contentBlocks: updatedBlocks
    });
    
    console.log(`✅ File ready for upload - block ${blockIndex}:`, file.name);
    toast.success('File ready for upload');
  } catch (error) {
    console.error('❌ Error in handleFileUpload:', error);
    toast.error('Failed to prepare file');
  }
};

  const handleUrlSubmit = (blockId, url) => {
    if (!url) return;
    
    const blockIndex = article.contentBlocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;
    
    const updatedBlocks = [...article.contentBlocks];
    updatedBlocks[blockIndex] = {
      ...updatedBlocks[blockIndex],
      content: url,
      metadata: {
        ...updatedBlocks[blockIndex].metadata,
        isUrl: true,
        url: url
      }
    };
    
    setArticle({
      ...article,
      contentBlocks: updatedBlocks
    });
    
    setShowUrlInput(null);
    toast.success('URL added successfully');
  };

  const handleFileSelect = (e, blockId) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, blockId);
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
    
    

    setSaving(true);
    try {
        // Reorder blocks to ensure correct order values
        const reorderedBlocks = article.contentBlocks.map((block, index) => {
            const { id, ...blockData } = block;
            
            if (blockData.type === 'text') {
                return {
                    type: 'text',
                    content: blockData.content || '',
                    order: index,
                    metadata: blockData.metadata || {}
                };
            } else {
                return {
                    type: blockData.type,
                    content: blockData.content || '',
                    order: index,
                    metadata: {
                        fileName: blockData.metadata?.fileName || '',
                        fileSize: blockData.metadata?.fileSize || 0,
                        fileType: blockData.metadata?.fileType || '',
                        ...(blockData.metadata?.isUrl ? { isUrl: true, url: blockData.metadata.url } : {})
                    }
                };
            }
        });

        const articleToSend = {
            title: article.title,
            category: article.category,
            description: article.description || '',
            coverImage: article.coverImage || '',
            tags: article.tags || [],
            contentBlocks: reorderedBlocks
        };

        console.log('📤 FRONTEND - Sending article:', articleToSend);
        
        await updateArticle(id, articleToSend);
        toast.success('Article updated successfully');
        navigate('/teacher/articles');
    } catch (error) {
        console.error('Update error:', error);
        toast.error(error.response?.data?.message || 'Failed to update article');
    } finally {
        setSaving(false);
    }
};

  // Render file upload area - EXACT same as create article
  const renderFileUploadArea = (block) => {
    const getIcon = () => {
      switch(block.type) {
        case 'image': return <FiImage className="w-16 h-16 text-indigo-400" />;
        case 'video': return <FiVideo className="w-16 h-16 text-purple-400" />;
        case '3d-object': return <FiBox className="w-16 h-16 text-orange-400" />;
        default: return <FiFile className="w-16 h-16 text-gray-400" />;
      }
    };

    const getTitle = () => {
      switch(block.type) {
        case 'image': return 'Click to upload an image';
        case 'video': return 'Click to upload a video';
        case '3d-object': return 'Click to upload a 3D model';
        default: return 'Click to upload a file';
      }
    };

    const getSubtitle = () => {
      switch(block.type) {
        case 'image': return 'PNG, JPG, GIF, SVG (Max 10MB)';
        case 'video': return 'MP4, WebM, MOV (Max 100MB)';
        case '3d-object': return 'GLB, GLTF, OBJ (Max 50MB)';
        default: return '';
      }
    };

    const getGradientColor = () => {
      switch(block.type) {
        case 'image': return 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20';
        case 'video': return 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20';
        case '3d-object': return 'from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20';
        default: return 'from-gray-500/10 to-gray-600/10 hover:from-gray-500/20 hover:to-gray-600/20';
      }
    };

    const getBorderColor = () => {
      switch(block.type) {
        case 'image': return 'hover:border-blue-500';
        case 'video': return 'hover:border-purple-500';
        case '3d-object': return 'hover:border-orange-500';
        default: return 'hover:border-indigo-500';
      }
    };

    const handleContainerClick = () => {
      if (fileInputRefs.current[block.id]) {
        fileInputRefs.current[block.id].click();
      }
    };

    if (showUrlInput === block.id) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 border-2 border-indigo-500/50">
          <h4 className="text-white font-medium text-lg mb-4">Enter {block.type} URL</h4>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder={`https://example.com/${block.type === 'image' ? 'image.jpg' : block.type === 'video' ? 'video.mp4' : 'model.glb'}`}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit(block.id, e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowUrlInput(null)}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Press Enter to confirm URL</p>
        </div>
      );
    }

    return (
      <>
        <input
          type="file"
          ref={el => fileInputRefs.current[block.id] = el}
          onChange={(e) => handleFileSelect(e, block.id)}
          accept={
            block.type === 'image' ? 'image/*' :
            block.type === 'video' ? 'video/*' :
            '.glb,.gltf,.obj'
          }
          className="hidden"
        />
        
        <div 
          onClick={handleContainerClick}
          className={`
            relative bg-gradient-to-br ${getGradientColor()} 
            rounded-xl p-10 border-3 border-dashed border-gray-600 
            ${getBorderColor()} transition-all duration-300 
            cursor-pointer group
            hover:scale-[1.02] hover:shadow-xl
          `}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            {/* Icon with animated background */}
            <div className="mb-6 p-5 bg-gray-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
              {getIcon()}
            </div>
            
            {/* Main title */}
            <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
              {getTitle()}
            </h3>
            
            {/* Subtitle with file info */}
            <p className="text-gray-400 mb-4 max-w-md group-hover:text-gray-300 transition-colors">
              {getSubtitle()}
            </p>
            
            {/* Click indicator */}
            <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full">
              <FiUpload className="group-hover:animate-bounce" />
              <span className="text-sm font-medium">Browse files or drag and drop</span>
            </div>
            
            {/* URL option */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(block.id);
              }}
              className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-400 transition-colors"
            >
              <FiLink size={14} />
              <span>Or enter a URL instead</span>
            </button>
          </div>

          {/* Ripple effect on hover */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-45 group-hover:animate-shimmer"></div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render preview for uploaded media - EXACT same as create article
  const renderMediaPreview = (block) => {
    const previewUrl = block.metadata?.previewUrl || block.content;

    const getPreviewStyle = () => {
      switch(block.type) {
        case 'image':
          return (
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Uploaded content"
                className="max-h-96 rounded-lg object-contain bg-gray-900/50 border border-gray-700"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Preview+Not+Available';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <FiEye className="text-white" />
                </button>
              </div>
            </div>
          );
        case 'video':
          return (
            <div className="relative">
              <video
                src={previewUrl}
                controls
                className="max-h-96 rounded-lg border border-gray-700 bg-gray-900/50"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );
        case '3d-object':
          return (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <FiBox className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{block.metadata?.fileName || '3D Model'}</h4>
                  <p className="text-sm text-gray-400">
                    {block.metadata?.fileSize ? `${(block.metadata.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}
                  </p>
                </div>
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full"
              >
                <FiEye />
                View Model
              </a>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="relative">
        {getPreviewStyle()}
        <button
          type="button"
          onClick={() => updateContentBlock(block.id, 'content', '')}
          className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors backdrop-blur-sm"
          title="Remove media"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    );
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
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-600/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-600/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher/articles')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Articles
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
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-700">
                    <img
                      src={article.coverImage}
                      alt="Cover preview"
                      className="h-32 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setArticle({ ...article, coverImage: '' })}
                      className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
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
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                >
                  <FiType /> Text
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('image')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30"
                >
                  <FiImage /> Image
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('video')}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                >
                  <FiVideo /> Video
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock('3d-object')}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors border border-orange-500/30"
                >
                  <FiBox /> 3D Object
                </button>
              </div>
            </div>

            {/* Content Blocks List */}
            {article.contentBlocks.length === 0 ? (
              <div className="text-center py-16 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700">
                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFile className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No content blocks added yet</p>
                <p className="text-sm text-gray-500 mb-6">Start building your article by adding content blocks above</p>
                <div className="flex gap-2 justify-center text-xs text-gray-600">
                  <span className="px-2 py-1 bg-gray-800 rounded">Text</span>
                  <span className="px-2 py-1 bg-gray-800 rounded">Images</span>
                  <span className="px-2 py-1 bg-gray-800 rounded">Videos</span>
                  <span className="px-2 py-1 bg-gray-800 rounded">3D Models</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {article.contentBlocks.map((block, index) => (
                  <div key={block.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:border-gray-600 transition-colors">
                    {/* Block Header */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className={`
                          px-3 py-1 rounded-lg text-sm font-medium
                          ${block.type === 'text' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
                          ${block.type === 'image' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                          ${block.type === 'video' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : ''}
                          ${block.type === '3d-object' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : ''}
                        `}>
                          {block.type === 'text' && <FiType className="inline mr-1" />}
                          {block.type === 'image' && <FiImage className="inline mr-1" />}
                          {block.type === 'video' && <FiVideo className="inline mr-1" />}
                          {block.type === '3d-object' && <FiBox className="inline mr-1" />}
                          {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                        </span>
                        <span className="text-sm text-gray-400">
                          Block {index + 1} of {article.contentBlocks.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveBlockUp(index)}
                          disabled={index === 0}
                          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
                            index === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                          }`}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlockDown(index)}
                          disabled={index === article.contentBlocks.length - 1}
                          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
                            index === article.contentBlocks.length - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                          }`}
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeContentBlock(block.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Remove block"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* Block Content */}
                    {block.type === 'text' && (
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <RichTextEditor
                          value={block.content || ''}
                          onChange={(value) => updateContentBlock(block.id, 'content', value)}
                          placeholder="Start writing your content here..."
                        />
                      </div>
                    )}

                    {(block.type === 'image' || block.type === 'video' || block.type === '3d-object') && (
                      <div>
                        {block.content ? (
                          renderMediaPreview(block)
                        ) : (
                          renderFileUploadArea(block)
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 sticky bottom-4 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/teacher/articles')}
              className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
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