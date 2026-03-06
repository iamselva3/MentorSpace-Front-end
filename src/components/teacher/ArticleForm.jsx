import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, uploadFile } from '../../api/endpoint';
import RichTextEditor from '../../components/forms/RichTextEditor';
import FileUpload from '../../components/forms/FileUpload';
import { toast } from 'react-hot-toast';

const TeacherCreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    category: '',
    contentBlocks: []
  });

  const categories = ['Science', 'Math', 'English', 'History', 'Geography', 'Art', 'Technology'];

  const addContentBlock = (type) => {
    setArticle({
      ...article,
      contentBlocks: [
        ...article.contentBlocks,
        {
          type,
          content: '',
          order: article.contentBlocks.length,
          metadata: {}
        }
      ]
    });
  };

  const updateContentBlock = (index, field, value) => {
    const updatedBlocks = [...article.contentBlocks];
    updatedBlocks[index][field] = value;
    setArticle({ ...article, contentBlocks: updatedBlocks });
  };

  const removeContentBlock = (index) => {
    const updatedBlocks = article.contentBlocks.filter((_, i) => i !== index);
    setArticle({ ...article, contentBlocks: updatedBlocks });
  };

  const handleFileUpload = async (file, index) => {
    try {
      const result = await uploadFile(file);
      updateContentBlock(index, 'content', result.url);
      updateContentBlock(index, 'metadata', { fileName: file.name, fileSize: file.size });
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createArticle(article);
      toast.success('Article created successfully');
      navigate('/teacher/articles');
    } catch (error) {
      toast.error('Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-article">
      <h1>Create New Article</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={article.category}
            onChange={(e) => setArticle({ ...article, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="content-blocks">
          <h3>Content Blocks</h3>
          
          <div className="add-block-buttons">
            <button type="button" onClick={() => addContentBlock('text')}>
              + Add Text
            </button>
            <button type="button" onClick={() => addContentBlock('image')}>
              + Add Image
            </button>
            <button type="button" onClick={() => addContentBlock('video')}>
              + Add Video
            </button>
            <button type="button" onClick={() => addContentBlock('3d-object')}>
              + Add 3D Object
            </button>
          </div>

          {article.contentBlocks.map((block, index) => (
            <div key={index} className="content-block">
              <div className="block-header">
                <span className="block-type">{block.type}</span>
                <button 
                  type="button" 
                  onClick={() => removeContentBlock(index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
              
              <div className="block-content">
                {block.type === 'text' && (
                  <RichTextEditor
                    value={block.content}
                    onChange={(value) => updateContentBlock(index, 'content', value)}
                  />
                )}
                
                {(block.type === 'image' || block.type === 'video' || block.type === '3d-object') && (
                  <FileUpload
                    onFileSelect={(file) => handleFileUpload(file, index)}
                    accept={block.type === 'image' ? 'image/*' : block.type === 'video' ? 'video/*' : '.glb,.gltf'}
                  />
                )}
                
                {block.content && (
                  <div className="preview">
                    {block.type === 'image' && (
                      <img src={block.content} alt="Preview" />
                    )}
                    {block.type === 'video' && (
                      <video src={block.content} controls />
                    )}
                    {block.type === '3d-object' && (
                      <div>3D Object: <a href={block.content} target="_blank">View</a></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Article'}
        </button>
      </form>
    </div>
  );
};