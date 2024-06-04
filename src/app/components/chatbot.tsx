"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
    const inputValue = inputElement?.value.trim();
    if (inputValue) {
      setMessages((prevMessages) => [...prevMessages, { message: inputValue, sender: 'user' }]);
      e.currentTarget.reset();
      try {
        const response = await fetch('http://127.0.0.1:8000/carrier_guidance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputValue }),
        });
        if (response.ok) {
          const data = await response.json();
          const responseMessage = data.answer;
          setMessages((prevMessages) => [...prevMessages, { message: responseMessage, sender: 'bot' }]);
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    const pusher = new Pusher('78fd495b20c99a6f8106', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', (data: { message: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, sender: 'bot' },
      ]);
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="  fixed bottom-4 right-4">
      {isOpen ? (
        <div className=" border dark:bg-black  rounded-lg shadow-lg p-4 max-w-md">
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
                      ? 'bg-primary'
                      : 'bg-secondary'
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
                className="flex-grow mr-2 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
              />
              <Button
                type="submit"
                className=" text-white font-bold py-2 px-4 rounded" >
                Send
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          className=" text-white font-bold py-2 px-4 rounded"
          onClick={toggleChatbot}
        >
          <MessageCircle />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;