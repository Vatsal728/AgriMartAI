import Link from "next/link";
import { Search, Sparkles, Bookmark, Share2, MessageCircle } from "lucide-react";

const savedAnswers = [
  {
    question: "How should I adjust nitrogen levels for the upcoming corn harvest given the recent rainfall?",
    answer: "Based on the 3.2 inches of rainfall recorded over the last 48 hours, nitrogen leaching is likely. I recommend a supplemental application of 30-40 lbs/acre. Prioritize the lower-lying fields (Blocks 3 and 4).",
    date: "Oct 24, 2023 · 10:45 AM",
  },
  {
    question: "What are the organic alternatives for controlling spider mite infestations in the greenhouse?",
    answer: "For spider mite control in organic greenhouse production, consider using Phytoseiulus persimilis, a predatory mite. Alternatively, a 1% solution of potassium salts of fatty acids works well.",
    date: "Oct 22, 2023 · 02:15 PM",
  },
  {
    question: "Review of the latest soil pH analysis for the North Orchard (Plot 7).",
    answer: "The current pH levels are slightly acidic at 5.8. For optimal nutrient uptake in apple trees, we need to bring this closer to 6.5. Apply 2 tons of calcitic limestone per acre this fall.",
    date: "Oct 21, 2023 · 09:30 AM",
  },
  {
    question: "Comparison of water efficiency between drip irrigation and pivot systems for alfalfa.",
    answer: "Drip irrigation shows a 25% increase in water-use efficiency compared to center pivot systems for alfalfa in your climate zone. However, the initial capital expenditure is roughly 3x higher.",
    date: "Oct 19, 2023 · 11:20 AM",
  },
  {
    question: "Frost warning protocols for citrus groves in the Southeast block.",
    answer: "Temperatures are forecast to drop to 28°F for more than 4 hours tomorrow night. Activate wind machines at 32°F to mix warm air from the inversion layer.",
    date: "Oct 18, 2023 · 04:55 PM",
  },
  {
    question: "Optimal storage conditions for harvested wheat to prevent fungal growth.",
    answer: "Maintain grain moisture content below 12.5% for safe long-term storage. Bin temperatures should be kept below 60°F using aeration fans. Monitor for 'hot spots' weekly.",
    date: "Oct 15, 2023 · 01:10 PM",
  },
];

export default function SavedAnswersPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved answers..."
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <Link
          href="/scan-leaf"
          className="rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm"
        >
          New Analysis
        </Link>
      </div>

      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Saved answers</h1>
        <p className="pt-1 text-base text-text-muted">Reference and review your bookmarked agricultural insights.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedAnswers.map((item) => (
          <div key={item.question} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-3 font-heading text-base font-bold text-slate-900">{item.question}</h3>
                <Sparkles className="mt-1 size-3.5 shrink-0 text-brand" />
              </div>
              <p className="line-clamp-4 text-sm text-text-muted">{item.answer}</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs text-text-faint">{item.date}</p>
              <div className="flex gap-3 text-slate-400">
                <button type="button" aria-label="Bookmarked">
                  <Bookmark className="size-3.5 fill-brand text-brand" />
                </button>
                <button type="button" aria-label="Share">
                  <Share2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-surface-muted">
          <MessageCircle className="size-6 text-brand" />
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900">Need more answers?</h2>
        <p className="max-w-sm text-sm text-text-muted">
          Ask AgriSmart AI about soil health, pest control, or weather forecasts and save the best
          responses here.
        </p>
        <Link href="/chat-assistant" className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg">
          Start a new chat
        </Link>
      </div>
    </div>
  );
}
