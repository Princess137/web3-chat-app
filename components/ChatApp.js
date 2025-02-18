import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Gun from "gun";
import ContactList from "./components/ContactList";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

const gun = Gun({ peers: ['https://gun-manhattan.herokuapp.com/gun'] });

export default function ChatApp() {
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [contactName, setContactName] = useState("");

    useEffect(() => {
        if (!account) return;
        const contactsKey = `contacts-${account}`;
        gun.get(contactsKey).map().on((contact) => {
            if (contact && !contacts.some(c => c.address === contact.address)) {
                setContacts(prev => [...prev, contact]);
                localStorage.setItem(contactsKey, JSON.stringify([...contacts, contact]));
            }
        });
    }, [account]);

    useEffect(() => {
        if (!account || !recipient) return;
        const chatKey = `chat-${account}-${recipient}`;
        setMessages([]);
        gun.get(chatKey).map().on((msg) => {
            if (msg && msg.text) {
                setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
                localStorage.setItem(chatKey, JSON.stringify([...messages, msg]));
            }
        });
    }, [account, recipient]);

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
        if (!message.trim() || !recipient) return;
        const chatKey = `chat-${account}-${recipient}`;
        const newMessage = { sender: account, recipient, text: message, timestamp: Date.now() };
        gun.get(chatKey).set(newMessage);
        setMessage("");
    };

    const saveContact = () => {
        if (!recipient || !contactName.trim() || contacts.some(c => c.address === recipient)) return;
        const newContact = { address: recipient, name: contactName };
        gun.get(`contacts-${account}`).set(newContact);
        setContacts(prev => [...prev, newContact]);
        setContactName("");
    };

    const deleteContact = (contactAddress) => {
        gun.get(`contacts-${account}`).map().once((contact, id) => {
            if (contact && contact.address === contactAddress) {
                gun.get(`contacts-${account}`).get(id).put(null);
                setContacts(prev => prev.filter(c => c.address !== contactAddress));
            }
        });
    };

    const clearChat = () => {
        gun.get(`chat-${account}-${recipient}`).put(null);
        setMessages([]);
    };

    return (
        <div className="flex h-screen w-full bg-gray-900 text-white items-center justify-center">
            {account ? (
                <div className="flex h-full w-full max-w-4xl mx-auto border rounded-lg bg-gray-800 shadow-lg">
                    <ContactList contacts={contacts} setRecipient={setRecipient} deleteContact={deleteContact} />
                    <div className="flex flex-col w-2/3">
                        {recipient ? (
                            <>
                                <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-600">
                                    <h1 className="text-lg font-bold">Chat dengan {contacts.find(c => c.address === recipient)?.name || recipient}</h1>
                                    <button className="text-red-500 text-sm hover:text-red-700" onClick={clearChat}>Clear Chat</button>
                                </div>
                                <MessageList messages={messages} account={account} />
                                <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                                <p>Tambahkan atau pilih kontak untuk mulai mengobrol</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <button className="p-3 bg-blue-500 rounded-lg text-white shadow-lg hover:bg-blue-700" onClick={connectWallet}>Login dengan MetaMask</button>
            )}
        </div>
    );
}
