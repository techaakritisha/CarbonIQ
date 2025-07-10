// import { NextResponse } from "next/server"

// export async function POST(req: Request) {
//   const { message } = await req.json()

//   const API_KEY = process.env.GEMINI_API_KEY
//   if (!API_KEY) {
//     console.error("❌ GEMINI_API_KEY is missing in .env.local")
//     return NextResponse.json(
//       { reply: "Server error: Missing API key." },
//       { status: 500 }
//     )
//   }

//   try {
//     const res = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: message }],
//             },
//           ],
//           generationConfig: {
//             temperature: 0.7,
//             topK: 40,
//             topP: 0.95,
//             maxOutputTokens: 256,
//           },
//         }),
//       }
//     )

//     const data = await res.json()
//     console.log("📦 Gemini (gemini-pro) response:", JSON.stringify(data, null, 2))

//     let reply = "❌ Gemini API didn’t return a valid reply."
//     const candidates = data?.candidates

//     if (
//       Array.isArray(candidates) &&
//       candidates[0]?.content?.parts?.length > 0 &&
//       typeof candidates[0].content.parts[0].text === "string"
//     ) {
//       reply = candidates[0].content.parts[0].text.trim()
//     }

//     return NextResponse.json({ reply })
//   } catch (err) {
//     console.error("❌ Gemini fetch error:", err)
//     return NextResponse.json(
//       { reply: "Something went wrong while contacting Gemini." },
//       { status: 500 }
//     )
//   }
// }
