import { useState } from 'react';

const NOTIFICATIONS = [
  { id: 1,  type: 'mention',  user: 'AM', userName: 'Alex M',    text: 'mentioned you in Fix login bug',         project: 'Mobile App v2',    time: '2m ago',   read: false },
  { id: 2,  type: 'comment',  user: 'SP', userName: 'Sara P',    text: 'commented on Redesign landing page',     project: 'Website Redesign', time: '18m ago',  read: false },
  { id: 3,  type: 'task',     user: 'RH', userName: 'Raihan',    text: 'moved Review PR #42 to In Progress',     project: 'Website Redesign', time: '1h ago',   read: false },
  { id: 4,  type: 'mention',  user: 'AM', userName: 'Alex M',    text: 'mentioned you in Sprint planning',       project: 'Design System',    time: '3h ago',   read: true  },
  { id: 5,  type: 'comment',  user: 'SP', userName: 'Sara P',    text: 'commented on Integrate Stripe API',      project: 'API Integration',  time: '5h ago',   read: true  },
  { id: 6,  type: 'task',     user: 'AM', userName: 'Alex M',    text: 'assigned Write API docs to you',         project: 'API Integration',  time: '1d ago',   read: true  },
  { id: 7,  type: 'comment',  user: 'SP', userName: 'Sara P',    text: 'commented on Update color tokens',       project: 'Design System',    time: '1d ago',   read: true  },
];

const MESSAGES = [
  {
    id: 1, user: 'AM', userName: 'Alex M', time: '2m ago', unread: 2,
    messages: [
      { from: 'AM', text: 'Hey, can you check the PR I just pushed?', time: '2m ago' },
      { from: 'AM', text: 'There are some edge cases I want your opinion on', time: '1m ago' },
    ],
  },
  {
    id: 2, user: 'SP', userName: 'Sara P', time: '1h ago', unread: 0,
    messages: [
      { from: 'SP', text: 'The landing page wireframes are ready for review', time: '1h ago' },
      { from: 'RH', text: 'Looks great! Will review by EOD', time: '58m ago' },
    ],
  },
  {
    id: 3, user: 'TM', userName: 'Team', time: '3h ago', unread: 1,
    messages: [
      { from: 'AM', text: 'Sprint planning is moved to Thursday', time: '3h ago' },
      { from: 'SP', text: 'Works for me!', time: '2h ago' },
      { from: 'TM', text: 'Same here', time: '2h ago' },
    ],
  },
];

const AVATAR_COLORS = {
  RH: 'bg-blue-600/25 text-blue-400',
  AM: 'bg-pink-600/25 text-pink-400',
  SP: 'bg-amber-600/25 text-amber-400',
  TM: 'bg-purple-600/25 text-purple-400',
};

const NOTIF_ICONS = {
  mention: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/>
    </svg>
  ),
  comment: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  task: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
};

const NOTIF_ICON_COLORS = {
  mention: 'bg-blue-600/20 text-blue-400',
  comment: 'bg-emerald-600/20 text-emerald-400',
  task:    'bg-amber-600/20 text-amber-400',
};

const Avatar = ({ initials, size = 'md' }) => {
  const sz = size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-xs';
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-semibold shrink-0 ${AVATAR_COLORS[initials] ?? 'bg-zinc-700 text-zinc-300'}`}>
      {initials}
    </div>
  );
};

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export default function Inbox() {
  const [tab, setTab]                     = useState('notifications');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeChat, setActiveChat]       = useState(MESSAGES[0]);
  const [chats, setChats]                 = useState(MESSAGES);
  const [input, setInput]                 = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { from: 'RH', text: input.trim(), time: 'now' };
    setChats(prev => prev.map(c =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg], time: 'now', unread: 0 }
        : c
    ));
    setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMsg], time: 'now' }));
    setInput('');
  };

  return (
    <div className="p-6 flex flex-col gap-5 h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Inbox</h1>
        {tab === 'notifications' && unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
        {[
          { id: 'notifications', label: 'Notifications', count: unreadCount },
          { id: 'messages',      label: 'Messages',      count: chats.reduce((a, c) => a + c.unread, 0) },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications tab */}
      {tab === 'notifications' && (
        <div className="flex flex-col gap-1">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                n.read ? 'hover:bg-zinc-800/40' : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Avatar */}
              <Avatar initials={n.user} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm leading-snug ${n.read ? 'text-zinc-500' : 'text-zinc-200'}`}>
                    <span className="font-medium text-white">{n.userName}</span> {n.text}
                  </p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${NOTIF_ICON_COLORS[n.type]}`}>
                    {n.project}
                  </span>
                  <span className="text-[11px] text-zinc-600">{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages tab */}
      {tab === 'messages' && (
        <div className="flex gap-4 flex-1 min-h-0" style={{ height: '520px' }}>

          {/* Conversation list */}
          <div className="w-56 shrink-0 flex flex-col gap-1">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-colors w-full ${
                  activeChat.id === chat.id ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50 text-zinc-400'
                }`}
              >
                <Avatar initials={chat.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{chat.userName}</p>
                  <p className="text-[11px] text-zinc-600 truncate">{chat.messages.at(-1)?.text}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="text-[10px] bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
              <Avatar initials={activeChat.user} size="sm" />
              <span className="text-sm font-medium text-white">{activeChat.userName}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {activeChat.messages.map((msg, i) => {
                const isMe = msg.from === 'RH';
                return (
                  <div key={i} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && <Avatar initials={msg.from} size="sm" />}
                    <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-zinc-700 mb-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm placeholder-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <SendIcon />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}