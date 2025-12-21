import React, { useState, useEffect } from 'react';

import { newsApi } from '../../Services/newsApi';

import './MedicalNews.css';


const MedicalNews = () => {

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);




  useEffect(() => {

    fetchNews();

  }, []);


  const fetchNews = async (refresh = false) => {

    try {

      setLoading(true);

      setError(null);

      

      const data = await newsApi.getMedicalNews(7, refresh);

      

      setArticles(data.articles);

      setLastUpdated(new Date(data.timestamp).toLocaleString());

      setLoading(false);

    } catch (err) {

      setError('Failed to load medical news. Please try again.');

      setLoading(false);

    }

  };


  const handleRefresh = async () => {

    await fetchNews(true);

  };


  if (loading) {

    return (

      <div className="loading-container">

        <div className="spinner"></div>

        <p>Loading medical news...</p>

      </div>

    );

  }


  if (error) {

    return (

      <div className="error-container">

        <p className="error-message">{error}</p>

        <button onClick={() => fetchNews()}>Try Again</button>

      </div>

    );

  }


  return (

    <div className="medical-news-container">

      <div className="header">

        <h1>Dementia Medical News</h1>

        <div className="header-actions">

          <span className="last-updated">

            Last updated: {lastUpdated}

          </span>

          <button onClick={handleRefresh} className="refresh-btn">

             Refresh

          </button>

        </div>

      </div>


      <div className="articles-grid">

        {articles.length === 0 ? (

          <p>No articles found.</p>

        ) : (

          articles.map((article, index) => (

            <div key={index} className="article-card">

              <div className="article-header">

                <span className="article-type">{article.article_type}</span>

                <span className="relevance-score">

                  Score: {article.relevance_score}/10

                </span>

              </div>

              

              <h2 className="article-title">{article.title}</h2>

              

              <div className="article-meta">

                <span className="source">{article.source}</span>

                <span className="date">{article.date}</span>

              </div>

              

              <p className="article-description">{article.description}</p>

              

              <div className="article-summary">

                <h3>Summary</h3>

                <p>{article.summary}</p>

              </div>

              

              <a 

                href={article.url} 

                target="_blank" 

                rel="noopener noreferrer"

                className="read-more-btn"

              >

                Read Full Article →

              </a>

            </div>

          ))

        )}

      </div>

    </div>

  );

};


export default MedicalNews;

