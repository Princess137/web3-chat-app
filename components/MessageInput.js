const MessageInput = ({ message, setMessage, sendMessage }) => {
    return (
        <div className="p-4 border-t border-gray-600 flex bg-gray-700">
            <input type="text" className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                placeholder="Tulis pesan..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                onClick={sendMessage}>Kirim</button>
        </div>
    );
};

export default MessageInput;
