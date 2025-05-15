import {
  ArrowUpIcon,
  ChevronLeftIcon,
  PaperclipIcon,
  SmilePlusIcon,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { MediaGrid } from "../../components/ui/media-grid";
import { MediaPreview } from "../../components/ui/media-preview";

interface Media {
  url: string;
  type: 'image' | 'video';
  file: File;
}

interface Message {
  id: string;
  text?: string;
  time?: string;
  date?: string;
  reactions?: Reaction[];
  hasLink?: boolean;
  media?: { url: string; type: 'image' | 'video' }[];
  timestamp?: number;
}

interface Reaction {
  emoji: string;
  count?: number;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Different topic - this is a wonderful reminder that "overnight success stories" rarely (never?) exist. I had no idea Varley, one of my favorite brands, has been around for 10 years. Love seeing them grow ❤',
    date: "Jan 21 11:00PM",
  },
  {
    id: 2,
    text: "You know, it's funny how we often think success happens overnight. It's a great reminder that it usually takes years of hard work behind the scenes. I just found out that Varley, one of my go-to brands, has been hustling for a whole decade! It's so inspiring to watch their journey unfold ❤",
    reactions: [{ emoji: "🔥", count: 12 }],
  },
  {
    id: 3,
    text: "Isn't it fascinating how we often overlook the hurdles that creators face on their journey? It's a crucial reminder that true success is built on perseverance and hard work. I'm here to support you with tips and insights to navigate these challenges and thrive in your creative endeavors!",
    date: "Yesterday 11:00PM",
    reactions: [
      { emoji: "👍", count: 12 },
      { emoji: "😊", count: 12 },
      { emoji: "🔥", count: 12 },
    ],
  },
  {
    id: 4,
    text: "Creating something special takes time and effort. If you're looking for some great finds, check out my Amazon link: someproduct.amazon.com. You never know what inspiration you might discover!",
    date: "Today 11:00PM",
  },
  {
    id: 5,
    text: "Let's talk about the creative process! It's all about experimenting and finding your unique style. Speaking of style, check out this cool piece I found at Zara: http://rstyle.me/+CnhzlmtS5lhipvCxGecF_w",
  },
  {
    id: 6,
    text: "Shop this link from Zara http://rstyle.me/+CnhzlmtS5lhipvCxGecF_w",
    date: "Today 12:00AM",
    hasLink: true,
  },
];

export const PrototypeC = (): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      
      setSelectedMedia(prev => [...prev, { url, type, file }]);
    });
  };

  const handleRemoveMedia = (index: number) => {
    setSelectedMedia(prev => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].url);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && selectedMedia.length === 0) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage.trim() || undefined,
      date: new Date().toLocaleString(),
      media: selectedMedia.map(({ url, type }) => ({ url, type })),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setSelectedMedia([]);
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="flex-none h-[50px] w-full bg-white border-b border-[#e6e8f0]">
        <div className="flex w-full items-center gap-0 h-full">
          <div className="flex items-center pl-4 pr-[46px] py-0 relative flex-1 grow">
            <Button variant="ghost" className="p-0 h-auto">
              <ChevronLeftIcon className="w-[30px] h-[30px]" />
            </Button>

            <div className="flex items-center justify-center gap-2.5 relative flex-1 grow">
              <div className="inline-flex items-center gap-1 relative">
                <Avatar className="w-[30px] h-[30px] rounded-full">
                  <AvatarImage
                    src="/ellipse-1-5.png"
                    alt="User avatar"
                    className="w-6 h-6 object-cover rounded-full"
                  />
                  <AvatarFallback>MT</AvatarFallback>
                </Avatar>

                <div className="inline-flex flex-col items-start relative">
                  <div className="inline-flex items-start gap-1 relative">
                    <div className="inline-flex items-center gap-0.5 relative">
                      <span className="font-subtitle-subtitle-03 font-[number:var(--subtitle-subtitle-03-font-weight)] text-gray-950 text-[length:var(--subtitle-subtitle-03-font-size)] tracking-[var(--subtitle-subtitle-03-letter-spacing)] leading-[var(--subtitle-subtitle-03-line-height)] whitespace-nowrap [font-style:var(--subtitle-subtitle-03-font-style)]">
                        MakerTodd
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 flex flex-col w-full items-end gap-4 pt-2 pb-0 pr-4 overflow-y-scroll scrollbar-none">
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            {message.date && (
              <div className="relative self-stretch mt-[-1.00px] font-supporting-caption-02 font-[number:var(--supporting-caption-02-font-weight)] text-[#9b9fb0] text-[length:var(--supporting-caption-02-font-size)] text-center tracking-[var(--supporting-caption-02-letter-spacing)] leading-[var(--supporting-caption-02-line-height)] [font-style:var(--supporting-caption-02-font-style)]">
                {message.date}
              </div>
            )}

            <div className="flex flex-col w-[312px] items-start gap-2 relative">
              <div className="flex items-start gap-2 relative self-stretch w-full">
                <div className="flex flex-col items-end gap-2 relative flex-1 grow">
                  <Card className="inline-flex max-w-[280px] items-center justify-center gap-2.5 p-2 relative ml-[-6.00px] bg-[#f9f9fb] rounded-lg border border-solid border-[#e2e3e9] shadow-none">
                    {message.hasLink ? (
                      <div className="relative flex-1 mt-[-1.00px] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-transparent text-sm tracking-[0] leading-[14px]">
                        <span className="text-[#5e6278] leading-[22px]">
                          Shop this link from Zara{" "}
                        </span>
                        <span className="text-[#0b62c5] leading-[var(--body-body-02-line-height)] font-body-body-02 [font-style:var(--body-body-02-font-style)] font-[number:var(--body-body-02-font-weight)] tracking-[var(--body-body-02-letter-spacing)] text-[length:var(--body-body-02-font-size)]">
                          http://rstyle.me/+CnhzlmtS5lhipvCxGecF_w
                        </span>
                      </div>
                    ) : message.media ? (
                      <MediaGrid
                        media={message.media}
                        text={message.text}
                        className="w-full"
                      />
                    ) : (
                      <div className="relative flex-1 mt-[-1.00px] font-body-body-02 font-[number:var(--body-body-02-font-weight)] text-[#5e6278] text-[length:var(--body-body-02-font-size)] tracking-[var(--body-body-02-letter-spacing)] leading-[var(--body-body-02-line-height)] [font-style:var(--body-body-02-font-style)]">
                        {message.text}
                      </div>
                    )}
                  </Card>

                  {message.reactions && message.reactions.length > 0 && (
                    <div className="inline-flex items-start gap-2 relative">
                      {message.reactions.map((reaction, rIndex) => (
                        <Badge
                          key={rIndex}
                          variant="outline"
                          className="inline-flex items-center gap-0.5 px-2 py-0 relative self-stretch bg-[#f9f9fb] rounded-[80px] border border-solid border-[#e2e3e9]"
                        >
                          <span className="relative w-fit mt-[-1.00px] font-body-body-01 font-[number:var(--body-body-01-font-weight)] text-[#b60d9a] text-[length:var(--body-body-01-font-size)] tracking-[var(--body-body-01-letter-spacing)] leading-[var(--body-body-01-line-height)] whitespace-nowrap [font-style:var(--body-body-01-font-style)]">
                            {reaction.emoji}
                          </span>
                          {reaction.count && (
                            <span className="relative w-fit font-supporting-caption-02 font-[number:var(--supporting-caption-02-font-weight)] text-gray-950 text-[length:var(--supporting-caption-02-font-size)] tracking-[var(--supporting-caption-02-letter-spacing)] leading-[var(--supporting-caption-02-line-height)] whitespace-nowrap [font-style:var(--supporting-caption-02-font-style)]">
                              {reaction.count}
                            </span>
                          )}
                        </Badge>
                      ))}

                      <div className="inline-flex items-start gap-2 relative self-stretch">
                        <Button
                          variant="outline"
                          size="sm"
                          className="inline-flex items-center gap-0.5 px-2 py-0 relative self-stretch bg-[#f9f9fb] rounded-[80px] border border-solid border-[#e2e3e9] h-auto"
                        >
                          <SmilePlusIcon className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {!message.reactions && (
                    <div className="inline-flex items-start gap-2 relative">
                      <div className="inline-flex items-start gap-2 relative self-stretch">
                        <Button
                          variant="outline"
                          size="sm"
                          className="inline-flex items-center gap-0.5 px-2 py-0 relative self-stretch bg-[#f9f9fb] rounded-[80px] border border-solid border-[#e2e3e9] h-auto"
                        >
                          <SmilePlusIcon className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Avatar className="w-[30px] h-[30px] rounded-full">
                  <AvatarImage
                    src="/ellipse-1-5.png"
                    alt="User avatar"
                    className="w-6 h-6 top-[3px] left-[3px] object-cover absolute rounded-full"
                  />
                  <AvatarFallback>MT</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Preview */}
      {selectedMedia.length > 0 && (
        <div className="flex-none border-t border-[#e2e3e9]">
          <MediaPreview media={selectedMedia} onRemove={handleRemoveMedia} />
        </div>
      )}

      {/* Message Input */}
      <div className="flex-none h-[72px] flex w-full items-center justify-around gap-2 p-4 bg-white border-t border-[#e2e3e9]">
        <div className="flex w-full items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="flex w-8 h-8 items-center justify-center relative rounded-[100px] p-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex items-center justify-center px-3 py-0.5 relative flex-1 self-stretch grow bg-[#eeeff2] rounded-[100px]">
              <PaperclipIcon className="w-5 h-5 ml-[-6.00px] mr-[-6.00px]" />
            </div>
          </Button>

          <Input
            placeholder="Create a chat message"
            className="flex h-10 items-center gap-2 px-4 py-2 flex-1 bg-[#f9f9fb] rounded-[100px] border border-solid border-[#e2e3e9]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <Button
            variant="ghost"
            size="icon"
            className="flex w-8 h-8 items-center justify-center relative rounded-[100px] p-0"
            onClick={handleSendMessage}
          >
            <div className="flex items-center justify-center px-3 py-0.5 relative flex-1 self-stretch grow bg-[#c3c3c6] rounded-[100px]">
              <ArrowUpIcon className="w-5 h-5 ml-[-6.00px] mr-[-6.00px]" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};