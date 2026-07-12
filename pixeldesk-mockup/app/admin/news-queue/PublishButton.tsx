"use client";
import { useState } from "react";

export default function PublishButton({
  articleId,
}: {
  articleId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handlePublish() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles/" + articleId + "/publish", {
        method: "POST",
      });
      if (res.ok) setDone(true);
      else alert("publish ไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return <span style={{ fontSize: 13, color: "#1d9e75" }}>publish แล้ว</span>;
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      style={{
        fontSize: 13,
        fontWeight: 500,
        padding: "8px 16px",
        borderRadius: 6,
        border: "none",
        background: "#111",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      {loading ? "กำลัง publish..." : "Publish"}
    </button>
  );
}