// "use client"

// import { useState } from "react"
// import { Bot, X, Send } from "lucide-react"
// import { motion } from "framer-motion"

// type Message = {
//   sender: "user" | "bot"
//   text: string
// }

// export default function ChatbotLauncher() {
//   const [open, setOpen] = useState(false)
//   const [input, setInput] = useState("")
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       sender: "bot",
//       text: "Hi there! 🌿 I’m EcoBot — here to guide you through carbon insights and smart sustainability tips. Let’s build a greener tomorrow, together 💚",
//     },
//   ])
//   const [loading, setLoading] = useState(false)

//   const handleToggle = () => {
//     const nextOpen = !open
//     setOpen(nextOpen)

//     if (nextOpen) {
//       setMessages([
//         {
//           sender: "bot",
//           text: "Hi there! 🌿 I’m EcoBot — here to guide you through carbon insights and smart sustainability tips. Let’s build a greener tomorrow, together 💚",
//         },
//       ])
//       setInput("")
//     }
//   }

//   const handleSend = async () => {
//     if (!input.trim()) return

//     const userMessage = input.trim()
//     setMessages((prev) => [...prev, { sender: "user", text: userMessage }])
//     setInput("")
//     setLoading(true)

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMessage }),
//       })

//       const data = await res.json()
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: data.reply || "❌ No reply from Gemini." },
//       ])
//     } catch (err) {
//       console.error("❌ Fetch error:", err)
//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "bot",
//           text: "Oops! Something went wrong. Please try again later.",
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") handleSend()
//   }

//   return (
//     <div className="fixed bottom-5 right-5 z-50">
//       {/* Floating Button */}
//       <motion.button
//         onClick={handleToggle}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         className="flex items-center justify-center rounded-full shadow-lg bg-green-600 text-white w-14 h-14 hover:bg-green-700 transition-colors"
//         aria-label="Open chatbot"
//       >
//         <Bot size={28} />
//       </motion.button>

//       {/* Chat Window */}
//       {open && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="absolute bottom-20 right-0 w-80 h-[500px] bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col overflow-hidden"
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 bg-green-600 text-white">
//             <div className="flex items-center space-x-2">
//               <Bot size={20} />
//               <h2 className="font-semibold text-sm">EcoBot</h2>
//             </div>
//             <button onClick={() => setOpen(false)}>
//               <X size={18} />
//             </button>
//           </div>

//           {/* Message List */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-green-50 text-sm text-gray-700">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`px-3 py-2 rounded-xl shadow max-w-[75%] whitespace-pre-wrap ${
//                   msg.sender === "user"
//                     ? "ml-auto bg-green-200"
//                     : "bg-white text-gray-800"
//                 }`}
//               >
//                 <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                   {msg.text.split("\n").map((line, index) => {
//                     if (line.startsWith("- ") || line.startsWith("* ")) {
//                       return (
//                         <li key={index} className="ml-4 list-disc">
//                           {line.slice(2)}
//                         </li>
//                       )
//                     } else if (line.startsWith("#")) {
//                       return (
//                         <h3
//                           key={index}
//                           className="text-green-800 font-semibold text-sm mt-2 mb-1"
//                         >
//                           {line.replace(/^#+\s*/, "")}
//                         </h3>
//                       )
//                     } else if (/\*\*(.*?)\*\*/.test(line)) {
//                       const parts = line.split(/\*\*(.*?)\*\*/g)
//                       return (
//                         <p key={index}>
//                           {parts.map((part, i) =>
//                             i % 2 === 1 ? (
//                               <strong key={i} className="text-green-700">
//                                 {part}
//                               </strong>
//                             ) : (
//                               part
//                             )
//                           )}
//                         </p>
//                       )
//                     } else {
//                       return <p key={index}>{line}</p>
//                     }
//                   })}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="text-xs text-gray-500">EcoBot is thinking...</div>
//             )}
//           </div>

//           {/* Input Box */}
//           <div className="flex items-center px-3 py-2 border-t bg-white">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Type your question..."
//               className="flex-1 border-none outline-none text-sm p-2 bg-green-50 rounded-md"
//             />
//             <button
//               onClick={handleSend}
//               className="ml-2 p-2 text-green-600 hover:text-green-700 transition disabled:opacity-40"
//               disabled={!input.trim() || loading}
//             >
//               <Send size={18} />
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }
