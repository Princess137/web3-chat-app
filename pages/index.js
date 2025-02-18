import ChatApp from "../components/ChatApp";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4 bg-gray-700">
        <h1 className="text-xl font-bold">Web3 Chat</h1>
      </div>
      <ChatApp />
    </div>
  );
}
