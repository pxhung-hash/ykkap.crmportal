import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Search, Send, Paperclip, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Messages() {
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Account Manager",
      lastMessage: "Your order #ORD-2024-1245 has been shipped",
      time: "2 hours ago",
      unread: 2,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Technical Support",
      lastMessage: "I've sent the installation guide you requested",
      time: "5 hours ago",
      unread: 0,
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Sales Representative",
      lastMessage: "Let me know if you need any product samples",
      time: "1 day ago",
      unread: 1,
      avatar: "ER"
    },
    {
      id: 4,
      name: "David Park",
      role: "Logistics Coordinator",
      lastMessage: "Delivery scheduled for January 3rd",
      time: "2 days ago",
      unread: 0,
      avatar: "DP"
    },
  ];

  const currentConversation = [
    {
      id: 1,
      sender: "Sarah Johnson",
      message: "Hi John! I wanted to let you know that your order #ORD-2024-1245 has been processed and shipped.",
      time: "10:30 AM",
      isYou: false
    },
    {
      id: 2,
      sender: "You",
      message: "Great! Thanks for the update. Do you have the tracking information?",
      time: "10:35 AM",
      isYou: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      message: "Yes! Your tracking number is 1Z999AA10123456784. You can track it on our portal or the carrier's website. Expected delivery is January 2nd.",
      time: "10:37 AM",
      isYou: false
    },
    {
      id: 4,
      sender: "You",
      message: "Perfect! Also, I was wondering about the new thermal break frames. Do you have pricing for bulk orders?",
      time: "10:40 AM",
      isYou: true
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      message: "Absolutely! For orders over 50 units, we offer a 15% discount. I can send you a detailed quote. How many units are you interested in?",
      time: "10:42 AM",
      isYou: false
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Messages</h2>
        <p className="text-gray-500">Communicate with your YKK AP team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        <Card className="lg:col-span-1 overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-transparent hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {conv.name}
                        </h4>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conv.role}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    SJ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Account Manager</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Star className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {currentConversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isYou ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      msg.isYou
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm mb-1">{msg.message}</p>
                    <p
                      className={`text-xs ${
                        msg.isYou ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Textarea
                placeholder="Type your message..."
                className="flex-1 min-h-[60px] resize-none"
              />
              <Button size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
