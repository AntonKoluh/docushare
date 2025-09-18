import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CircleQuestionMark } from "lucide-react";
import useGetData from "@/hooks/useGetData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import SpinnerDownload from "../ui/spinners/SpinnerDownload";

type incomingProps = {
  uid: string;
};

const AiHero = ({ uid }: incomingProps) => {
  const baseUrl = import.meta.env.VITE_DEBUG === "True" ? import.meta.env.VITE_BACKEND_URL_DEBUG : import.meta.env.VITE_BACKEND_URL;
  const [msg, setMsg] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [aiStatus, setAiStatus] = useState<"loading" | "on" | "off">("loading");
  const access_token = localStorage.getItem("access");
  const getData = useGetData();
  const getStream = async (isUsingCache = true) => {
    if (msg !== "") setMsg("");
    setIsGenerating(true);
    const response = await fetch(`${baseUrl}/api/ai/test/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify({ uid: uid, use_cache: isUsingCache }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      chunk.split("\n").forEach((line) => {
        if (line.trim()) {
          const obj = JSON.parse(line);
          if (obj.success === true) {
            setMsg((prev) => prev + obj.msg);
          } else {
            toast(obj.msg);
          }
          setIsGenerating(false);
        }
      });
    }
  };
  useEffect(() => {
    const healthCheck = async () => {
      const aiHealth = await getData("ai/health/");
      setAiStatus(aiHealth.data.success ? "on" : "off");
    };
    healthCheck();
    getStream();
  }, []);
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <span className="h-0.5 w-full bg-black"></span>
      <div className="flex flex-row gap-1 justify-left items-center w-full">
        <HoverCard>
          <HoverCardTrigger>
            <CircleQuestionMark className="w-5 h-5 hover:bg-gray-300 rounded-full" />
          </HoverCardTrigger>
          <HoverCardContent>
            <span className="text-sm">
              The AI is running on a local machine using Ollama3.2:1b so it
              might not always be avalible
            </span>
          </HoverCardContent>
        </HoverCard>
        <span>Ai server status: </span>
        <span
          className={`w-2 h-2 rounded-full 
        ${
          aiStatus === "loading"
            ? "bg-yellow-400"
            : aiStatus === "off"
            ? "bg-red-600"
            : "bg-green-600"
        }`}
        ></span>
      </div>
      <span className="h-0.5 w-full bg-black"></span>
      <h1 className="text-sm! my-2">{msg}</h1>
      <div className="flex flex-row w-full justify-center items-center gap-1">
        {isGenerating && (
          <HoverCard>
            <HoverCardTrigger>
              <CircleQuestionMark className="w-6 h-6 hover:bg-gray-300 rounded-full" />
            </HoverCardTrigger>
            <HoverCardContent>
              <span className="text-sm">
                This might take up to 5 minutes to generate a response, but dont worry! you dont have 
                to wait for it! you can close this window and it will be avalible here later once generated
              </span>
            </HoverCardContent>
          </HoverCard>
        )}
        <Button
          className="cursor-pointer"
          onClick={() => getStream(false)}
          disabled={isGenerating || aiStatus != "on"}
        >
          {isGenerating ? (<><SpinnerDownload className="bg-yellow-600! opacity-100!"/> <span>Generating...</span></>) : "Generate"}
        </Button>
      </div>
    </div>
  );
};

export default AiHero;
