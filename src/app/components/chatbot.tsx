"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  message: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
    const inputValue = inputElement?.value.trim();
    if (inputValue) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: inputValue, sender: 'user' },
        { message: inputValue, sender: 'bot' },
      ]);
      e.currentTarget.reset();
    }
  };

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className=" bg-white fixed bottom-4 right-4">
      {isOpen ? (
        <div className=" border border-gray-100 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Veye Help</h2>
            <Button
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleChatbot}
            >
              <X/>
            </Button>
          </div>
          <div
            className="max-h-64  overflow-y-auto mb-4"
            ref={messagesContainerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-2 rounded-md ${
                    message.sender === 'user'
                      ? 'bg-[#61AFAB] text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {message.message}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <Input
                type="text"
                name="message"
                placeholder="Type your message..."
                className="flex-grow mr-2 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-[#61AFAB] text-white font-bold py-2 px-4 rounded"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          className="bg-[#61AFAB] text-white font-bold py-2 px-4 rounded"
          onClick={toggleChatbot}
        >
          <MessageCircle />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;