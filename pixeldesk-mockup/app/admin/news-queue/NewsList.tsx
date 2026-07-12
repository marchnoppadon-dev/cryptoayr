"use client";
import { useState } from "react";
import PublishButton from "./PublishButton";
import BulkPublishBar from "./BulkPublishBar";

interface PendingNews {
  id: string;
  title: string;
  source_name: string | null;
  long_content_th: string | null;
  created_at: string;
}

export default function NewsList({ news: initialNews }: { news: PendingNews[] }) {
  const [news, setNews] = useState(initialNews);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleBulkDone(publishedIds: string[]) {
    setNews((prev) => prev.filter((n) => !publishedIds.includes(n.id)));
    setSelectedIds((prev) => prev.filter((id) => !publishedIds.includes(id)));
  }

  return (
    <>
      <BulkPublishBar selectedIds={selectedIds} onDone={handleBulkDone} />

      {news.length === 0 && (
        <p style={{ fontSize: 14, color: "#999" }}>ไม่มีข่าวรอตรวจสอบตอนนี้</p>
      )}

      {news.map((n) => (
        <div
          key={n.id}
          style={{
            border: "1px solid #e2e2e2",
            borderRadius: 10,
            padding: 16,
            marginBottom: 12,
            display: "flex",
            gap: 14,
          }}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(n.id)}
            onChange={() => toggleSelect(n.id)}
            style={{ width: 18, height: 18, marginTop: 4, flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>
              {n.title}
            </p>
            <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>
              แหล่งข่าว: {n.source_name ?? "-"} ·{" "}
              {n.long_content_th?.length ?? 0} ตัวอักษร
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#444",
                margin: "0 0 12px",
                lineHeight: 1.5,
                maxHeight: 60,
                overflow: "hidden",
              }}
            >
              {n.long_content_th?.slice(0, 160) ?? "(ไม่มีเนื้อหา)"}…
            </p>
            <PublishButton articleId={n.id} />
          </div>
        </div>
      ))}
    </>
  );
}