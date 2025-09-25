"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface UnregisterButtonProps {
  courseId: number;
  sectionId: number;
}

export default function UnregisterButton({ courseId, sectionId }: UnregisterButtonProps) {
  const [loading, setLoading] = useState(false);
  const unregisterCourseMutation = api.courses.unregisterCourse.useMutation();

  const handleUnregister = async () => {
    setLoading(true);
    try {
      await unregisterCourseMutation.mutateAsync({ courseId, sectionId });
      alert('Successfully unregistered from the course.');
      window.location.reload();  // Refresh the page to update the list of registered courses
    } catch (error) {
      console.error("Failed to unregister:", error);
      alert('Failed to unregister.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="px-3 py-2 bg-red-500 text-white rounded"
      onClick={handleUnregister}
      disabled={loading}
    >
      {loading ? "Unregistering..." : "Unregister"}
    </button>
  );
}
