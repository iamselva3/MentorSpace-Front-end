import React, { useEffect, useState } from 'react';
import { getArticles } from '../../api/endpoint';
import ArticleCard from '../../components/cards/ArticleCard';
import SearchBar from '../../components/common/SearchBar';
import CategoryFilter from '../../components/common/CategoryFilter';
import Loader from '../common/Loader';

const StudentArticles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const fetchArticles = async () => {
    try {
      const response = await getArticles();
      console.log('Full API Response:', response);
      
      // CORRECT EXTRACTION: response.data.articles
      const articlesData = response.data?.articles || [];
      
      console.log('Extracted articles:', articlesData);
      setArticles(articlesData);
      setFilteredArticles(articlesData);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
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
    
    if (selectedCategory) {
      filtered = filtered.filter(article => 
        article.category === selectedCategory
      );
    }
    
    setFilteredArticles(filtered);
  };

  // Get unique categories
  const categories = Array.isArray(articles) 
    ? [...new Set(articles.map(a => a.category).filter(Boolean))]
    : [];

  if (loading) return <Loader />;

  return (
    <div className="student-articles p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Articles</h1>

      <div className="filters-section mb-6 flex gap-4">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search articles..."
        />
        <CategoryFilter 
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {!Array.isArray(filteredArticles) || filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found</p>
          <p className="text-gray-400 mt-2">Check back later for new content</p>
        </div>
      ) : (
        <div className="articles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard 
              key={article._id} 
              article={article}
              isStudent={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentArticles;