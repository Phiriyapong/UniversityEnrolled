"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

type News = {
  id?: number;
  title: string;
  content: string;
  publishedAt: Date;
};

const NewsInitial: News = {
  title: "",
  content: "",
  publishedAt: new Date(),
};

const NewsPage: React.FC = () => {
  const { data: newsList, refetch: refetchNewsList } = api.news.getAll.useQuery();
  const { mutate: createNews, reset } = api.news.add.useMutation({
    onSuccess: async () => {
      await refetchNewsList();
    },
  });
  const { mutate: editNews } = api.news.edit.useMutation({
    onSuccess: async () => {
      await refetchNewsList().then(() => {
        setEditingId(null);
      });
    },
    onError: () => {
      alert("Failed to update news");
      setEditingId(null);
    },
  });
  const { mutate: deleteNews } = api.news.delete.useMutation({});

  const [form, setForm] = useState<News>(NewsInitial);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // 4 items per row and 2 rows

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, publishedAt: new Date(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createNews(form);
    setForm(NewsInitial);
    reset();
  };

  const handleEditInputChange = (id: number, field: keyof News, value: string | Date) => {
    setEditingId(id);
    setForm((prevForm) => ({ ...prevForm, id, [field]: value }));
  };

  const handleSave = async () => {
    if (form.id !== undefined) {
      editNews({ id: form.id, ...form });
      setEditingId(null);
      setForm(NewsInitial);
    }
  };

  const handleDelete = async (id: number) => {
    deleteNews({ id });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedNews = newsList?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-8 h-1/2 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="title"
              name="title"
              type="text"
              value={form.title ?? ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="content">
              Content
            </label>
            <textarea
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="content"
              name="content"
              value={form.content ?? ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="publishedAt">
              Published At
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="publishedAt"
              name="publishedAt"
              type="date"
              value={form.publishedAt ? new Date(form.publishedAt).toISOString().split("T")[0] : ""}
              onChange={handleDateChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Add News
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {paginatedNews?.map((news) => (
          <div key={news.id} className="max-w-sm overflow-hidden rounded bg-white shadow-lg">
            <div className="px-6 py-4">
              {editingId === news.id ? (
                <>
                  <input
                    className="mb-2 w-full border-b text-xl font-bold text-black"
                    type="text"
                    value={form.title ?? news.title}
                    onChange={(e) => handleEditInputChange(news.id, "title", e.target.value)}
                  />
                  <textarea
                    className="w-full border-b text-base text-gray-700"
                    value={form.content ?? news.content}
                    onChange={(e) => handleEditInputChange(news.id, "content", e.target.value)}
                  />
                  <input
                    className="w-full border-b text-base text-gray-700"
                    type="date"
                    value={
                      (form.publishedAt ? new Date(form.publishedAt) : new Date(news.publishedAt))
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) => handleEditInputChange(news.id, "publishedAt", new Date(e.target.value))}
                  />
                  <div className="mt-2 flex justify-between">
                    <button className="rounded bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700" onClick={handleSave}>
                      Save
                    </button>
                    <button className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2 text-xl font-bold text-black">{news.title}</div>
                  <p className="text-base text-gray-700">{news.content}</p>
                  <div className="text-base text-gray-700">{new Date(news.publishedAt).toDateString()}</div>
                </>
              )}
            </div>
            <div className="px-6 pb-2 pt-4">
              {editingId !== news.id && (
                <>
                  <button
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 font-bold text-white hover:bg-yellow-700"
                    onClick={() => {
                      setEditingId(news.id);
                      setForm(news);
                    }}
                  >
                    Edit
                  </button>
                  <button className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700" onClick={() => handleDelete(news.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className={`mx-1 px-3 py-1 border rounded ${currentPage === 1 ? "bg-gray-200" : "bg-white"}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="mx-1 px-3 py-1 border rounded bg-white"
          disabled={currentPage * itemsPerPage >= (newsList?.length ?? 0)}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsPage;
