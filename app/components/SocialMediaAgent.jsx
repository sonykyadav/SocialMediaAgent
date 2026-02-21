"use client";
import { useState } from "react";

export default function SocialMediaAgent() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSchedule = () => {
    if (!topic) return;
    setIsLoading(true);

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI Social Media Manager.",
          },
          {
            role: "user",
            content: `${topic}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "social_media_scheduler_output",
            schema: {
              type: "object",
              properties: {
                brand_summary: {
                  type: "string",
                  description: "Short summary of brand/niche strategy",
                },
                weekly_schedule: {
                  type: "string",
                  description: "7-day content posting breakdown",
                },
                content_types: {
                  type: "string",
                  description:
                    "Suggested content types (Reels, Carousel, Stories etc.)",
                },
                best_posting_times: {
                  type: "string",
                  description: "Best suggested posting times",
                },
                growth_strategy: {
                  type: "string",
                  description: "Audience growth and engagement strategy",
                },
              },
              required: [
                "brand_summary",
                "weekly_schedule",
                "content_types",
                "best_posting_times",
                "growth_strategy",
              ],
            },
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = JSON.parse(data.choices[0].message.content);
        setResult(parsed);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-pink-500 p-8 rounded-2xl w-full max-w-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-black">
          AI Social Media Agent
        </h1>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your social media agent..."
          className="w-full p-4 border rounded-xl mb-4 text-gray-800 font-bold"
        />

        <button
          onClick={generateSchedule}
          className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
        >
          Generate Social Media Plan
        </button>

        {isLoading && (
          <p className="text-center mt-4 text-black animate-pulse">
            Creating social media Plan...
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4 bg-white p-6 rounded-xl text-gray-700">
            <div>
              <h3 className="font-semibold text-pink-600">Brand Strategy</h3>
              <p className="font-bold text-lg">{result.brand_summary}</p>
            </div>

            <div>
              <h3 className="font-semibold text-red-600">Weekly Schedule</h3>
              <p>{result.weekly_schedule}</p>
            </div>

            <div>
              <h3 className="font-semibold text-green-600">Content Types</h3>
              <p>{result.content_types}</p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-600">
                Best Posting Times
              </h3>
              <p>{result.best_posting_times}</p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-600">Growth Strategy</h3>
              <p className="font-bold">{result.growth_strategy}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
