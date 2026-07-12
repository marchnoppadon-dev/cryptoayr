"use client";
import { useState } from "react";

export default function BulkPublishBar({
  selectedIds,
  onDone,
}: {
  selectedIds: string[];
  onDone: (publishedIds: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  if (selectedIds.length === 0) return null;

  async function handleBulkPublish() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles/bulk-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        onDone(selectedIds);
      } else {
        alert("Publish ที่เลือกไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        background: "#111",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 8,
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <span style={{ fontSize: 14 }}>เลือกไว้ {selectedIds.length} ข่าว</span>
      <button
        onClick={handleBulkPublish}
        disabled={loading}
        style={{
          fontSize: 13,
          fontWeight: 500,
          padding: "8px 16px",
          borderRadius: 6,
          border: "none",
          background: "#e6283f",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "กำลัง publish..." : "Publish ที่เลือก"}
      </button>
    </div>
  );
}