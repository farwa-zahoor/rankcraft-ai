import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, keyword, country } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert SEO content writer. Generate SEO optimized articles with meta title, meta description, headings, FAQs, internal linking ideas and schema recommendations.",
            },
            {
              role: "user",
              content: `
Create a complete SEO article.

Title: ${title}
Keyword: ${keyword}
Country: ${country}

Include:
- Search intent
- Meta title
- Meta description
- H1
- Blog outline
- Full article sections
- FAQs
- Internal linking ideas
- Schema recommendation
              `,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      article: data.choices[0].message.content,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to generate article" },
      { status: 500 }
    );
  }
}