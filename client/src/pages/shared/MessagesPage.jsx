import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquareMore, SendHorizonal, Building2, Sparkles, BellRing, Paperclip, CheckCheck, CircleDot, Mail, Phone } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { EmptyState, Avatar } from '../../components/ui.jsx';
import { STUDENT_NAV, EMPLOYER_NAV } from '../../constants/nav.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { messageService } from '../../services/api.js';

const formatTime = (value) => {
  if (!value) return '';

  try {
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return '';
  }
};

export default function MessagesPage({ role = 'student' }) {
  const location = useLocation();
  const { user } = useAuth();
  const navItems = role === 'employer' ? EMPLOYER_NAV : STUDENT_NAV;
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const listRef = useRef(null);
  const typingTimerRef = useRef(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const fetchUnreadCount = async () => {
    try {
      const res = await messageService.getUnreadCount();
      setUnreadCount(res?.data?.count || res?.count || 0);
    } catch (error) {
      setUnreadCount(0);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await messageService.getConversations();
      const items = res?.data || [];
      setConversations(items);

      if (selectedConversationId) {
        const exists = items.some((conversation) => conversation.id === selectedConversationId);
        if (!exists) setSelectedConversationId(items[0]?.id || null);
      } else {
        const preferredConversationId = location.state?.conversationId || items[0]?.id || null;
        setSelectedConversationId(preferredConversationId);
      }
    } catch (error) {
      setConversations([]);
      setSelectedConversationId(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      const res = await messageService.getConversation(conversationId);
      const conversationMessages = res?.data || [];
      setMessages(conversationMessages);

      if (conversationMessages.length > 0) {
        await messageService.markAsRead(conversationId);
        await fetchUnreadCount();
      }
    } catch (error) {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchConversations();
      fetchUnreadCount();
    }, 4000);

    return () => clearInterval(interval);
  }, [location.key]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setIsOnline(true);
  }, [selectedConversationId]);

  const handleDraftChange = (event) => {
    setDraft(event.target.value);
    setTyping(true);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setTyping(false), 1200);
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(1);
    const label = `${file.name} (${sizeInKb} KB)`;
    setAttachmentName(label);
    setDraft((prev) => (prev ? `${prev}\n\n[Attachment: ${file.name}]` : `[Attachment: ${file.name}]`));
    event.target.value = '';
  };

  const handleSendMessage = async () => {
    if (!draft.trim() || !selectedConversationId || sending) return;

    const messageText = attachmentName ? `${draft.trim()}\n\n📎 ${attachmentName}` : draft.trim();
    setDraft('');
    setAttachmentName('');
    setTyping(false);
    setSending(true);

    try {
      const res = await messageService.sendMessage(selectedConversationId, messageText);
      const newMessage = res?.data || null;

      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === selectedConversationId
            ? { ...conversation, messages: [{ ...newMessage, senderId: user?.id, readAt: new Date().toISOString() }, ...(conversation.messages || [])] }
            : conversation
        )
      );

      await fetchUnreadCount();
    } catch (error) {
      setDraft(messageText);
      setAttachmentName(messageText.includes('📎') ? messageText.split('📎')[1]?.trim() || '' : '');
    } finally {
      setSending(false);
    }
  };

  const conversationTitle = role === 'employer'
    ? selectedConversation?.applicant?.fullName || 'Conversation'
    : selectedConversation?.employer?.organizationName || 'Conversation';

  const conversationMeta = selectedConversation?.opportunity?.title || 'Opportunity chat';

  const getUnreadForConversation = (conversation) => {
    if (!conversation.messages?.length) return 0;
    return conversation.messages.filter((message) => message.senderId !== user?.id && !message.readAt).length;
  };

  return (
    <DashboardLayout navItems={navItems} title="Messages">
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-text">Inbox</h2>
          <p className="text-sm text-text-light">Stay connected with employers and candidates.</p>
        </div>
        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary bg-opacity-10 px-3 py-1.5 text-sm font-medium text-secondary">
            <BellRing size={14} /> {unreadCount} unread
          </div>
        )}
      </div>

      <div className="h-[calc(100vh-220px)] min-h-[620px] bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="grid lg:grid-cols-[340px_1fr] h-full">
          <aside className="border-r border-border bg-background/50">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Conversations</h3>
              {unreadCount > 0 && <span className="rounded-full bg-primary text-white text-xs px-2 py-1">{unreadCount}</span>}
            </div>

            {loading ? (
              <div className="p-6 text-sm text-text-light">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={MessageSquareMore}
                  title="No conversations yet"
                  description="When a student applies or an employer replies, the messages will appear here."
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {conversations.map((conversation) => {
                  const unread = getUnreadForConversation(conversation);
                  const lastMessage = conversation.messages?.[0]?.message || 'No messages yet';
                  const isSelected = conversation.id === selectedConversationId;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`w-full text-left p-4 transition-colors ${isSelected ? 'bg-primary bg-opacity-5' : 'hover:bg-white'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          {role === 'employer' ? (
                            <Avatar src={conversation.applicant?.profilePhoto} name={conversation.applicant?.fullName} size="md" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center font-semibold text-xs">
                              {conversation.employer?.organizationName?.slice(0, 2).toUpperCase() || 'ORG'}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-text truncate">
                              {role === 'employer' ? conversation.applicant?.fullName : conversation.employer?.organizationName || 'Organization'}
                            </p>
                            {unread > 0 && (
                              <span className="rounded-full bg-primary text-white text-[10px] px-1.5 py-0.5 min-w-[18px] text-center">{unread}</span>
                            )}
                          </div>
                          <p className="text-xs text-text-light truncate mt-1">{conversation.opportunity?.title}</p>
                          <p className="text-sm text-text-light mt-2 truncate">{lastMessage}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="flex flex-col h-full">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-border bg-white">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      {role === 'employer' ? (
                        <Avatar src={selectedConversation.applicant?.profilePhoto} name={selectedConversation.applicant?.fullName} size="md" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center font-semibold text-sm">
                          {selectedConversation.employer?.organizationName?.slice(0, 2).toUpperCase() || 'ORG'}
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-text">{conversationTitle}</h3>
                        <p className="text-xs text-text-light">{conversationMeta}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-text-light">
                      <CircleDot size={12} className={isOnline ? 'text-success' : 'text-text-light'} fill={isOnline ? '#22c55e' : '#94a3b8'} />
                      <span>{isOnline ? 'Online now' : 'Away'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b border-border bg-background/40">
                  <div className="rounded-xl border border-border bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.08em] text-text-light mb-1">Opportunity</p>
                    <p className="font-medium text-text">{conversationMeta}</p>
                    <p className="text-sm text-text-light mt-1">
                      {role === 'employer'
                        ? `Contacting ${selectedConversation.applicant?.fullName || 'candidate'} about this role.`
                        : `Communicating with ${selectedConversation.employer?.organizationName || 'the employer'} about this opportunity.`}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-b border-border bg-white">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-text-light mb-2">
                        <Mail size={12} /> Contact
                      </div>
                      <p className="text-sm text-text">{role === 'employer' ? 'Candidate profile shared via application' : 'Hiring team contact available in inbox'}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-text-light mb-2">
                        <Phone size={12} /> Response time
                      </div>
                      <p className="text-sm text-text">Usually within 24 hours</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-text-light mb-2">
                        <Sparkles size={12} /> Status
                      </div>
                      <p className="text-sm text-text">{isOnline ? 'Available for discussion' : 'Currently away'}</p>
                    </div>
                  </div>
                </div>

                <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-text-light">
                      Start the conversation by sending the first message.
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = message.senderId === user?.id;

                      return (
                        <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMine ? 'bg-primary text-white' : 'bg-background text-text'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                            <p className={`mt-1 text-[10px] ${isMine ? 'text-primary-foreground/80' : 'text-text-light'}`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {typing && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-background text-text px-4 py-3 text-sm">
                        <span className="inline-flex items-center gap-2">
                          <span className="flex gap-1 items-center">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:120ms]" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:240ms]" />
                          </span>
                          typing...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border bg-white">
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center justify-center h-[52px] w-[52px] rounded-lg border border-border text-text-light hover:bg-background cursor-pointer">
                      <Paperclip size={18} />
                      <input type="file" className="hidden" onChange={handleAttachment} />
                    </label>

                    <textarea
                      value={draft}
                      onChange={handleDraftChange}
                      rows={2}
                      placeholder="Write a message..."
                      className="input-field resize-none min-h-[52px] max-h-[120px]"
                    />

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!draft.trim() || sending}
                      className="btn-primary h-[52px] px-4 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sending ? <CheckCheck size={16} /> : <SendHorizonal size={16} />}
                      {sending ? 'Sending' : 'Send'}
                    </button>
                  </div>

                  {attachmentName && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary bg-opacity-10 px-3 py-1.5 text-xs text-secondary">
                      <Paperclip size={12} /> {attachmentName}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={Building2}
                  title="Choose a conversation"
                  description="Select a conversation from the left panel to start communicating with the organization or candidate."
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
