const MessageList = ({ messages, account }) => {
    return (
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900">
            {messages.length > 0 ? messages.map((msg, index) => (
                <div key={index} className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender === account ? 'bg-blue-500 ml-auto' : 'bg-gray-600'}`}>
                    <span className="block font-bold text-xs text-gray-300">{msg.sender === account ? "Anda" : msg.sender}</span>
                    <span>{msg.text}</span>
                </div>
            )) : (
                <p className="text-gray-400 text-center">Belum ada pesan</p>
            )}
        </div>
    );
};

export default MessageList;
