type Tag = { label: string; tone?: "mint" | "coral" };

export default function ListicleEntry({
  rank,
  name,
  price,
  damkerngSays,
  goodFor,
  watchOut,
  tags,
  affiliateUrl,
}: {
  rank: number;
  name: string;
  price: string;
  damkerngSays: string;
  goodFor: string;
  watchOut: string;
  tags: Tag[];
  affiliateUrl?: string;
}) {
  return (
    <article
      id={`item-${rank}`}
      className="border border-line rounded-lg bg-panel overflow-hidden"
    >
      <div className="grid sm:grid-cols-[200px_1fr] gap-0">
        <div className="aspect-square sm:aspect-auto bg-deep border-b sm:border-b-0 sm:border-r border-line flex items-center justify-center">
          <span className="text-[11px] font-mono text-slate">[ product_img ]</span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-lg font-sans font-semibold text-ink leading-snug">
              <span className="font-mono text-mint-dim mr-2">
                #{String(rank).padStart(2, "0")}
              </span>
              {name}
            </h2>
            <span className="font-mono text-[15px] font-bold text-ink whitespace-nowrap">
              {price}
            </span>
          </div>

          <div className="flex gap-1.5 flex-wrap mb-3">
            {tags.map((t) => (
              <span
                key={t.label}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  t.tone === "coral"
                    ? "border-coral/30 text-coral"
                    : "border-mint/30 text-mint-dim"
                }`}
              >
                {t.label}
              </span>
            ))}
          </div>

          <p className="text-[14px] text-ink leading-relaxed mb-3">
            {damkerngSays}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="text-[13px]">
              <span className="font-mono text-mint-dim">เหมาะกับ:</span>{" "}
              <span className="text-slate">{goodFor}</span>
            </div>
            <div className="text-[13px]">
              <span className="font-mono text-coral">ข้อควรรู้:</span>{" "}
              <span className="text-slate">{watchOut}</span>
            </div>
          </div>

          {affiliateUrl ? (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-block text-[12px] font-mono font-medium text-deep bg-mint hover:bg-mint-dim px-4 py-2 rounded transition-colors"
            >
              ดูราคา/ซื้อ →
            </a>
          ) : (
            <span className="inline-block text-[12px] font-mono font-medium text-slate bg-panel-raised border border-line px-4 py-2 rounded cursor-not-allowed">
              เร็วๆนี้
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
