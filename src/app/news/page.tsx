"use client";
import React, { useState, useEffect } from 'react';
import { api } from '~/trpc/react';

type NewsItem = {
  id: number;
  title: string;
  content: string;
  publishedAt: Date;
};

const NewsPage: React.FC = () => {
  const { data: newsList, refetch: refetchNewsList } = api.news.getAll.useQuery();
  const [sortedNews, setSortedNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 4;

  useEffect(() => {
    if (newsList) {
      const sorted = newsList.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      setSortedNews(sorted);
    }
  }, [newsList]);

  const totalPages = sortedNews.length ? Math.ceil(sortedNews.length / newsPerPage) : 1;

  // Calculate the news items for the current page
  const startIndex = (currentPage - 1) * newsPerPage;
  const currentNews = sortedNews.slice(startIndex, startIndex + newsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center text-black p-4">
      {currentNews.map((newsItem) => (
        <div key={newsItem.id} className="w-full max-w-3xl rounded overflow-hidden shadow-lg m-4 bg-white transition-transform transform hover:scale-105">
          <div className="px-6 py-4">
            <div className="font-bold text-2xl mb-2 text-blue-700">{newsItem.title}</div>
            <p className="text-gray-700 text-base">
              {newsItem.content}
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2">
              {new Date(newsItem.publishedAt).toDateString()}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between w-full max-w-3xl mt-4">
        <button
          onClick={handlePreviousPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l transition-colors"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r transition-colors"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsPage;
