"use client";

import { useState } from "react";

type Props = {
  videoId: string;
  title: string;
  description?: string | null;
  backdropPath?: string | null;
  colors: { surf: string; accent: string; text: string; muted: string };
};

export default function TrailerSection({ videoId, title, description, backdropPath, colors }: Props) {
  const [playing, setPlaying] = useState(false);

  const thumbnail = backdropPath
    ? "https://image.tmdb.org/t/p/w1280" + backdropPath
    : "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg";

  return (
    <div style={{ padding: "0 1.5rem 2rem" }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "42%",
          height: 0,
          borderRadius: 10,
          overflow: "hidden",
          background: colors.surf,
        }}
      >
        {playing ? (
          <iframe
            src={"https://www.youtube.com/embed/" + videoId + "?autoplay=1"}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              backgroundImage:
                "linear-gradient(to top, rgba(19,9,15,0.95) 0%, rgba(19,9,15,0.2) 55%, rgba(19,9,15,0.1) 100%), url(" +
                thumbnail +
                ")",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 22,
              }}
            >
              ▶
            </span>
            <span
              style={{
                position: "absolute",
                bottom: 18,
                left: 20,
                right: 20,
                textAlign: "left",
              }}
            >
              <span style={{ display: "block", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                {title}
              </span>
              {description && (
                <span style={{ display: "block", fontSize: 12, color: colors.muted, maxWidth: 480 }}>
                  {description}
                </span>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}