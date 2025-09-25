// // "use client";

// import React, { useState } from 'react';
// import { editNews, deleteNews } from '~/app/_components/services/newsService';

// type News = {
//   id: number;
//   title: string;
//   content: string;
//   publishedAt: Date;
// };

// type NewsListProps = {
//   initialNews: News[];
// };

// const NewsList: React.FC<NewsListProps> = ({ initialNews }) => {
//   const [newsList, setNewsList] = useState<News[]>(initialNews);
//   const [editingId, setEditingId] = useState<number | null>(null);

//   const handleEditInputChange = (id: number, field: keyof News, value: string | Date) => {
//     setNewsList(newsList.map(news => (news.id === id ? { ...news, [field]: value } : news)));
//   };

//   const handleSave = async (id: number) => {
//     const newsToUpdate = newsList.find(news => news.id === id);
//     if (newsToUpdate) {
//       try {
//         const updatedNews = await editNews(newsToUpdate);
//         setNewsList(newsList.map(news => (news.id === id ? updatedNews : news)));
//         setEditingId(null);
//       } catch (error) {
//         console.error('Error editing news:', error);
//       }
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteNews(id);
//       setNewsList(newsList.filter(news => news.id !== id));
//     } catch (error) {
//       console.error('Error deleting news:', error);
//     }
//   };

//   return (
//     <div className="flex flex-wrap justify-center">
//       {newsList.map((news) => (
//         <div key={news.id} className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
//           <div className="px-6 py-4">
//             {editingId === news.id ? (
//               <>
//                 <input
//                   className="font-bold text-xl mb-2 text-black w-full border-b"
//                   type="text"
//                   value={news.title}
//                   onChange={(e) => handleEditInputChange(news.id, 'title', e.target.value)}
//                 />
//                 <textarea
//                   className="text-gray-700 text-base w-full border-b"
//                   value={news.content}
//                   onChange={(e) => handleEditInputChange(news.id, 'content', e.target.value)}
//                 />
//                 <input
//                   className="text-gray-700 text-base w-full border-b"
//                   type="date"
//                   value={new Date(news.publishedAt).toISOString().split('T')[0]}
//                   onChange={(e) => handleEditInputChange(news.id, 'publishedAt', new Date(e.target.value))}
//                 />
//                 <div className="flex justify-between mt-2">
//                   <button
//                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
//                     onClick={() => handleSave(news.id)}
//                   >
//                     Save
//                   </button>
//                   <button
//                     className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//                     onClick={() => setEditingId(null)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="font-bold text-xl mb-2 text-black">{news.title}</div>
//                 <p className="text-gray-700 text-base">{news.content}</p>
//                 <div className="text-gray-700 text-base">{new Date(news.publishedAt).toDateString()}</div>
//               </>
//             )}
//           </div>
//           <div className="px-6 pt-4 pb-2">
//             {editingId !== news.id && (
//               <>
//                 <button
//                   className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
//                   onClick={() => setEditingId(news.id)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//                   onClick={() => handleDelete(news.id)}
//                 >
//                   Delete
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default NewsList;
