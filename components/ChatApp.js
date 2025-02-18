import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Gun from "gun";

// Inisialisasi Gun.js untuk komunikasi real-time
const gun = Gun({ peers: ['https://gun-manhattan.herokuapp.com/gun'] });

export default function ChatApp() {
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState("");

    useEffect(() => {
        if (!account) return;
        const chatRoom = gun.get(`web3chat-${account}`);
        chatRoom.map().on((msg, id) => {
            if (msg && msg.text && (msg.recipient === account || msg.sender === account)) {
                setMessages(prev => {
                    const exists = prev.find(m => m.timestamp === msg.timestamp);
                    return exists ? prev : [...prev, msg].sort((a, b) => a.timestamp - b.timestamp);
                });
            }
        });
    }, [account]);

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
        } else {
            alert("MetaMask tidak terdeteksi");
        }
    };

    const sendMessage = () => {
        if (!message.trim() || !recipient.trim()) return;
        const newMessage = { sender: account, recipient, text: message, timestamp: Date.now() };
        gun.get(`web3chat-${recipient}`).set(newMessage);
        gun.get(`web3chat-${account}`).set(newMessage);
        setMessage("");
    };

    return (
        <div className="flex flex-col h-screen w-full bg-gray-900 text-white overflow-hidden">
            {account ? (
                <div className="flex flex-col h-full max-w-md mx-auto border rounded-lg bg-gray-800 shadow-lg">
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-t-lg">
                        <h1 className="text-xl font-bold">Web3 Chat</h1>
                        <span className="text-green-400 text-sm">{account}</span>
                    </div>
                    <div className="p-4">
                        <input 
                            type="text"
                            className="w-full p-2 rounded bg-gray-700 text-white mb-2 border border-gray-600"
                            placeholder="Masukkan alamat penerima"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender === account ? 'bg-blue-500 ml-auto' : 'bg-gray-600'}` }>
                                <span className="block font-bold text-xs text-gray-300">{msg.sender === account ? "Anda" : msg.sender}</span>
                                <span>{msg.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-600 flex bg-gray-700 rounded-b-lg">
                        <input 
                            type="text"
                            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="Tulis pesan..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700" onClick={sendMessage}>Kirim</button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <button className="p-3 bg-blue-500 rounded-lg text-white shadow-lg hover:bg-blue-700" onClick={connectWallet}>
                        Login dengan MetaMask
                    </button>
                </div>
            )}
        </div>
    );
}
