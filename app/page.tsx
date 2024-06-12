"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import logo from "@/public/hr-gpt.png";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // This effect runs every time messages changes
    console.log("Updated state in useEffect:", messages);
    
    setInputText("");
    scrollToBottom();
  }, [messages]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prevMessages) => [...prevMessages, inputText]);
    console.log("handle", messages);

    const reply = await generateResponse(inputText);
    setMessages((prevMessages) => [...prevMessages, reply]);
    console.log("reply", messages);
  };

  async function generateResponse(text: string) {
    console.log("text", text);
    try {
      console.log("try");
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          text: text,
        }),
      });
      console.log("return reeesults");
      console.log(res);

      const result = await res.json();
      console.log("SetMessage");
      // if (result.error) {
      //   setMessages([...messages, `bError: ${result.error}`]);
      // } else {
      //   // Assuming result.text contains the response message
      //   setMessages([...messages, result.text]);
      // }
      console.log("return rsults");
      return result;
    } catch (error: any) {
      console.log("catch");
      console.error(error);
    }
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="flex flex-row gap-2 m-2">
        <Image src={logo} alt="hr-gpt logo" className="h-16 w-16" />
        <h1 className="scroll-m-20 m-2 mt-4 text-3xl font-extrabold tracking-tight lg:text-3xl">
          HR-GPT
        </h1>
      </div>
      <div className="my-4 mx-96">
        <div className="h-[60vh] overflow-auto">
          {messages.map((message, index) => (
            <div className="">
              <div key={index}>
                {message}
                <Separator className="my-4" />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-2 justify-between border-b backdrop-blur-3xl shadow-2xl rounded-full p-2 w-full">
            <input
              className="w-full ml-4 pl-1 resize-none overflow-auto"
              type="text"
              placeholder="Ask something about our company"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button
              disabled={!inputText.trim()}
              className="p-3 hover:bg-yellow-200 bg-yellow-400 rounded-full "
            >
              <ChevronRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
