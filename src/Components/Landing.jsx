import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { useDarkMode } from '../Context/DarkModeContext'
import { useLocation } from 'react-router-dom';

const Card = ({ article, isBookmarked, onBookmarkToggle }) => {
  const { darkMode } = useDarkMode();
  const fallbackImage = `https://ideogram.ai/assets/progressive-image/balanced/response/yobppIxLQuSRVgiMag4GgA`;

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md overflow-hidden relative w-full sm:w-64 h-auto sm:h-80 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl`}>
      <img
        src={article.urlToImage || fallbackImage}
        alt={article.title}
        className="w-full h-48 sm:h-32 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="p-4">
        <h2 className="text-xl sm:text-lg font-semibold mb-2 line-clamp-2">{article.title}</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 text-sm line-clamp-3`}>{article.description}</p>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-2`}>
          Published: {new Date(article.publishedAt).toLocaleDateString()}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-500 hover:text-blue-600'} hover:underline text-sm`}
        >
          Read more
        </a>
      </div>
      <button
        onClick={() => onBookmarkToggle(article)}
        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          isBookmarked
            ? darkMode ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'
            : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isBookmarked
            ? darkMode ? 'focus:ring-yellow-500' : 'focus:ring-yellow-400'
            : darkMode ? 'focus:ring-gray-400' : 'focus:ring-gray-500'
        }`}
      >
        {isBookmarked ? (
          <>
            <span className="mr-1">★</span>
            Bookmarked
          </>
        ) : (
          <>
            <span className="mr-1">☆</span>
            Bookmark
          </>
        )}
      </button>
    </div>
  )
}

const Landing = () => {
  const [articles, setArticles] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const apiKey = '490d90581baf4796ad0a8746440da072';
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const [topic, setTopic] = useState('health');
  const observer = useRef()

  const lastArticleElementRef = useCallback(node => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore])

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      setError(null)
      const searchParams = new URLSearchParams(location.search);
      const newTopic = searchParams.get('topic') || 'health';
      setTopic(newTopic);
      if(newTopic === "bookmarks"){
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setArticles(savedBookmarks);
        setIsLoading(false);
        setHasMore(false);
      } else {
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: getSearchQuery(newTopic),
              apiKey: apiKey,
              page: page,
              pageSize: 20
            }
          })
          setArticles(prevArticles => [...prevArticles, ...response.data.articles])
          setHasMore(response.data.articles.length > 0)
        } catch (error) {
          console.error('Error fetching articles:', error)
          setError('Failed to fetch articles. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(savedBookmarks);
    fetchArticles()
  }, [location.search, page])

  const getSearchQuery = (topic) => {
    switch (topic) {
      case 'nutrition':
        return 'nutrition OR diet OR "healthy eating" OR "food science"';
      case 'chronic-diseases':
        return '"chronic diseases" OR diabetes OR "heart disease" OR cancer OR "respiratory diseases"';
      case 'mental-health':
        return '"mental health" OR psychology OR "emotional wellbeing" OR therapy OR "stress management"';
      case 'preventive-care':
        return '"preventive care" OR "health screening" OR vaccination OR "regular check-ups" OR "lifestyle changes"';
      default:
        return 'health OR healthcare OR wellness OR medicine OR "public health" OR "chronic diseases" OR "mental health"';
    }
  }

  const toggleBookmark = (article) => {
    let updatedBookmarks;
    if (bookmarks.some((bookmark) => bookmark.url === article.url)) {
      updatedBookmarks = bookmarks.filter((bookmark) => bookmark.url !== article.url);
    } else {
      updatedBookmarks = [...bookmarks, article];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    if (location.search.includes('topic=bookmarks')) {
      setArticles(updatedBookmarks);
    }
  };

  if (error) {
    return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-red-400' : 'bg-gray-100 text-red-600'}`}>{error}</div>
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
        {topic === 'bookmarks' 
          ? 'Bookmarked Articles' 
          : `${topic.charAt(0).toUpperCase() + topic.slice(1)} News`}
      </h1>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {articles.map((article, index) => {
            if (articles.length === index + 1) {
              return <div ref={lastArticleElementRef} key={index}>
                <Card
                  article={article}
                  isBookmarked={bookmarks.some((bookmark) => bookmark.url === article.url)}
                  onBookmarkToggle={toggleBookmark}
                />
              </div>
            } else {
              return <Card
                key={index}
                article={article}
                isBookmarked={bookmarks.some((bookmark) => bookmark.url === article.url)}
                onBookmarkToggle={toggleBookmark}
              />
            }
          })}
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center h-64 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg`}>
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-xl font-semibold">No Bookmarks Found</p>
        </div>
      )}
      {isLoading && 
        <div className="flex justify-center mt-4">
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      }
    </div>
  );
}

export default Landing