import type { Metadata } from "next";
import TerminalFrame from "../components/TerminalFrame";
import ListicleEntry from "../components/ListicleEntry";
import SummaryTable from "../components/SummaryTable";
import FAQAccordion from "../components/FAQAccordion";

export const metadata: Metadata = {
  title: "9 Gadget แต่งโต๊ะคอมงบจำกัด ที่ดำเกิงลองมาแล้ว (อัปเดต 2026)",
  description:
    "รวม 9 gadget แต่งโต๊ะคอมที่ดำเกิงทดลองเอง คัดมาเฉพาะของที่คุ้มค่าจริง งบเริ่มต้นไม่เกิน 450 บาท พร้อมจุดเด่นและข้อควรรู้ก่อนซื้อ",
  alternates: {
    canonical: "/gadget-desk-setup",
  },
  openGraph: {
    type: "article",
    locale: "th_TH",
    title: "9 Gadget แต่งโต๊ะคอมงบจำกัด ที่ดำเกิงลองมาแล้ว",
    description:
      "รวม 9 gadget แต่งโต๊ะคอมที่ดำเกิงทดลองเอง คัดมาเฉพาะของที่คุ้มค่าจริง งบเริ่มต้นไม่เกิน 450 บาท",
    url: "/gadget-desk-setup",
  },
};

const items = [
  {
    rank: 1,
    name: "คลิปจัดสาย USB-C แม่เหล็ก แพ็ค 6 ชิ้น",
    price: "฿129",
    damkerngSays:
      "อันนี้ดำเกิงซื้อมาแก้ปัญหาสายพันกันใต้โต๊ะโดยเฉพาะ แปะแม่เหล็กไว้ตรงไหนก็ได้ สายลอดผ่านแล้วไม่ลื่นหลุด ของเล็กแต่เปลี่ยนหน้าตาโต๊ะได้เยอะสุดในราคานี้",
    goodFor: "คนที่มีสายชาร์จ/สาย USB เกะกะหลายเส้น",
    watchOut: "แม่เหล็กยึดติดพื้นผิวโลหะได้ดีกว่าพื้นผิวไม้/พลาสติกบางรุ่น",
    tags: [{ label: "งบ <150", tone: "mint" as const }],
  },
  {
    rank: 2,
    name: "ที่ชาร์จไร้สาย Wireless Charger รองรับ Qi",
    price: "฿259",
    damkerngSays:
      "วางมือถือแปะแล้วชาร์จเลย ไม่ต้องงมหาสายตอนมือถือใกล้หมดแบต ดำเกิงทดสอบความเร็วชาร์จแล้วไม่ต่างจากสายแบบ wired มากนัก",
    goodFor: "คนใช้มือถือรองรับ Qi (iPhone, Samsung รุ่นใหม่)",
    watchOut: "ความเร็วชาร์จขึ้นกับวัตต์ที่รองรับ เช็คสเปคก่อนซื้อถ้าอยากชาร์จเร็ว",
    tags: [{ label: "งบ <300", tone: "mint" as const }],
  },
  {
    rank: 3,
    name: "แท่นวางมือถือ/แท็บเล็ต ปรับองศาได้ 360°",
    price: "฿149",
    damkerngSays:
      "ใช้ดูคลิปหรือประชุมผ่านมือถือ/แท็บเล็ตโดยไม่ต้องถือ ปรับมุมได้ตามต้องการ วางได้มั่นคงกว่าที่คิด",
    goodFor: "คนดูวิดีโอคอล/ดูคลิปบนโต๊ะบ่อย",
    watchOut: "บางรุ่นรองรับน้ำหนักแท็บเล็ตจอใหญ่ได้ไม่เต็มที่ เช็คขนาดสูงสุดก่อน",
    tags: [{ label: "งบ <150", tone: "mint" as const }],
  },
  {
    rank: 4,
    name: "USB Hub ตัวเล็กหลายพอร์ต",
    price: "฿199",
    damkerngSays:
      "โน้ตบุ๊กรุ่นใหม่พอร์ตน้อยลงเรื่อยๆ ตัวนี้ช่วยต่อเมาส์ คีย์บอร์ด แฟลชไดรฟ์ได้พร้อมกันโดยไม่ต้องสลับถอด-เสียบบ่อยๆ",
    goodFor: "คนใช้โน้ตบุ๊กบางที่มีพอร์ตจำกัด",
    watchOut: "เช็คมาตรฐาน USB-A/USB-C ให้ตรงกับพอร์ตเครื่องตัวเองก่อนสั่ง",
    tags: [{ label: "งบ <250", tone: "mint" as const }],
  },
  {
    rank: 5,
    name: "พัดลมมือถือพกพา ลมแรง 5 ระดับ ชาร์จ USB แบต 12 ชม.",
    price: "฿99",
    damkerngSays:
      "ตัวช่วยตอนแอร์ไม่เย็นพอหรือทำงานกลางวันร้อนๆ ปรับได้ 5 ระดับลม แบตอึดใช้ได้นานทั้งวัน พกไปวางโต๊ะทำงานหรือถือเดินก็ได้ในตัวเดียว",
    goodFor: "คนทำงานในห้องที่อากาศไม่เย็นสม่ำเสมอ หรืออยากได้พัดลมพกพาเผื่อใช้นอกบ้านด้วย",
    watchOut: "ความแรงลมระดับสูงสุดอาจมีเสียงดังขึ้นบ้าง ถ้าใช้ตอนประชุมออนไลน์แนะนำเปิดระดับกลางๆ",
    tags: [{ label: "งบ <100", tone: "mint" as const }],
    affiliateUrl: "https://s.shopee.co.th/1Ldht3h2lX",
  },
  {
    rank: 6,
    name: "ขาตั้งจอ Monitor Stand ปรับระดับ",
    price: "฿259",
    damkerngSays:
      "ยกจอให้สูงขึ้นมาระดับสายตา ลดอาการก้มคอทำงานนานๆ ดำเกิงใช้มาสองสามเดือนแล้วรู้สึกว่าคอ-บ่าล้าน้อยลงจริง",
    goodFor: "คนนั่งทำงานหน้าจอต่อเนื่องนานๆ",
    watchOut: "เช็คขนาด/น้ำหนักจอตัวเองให้ตรงกับสเปครับน้ำหนักของขาตั้ง",
    tags: [{ label: "งบ <300", tone: "mint" as const }],
  },
  {
    rank: 7,
    name: "รางเก็บสายไฟใต้โต๊ะ",
    price: "฿99",
    damkerngSays:
      "ติดใต้โต๊ะแล้วร้อยสายผ่าน จบปัญหาสายไฟห้อยรกตา ราคาถูกที่สุดในลิสต์นี้แต่เปลี่ยนความเรียบร้อยของโต๊ะได้ชัดเจน",
    goodFor: "คนมีสายไฟหลายเส้น (จอ, ลำโพง, ที่ชาร์จ) ห้อยเกะกะ",
    watchOut: "ควรวัดความยาวใต้โต๊ะก่อนสั่ง บางรุ่นมาเป็นชุดสั้นต้องต่อหลายอัน",
    tags: [{ label: "งบ <100", tone: "mint" as const }],
  },
  {
    rank: 8,
    name: "Power Bank พกพา รองรับ MagSafe",
    price: "฿390",
    damkerngSays:
      "เอาไว้สำรองตอนทำงานนอกบ้านหรือไฟดับกะทันหัน แปะ MagSafe ติดหลังมือถือได้เลยไม่ต้องพกสายเพิ่ม",
    goodFor: "คนทำงาน WFA (Work from Anywhere) บ่อยๆ",
    watchOut: "ความจุยิ่งสูงยิ่งหนัก ถ้าจะพกประจำเลือกความจุที่พอดีตัว ไม่ต้องเน้นจุใหญ่สุด",
    tags: [{ label: "งบ <450", tone: "coral" as const }],
  },
  {
    rank: 9,
    name: "ที่วางหูฟังแบบแคลมป์ติดโต๊ะ",
    price: "฿179",
    damkerngSays:
      "ของเล็กๆ ที่หลายคนมองข้าม แต่ทำให้โต๊ะดูเป็นระเบียบขึ้นทันที หูฟังไม่ต้องวางทิ้งบนโต๊ะหรือพาดเก้าอี้",
    goodFor: "คนมีหูฟัง headset ตั้งโต๊ะ ไม่อยากให้วางเกลื่อน",
    watchOut: "เช็คความหนาขอบโต๊ะให้พอดีกับแคลมป์ก่อนสั่ง บางรุ่นไม่รองรับโต๊ะหนาเกิน",
    tags: [{ label: "งบ <200", tone: "mint" as const }],
  },
];

const summaryRows = items.map((item) => ({
  rank: item.rank,
  name: item.name,
  price: item.price,
  bestFor: item.goodFor,
}));

const faqs = [
  {
    question: "Gadget แต่งโต๊ะคอมงบน้อย เริ่มจากอะไรก่อนดี?",
    answer:
      "ดำเกิงแนะนำให้เริ่มจากของที่แก้ปัญหาจริงก่อน เช่น คลิปจัดสายหรือรางเก็บสายไฟ เพราะราคาถูกสุดแต่เปลี่ยนความเรียบร้อยของโต๊ะได้ชัดที่สุด ค่อยขยับไปของที่เพิ่มความสะดวก เช่น ที่ชาร์จไร้สายหรือขาตั้งจอทีหลัง",
  },
  {
    question: "ของแต่งโต๊ะคอมงบรวมไม่เกิน 1000 บาท ซื้ออะไรดี?",
    answer:
      "จากลิสต์นี้ เลือกคลิปจัดสาย (129) + แท่นวางมือถือ (149) + รางเก็บสายไฟ (99) + ที่ชาร์จไร้สาย (259) รวมแล้วยังไม่เกิน 700 บาท เหลืองบไว้เผื่อของอื่นที่อยากได้เพิ่ม",
  },
  {
    question: "Gadget แต่งโต๊ะคอมกับของแต่งโต๊ะเกมมิ่งต่างกันยังไง?",
    answer:
      "Gadget แต่งโต๊ะคอมเน้นฟังก์ชันการใช้งานจริงเป็นหลัก เช่น จัดสาย ชาร์จไฟ ปรับระดับจอ ส่วนของแต่งโต๊ะเกมมิ่งจะเน้นความสวยงาม/บรรยากาศมากกว่า เช่น ไฟ RGB หรือของตกแต่งธีมเกม ดำเกิงแยกสองหมวดนี้ไว้เพื่อให้เลือกตามที่ต้องการจริงๆ",
  },
];

export default function GadgetDeskSetupPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "9 Gadget แต่งโต๊ะคอมงบจำกัด ที่ดำเกิงลองมาแล้ว",
    inLanguage: "th-TH",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.rank,
      item: {
        "@type": "Product",
        name: item.name,
        offers: {
          "@type": "Offer",
          price: item.price.replace("฿", ""),
          priceCurrency: "THB",
        },
      },
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "th-TH",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="border-b border-line bg-deep/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-mono font-bold text-mint text-lg">{"<"}</span>
            <span className="font-mono font-bold text-ink">PixelDesk</span>
            <span className="font-mono text-mint text-lg">{"/>"}</span>
          </a>
          <a
            href="/#categories"
            className="font-mono text-[13px] text-slate hover:text-mint transition-colors"
          >
            ← กลับหมวดหมู่
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
          <nav className="font-mono text-[12px] text-slate mb-6">
            <a href="/" className="hover:text-mint transition-colors">
              หน้าแรก
            </a>
            {" / "}
            <a href="/#categories" className="hover:text-mint transition-colors">
              Gadget แต่งโต๊ะคอม
            </a>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink leading-snug mb-4">
            9 Gadget แต่งโต๊ะคอมงบจำกัด ที่ดำเกิงลองมาแล้ว
          </h1>

          <p className="text-[15px] text-slate leading-relaxed mb-8">
            ดำเกิงคัดมาเฉพาะของที่ใช้จริงแล้วคุ้มราคา ไม่ใช่ของมันต้องมีที่ซื้อมาแล้ววางทิ้ง
            งบเริ่มต้นแค่ 99 บาทไปจนถึง 450 บาท เลือกตามปัญหาที่โต๊ะคุณมีตอนนี้ได้เลย
            ทุกชิ้นในลิสต์นี้ดำเกิงใช้เองหรือเทียบสเปคจริงก่อนแนะนำทั้งหมด
          </p>

          <div className="mb-10">
            <SummaryTable rows={summaryRows} />
          </div>

          <div className="space-y-5 mb-12">
            {items.map((item) => (
              <ListicleEntry key={item.rank} {...item} />
            ))}
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-sans font-semibold text-ink mb-4">
              คำถามที่พบบ่อย
            </h2>
            <FAQAccordion items={faqs} />
          </section>

          <TerminalFrame path="~/damkerng/note.txt">
            <p className="text-[14px] text-ink leading-relaxed mb-2">
              ลิสต์นี้อัปเดตเรื่อยๆ ตามของที่ดำเกิงทดลองใหม่
              ถ้ามี gadget ตัวไหนอยากให้รีวิว ทักมาได้ที่หน้าติดต่อเรา
            </p>
            <p className="font-mono text-[13px] text-mint mt-3">— ดำเกิง</p>
          </TerminalFrame>

          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href="/#room-lights"
              className="text-[12px] font-mono px-3 py-1.5 rounded border border-mint/30 text-mint-dim hover:border-mint/60 transition-colors"
            >
              → ดูหมวดไฟแต่งห้อง
            </a>
            <a
              href="/#pillar-guide"
              className="text-[12px] font-mono px-3 py-1.5 rounded border border-mint/30 text-mint-dim hover:border-mint/60 transition-colors"
            >
              → รวมอุปกรณ์แต่งโต๊ะคอมทั้งหมด
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[12px] text-slate">
          <span>© 2026 PixelDesk · เขียนโดยดำเกิง</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-mint transition-colors">
              Affiliate Disclosure
            </a>
            <a href="#" className="hover:text-mint transition-colors">
              ติดต่อเรา
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
