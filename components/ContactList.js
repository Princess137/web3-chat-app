const ContactList = ({ contacts, setRecipient, deleteContact }) => {
    return (
        <div className="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Kontak</h2>
            <ul className="space-y-2 mt-4">
                {contacts.length > 0 ? contacts.map((contact, index) => (
                    <li key={index} className="flex justify-between p-2 rounded cursor-pointer hover:bg-gray-600"
                        onClick={() => setRecipient(contact.address)}>
                        <span>{contact.name} ({contact.address})</span>
                        <button className="text-red-500 text-sm hover:text-red-700 ml-2"
                            onClick={(e) => { e.stopPropagation(); deleteContact(contact.address); }}>Hapus</button>
                    </li>
                )) : <p className="text-gray-400">Belum ada kontak</p>}
            </ul>
        </div>
    );
};

export default ContactList;
