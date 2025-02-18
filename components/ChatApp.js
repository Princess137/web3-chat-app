import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Gun from "gun";

// Inisialisasi Gun.js untuk komunikasi real-time
const gun = Gun(["https://gun-manhattan.herokuapp.com/gun"]);

export default function ChatApp() {
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = () => {
            gun.get("web3chat").map().on((msg, id) => {
                setMessages(prev => [...prev, msg]);
            });
        };
        fetchMessages();
    }, []);

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
        if (message.trim() === "") return;
        const newMessage = { sender: account, text: message, timestamp: Date.now() };
        gun.get("web3chat").set(newMessage);
        setMessage("");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-4">Web3 Chat</h1>
            {account ? (
                <div className="w-full max-w-md border p-4 rounded-lg bg-gray-800">
                    <div className="h-64 overflow-y-auto border-b pb-2">
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-2">
                                <span className="font-bold text-green-400">{msg.sender}:</span>
                                <span className="ml-2">{msg.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex">
                        <input 
                            type="text"
                            className="flex-1 p-2 border rounded bg-gray-700 text-white"
                            placeholder="Tulis pesan..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="ml-2 p-2 bg-blue-600 rounded" onClick={sendMessage}>Kirim</button>
                    </div>
                </div>
            ) : (
                <button className="p-3 bg-blue-500 rounded-lg text-white" onClick={connectWallet}>
                    Login dengan MetaMask
                </button>
            )}
        </div>
    );
}
