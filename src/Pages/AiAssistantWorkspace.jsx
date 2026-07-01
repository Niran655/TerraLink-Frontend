import { useEffect, useMemo, useRef, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  CheckCircle,
  Languages,
  Menu,
  MessageSquare,
  Moon,
  Package,
  Plus,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { Box } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid } from "recharts";
import AiInsightsDashboard from "../Components/AiInsightsDashboard";
import { useAuth } from "../Context/AuthContext";
import {
  AI_BUSINESS_CHAT,
  GET_CHAT_CONVERSATION_BY_ID,
  GET_CHAT_CONVERSATIONS,
} from "../../graphql/queries";
import { CREATE_CHAT_CONVERSATION, DELETE_CHAT_CONVERSATION } from "../../graphql/mutation";
import "../Styles/AiAssistantWorkspace.scss";

const uiCopy = {
  en: {
    title: "TerraLink AI",
    subtitle: "Full-screen business intelligence workspace",
    back: "Back",
    newChat: "New chat",
    history: "History",
    noHistory: "No conversations yet",
    activeBusiness: "Active Business",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    language: "Language",
    clear: "Clear",
    online: "Online",
    ask: "Ask anything about your business...",
    send: "Send",
    you: "You",
    loading: "Analyzing business context...",
    terralinkReady:
      "TerraLink AI is ready. Ask about sales, stock, customers, profit, risk, or what to do next.",
    geminiReady:
      "Gemini AI is ready. Ask for strategy, marketing, finance, SWOT, or general business guidance.",
    welcomeTitle: "What should we improve today?",
    welcomeBody:
      "Ask for sales analysis, inventory risks, customer retention, marketing plans, financial strategy, or Gemini general business advice.",
    dataAccess: "Allow Gemini to use summarized store metrics",
    dataAccessNote: "Default off. Turn on only when you want Gemini to personalize answers with POS, inventory, and marketing context.",
    sourceData: "Business signals used",
    error:
      "Sorry, I could not fetch advice right now. Please check the backend server and Gemini API configuration.",
    services: {
      terralink: "TerraLink AI",
      gemini: "Gemini AI",
    },
    serviceDesc: {
      terralink: "Uses your internal business data and prediction services.",
      gemini: "General business consultant powered by Gemini.",
    },
    suggestions: [
      "What should I focus on today?",
      "Which products should I reorder?",
      "Why are sales dropping this week?",
      "Create a monthly cost reduction plan.",
    ],
    examples: [
      { icon: TrendingUp, label: "Sales", prompt: "Analyze my sales trend and recommend what to do today." },
      { icon: Package, label: "Inventory", prompt: "Which products are low stock or risky to promote?" },
      { icon: BarChart3, label: "Profit", prompt: "How can I increase profit without increasing ad spend?" },
      { icon: Zap, label: "Marketing", prompt: "Create a practical promotion plan for this week." },
    ],
  },
  kh: {
    title: "TerraLink AI",
    subtitle: "ផ្ទាំងការងារ AI ពេញអេក្រង់សម្រាប់វិភាគអាជីវកម្ម",
    back: "ត្រឡប់ក្រោយ",
    newChat: "សន្ទនាថ្មី",
    history: "ប្រវត្តិ",
    noHistory: "មិនទាន់មានប្រវត្តិសន្ទនា",
    activeBusiness: "អាជីវកម្មសកម្ម",
    theme: "រចនាប័ទ្ម",
    dark: "ងងឹត",
    light: "ភ្លឺ",
    language: "ភាសា",
    clear: "សម្អាត",
    online: "កំពុងភ្ជាប់",
    ask: "សួរអំពីអាជីវកម្មរបស់អ្នក...",
    send: "ផ្ញើ",
    you: "អ្នក",
    loading: "កំពុងវិភាគទិន្នន័យអាជីវកម្ម...",
    terralinkReady:
      "TerraLink AI រួចរាល់ហើយ។ សួរអំពីការលក់ ស្តុក អតិថិជន ចំណេញ ហានិភ័យ ឬអ្វីដែលត្រូវធ្វើបន្ទាប់។",
    geminiReady:
      "Gemini AI រួចរាល់ហើយ។ សួរអំពីយុទ្ធសាស្ត្រ ទីផ្សារ ហិរញ្ញវត្ថុ SWOT ឬដំបូន្មានអាជីវកម្មទូទៅ។",
    welcomeTitle: "ថ្ងៃនេះយើងគួរកែលម្អអ្វី?",
    welcomeBody:
      "សួរអំពីការលក់ ស្តុក ការរក្សាអតិថិជន ផែនការផ្សព្វផ្សាយ យុទ្ធសាស្ត្រហិរញ្ញវត្ថុ ឬដំបូន្មានអាជីវកម្មពី Gemini។",
    dataAccess: "អនុញ្ញាតឱ្យ Gemini ប្រើសង្ខេបទិន្នន័យហាង",
    dataAccessNote: "បិទជាលំនាំដើម។ បើកពេលអ្នកចង់ឱ្យ Gemini ផ្ដល់ដំបូន្មានដោយផ្អែកលើ POS ស្តុក និងទីផ្សារ។",
    sourceData: "សញ្ញាទិន្នន័យអាជីវកម្មដែលបានប្រើ",
    error:
      "សូមទោស ខ្ញុំមិនអាចទាញយកដំបូន្មានបានទេ។ សូមពិនិត្យ backend server និង Gemini API key។",
    services: {
      terralink: "TerraLink AI",
      gemini: "Gemini AI",
    },
    serviceDesc: {
      terralink: "ប្រើទិន្នន័យអាជីវកម្មខាងក្នុង និងសេវាកម្មព្យាករណ៍។",
      gemini: "ទីប្រឹក្សាអាជីវកម្មទូទៅ ដំណើរការដោយ Gemini។",
    },
    suggestions: [
      "ថ្ងៃនេះខ្ញុំគួរផ្តោតលើអ្វី?",
      "ទំនិញណាខ្លះគួរបញ្ជាទិញបន្ថែម?",
      "ហេតុអ្វីការលក់ធ្លាក់ចុះសប្តាហ៍នេះ?",
      "បង្កើតផែនការកាត់បន្ថយចំណាយប្រចាំខែ។",
    ],
    examples: [
      { icon: TrendingUp, label: "ការលក់", prompt: "វិភាគនិន្នាការលក់ និងណែនាំអ្វីដែលត្រូវធ្វើថ្ងៃនេះ។" },
      { icon: Package, label: "ស្តុក", prompt: "ទំនិញណាខ្លះមានស្តុកទាប ឬមានហានិភ័យពេលផ្សព្វផ្សាយ?" },
      { icon: BarChart3, label: "ចំណេញ", prompt: "តើធ្វើដូចម្តេចដើម្បីបង្កើនចំណេញដោយមិនបន្ថែមថវិកាផ្សព្វផ្សាយ?" },
      { icon: Zap, label: "ទីផ្សារ", prompt: "បង្កើតផែនការប្រូម៉ូសិនសម្រាប់សប្តាហ៍នេះ។" },
    ],
  },
};

const serviceOptions = ["terralink", "gemini"];

const initialMessage = (service, t) =>
  service === "gemini"
    ? t.geminiReady
    : t.terralinkReady;

const renderInline = (text) => {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

function FormattedAnswer({ content }) {
  const blocks = useMemo(() => {
    const lines = String(content || "")
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const result = [];
    let list = null;

    const flushList = () => {
      if (list?.items?.length) result.push(list);
      list = null;
    };

    lines.forEach((line) => {
      const heading = line.match(/^#{1,3}\s+(.+)$/);
      const bullet = line.match(/^[-*]\s+(.+)$/);
      const numbered = line.match(/^(\d+)\.\s+(.+)$/);
      const keyValue = line.match(/^([^:]{3,42}):\s*(.+)$/);

      if (heading) {
        flushList();
        result.push({ type: "heading", text: heading[1] });
      } else if (numbered) {
        if (!list || list.type !== "numbered") {
          flushList();
          list = { type: "numbered", items: [] };
        }
        list.items.push(numbered[2]);
      } else if (bullet) {
        if (!list || list.type !== "bullet") {
          flushList();
          list = { type: "bullet", items: [] };
        }
        list.items.push(bullet[1]);
      } else if (keyValue) {
        flushList();
        result.push({ type: "metric", label: keyValue[1], value: keyValue[2] });
      } else {
        flushList();
        result.push({ type: "paragraph", text: line });
      }
    });

    flushList();
    return result.length ? result : [{ type: "paragraph", text: content }];
  }, [content]);

  return (
    <div className="ai-answer-format">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return <h3 key={index}>{renderInline(block.text)}</h3>;
        }
        if (block.type === "metric") {
          return (
            <div className="answer-metric" key={index}>
              <span>{block.label}</span>
              <strong>{renderInline(block.value)}</strong>
            </div>
          );
        }
        if (block.type === "numbered") {
          return (
            <ol key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        if (block.type === "bullet") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

export default function AiAssistantWorkspace() {
  const apolloClient = useApolloClient();
  const navigate = useNavigate();
  const { isAuthenticated, user, language, changeLanguage } = useAuth();
  const [uiLanguage, setUiLanguage] = useState(() => language || localStorage.getItem("language") || "en");
  const t = uiCopy[uiLanguage] || uiCopy.en;
  const [theme, setTheme] = useState(() => localStorage.getItem("aiWorkspaceTheme") || "dark");
  const [activeService, setActiveService] = useState("terralink");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedShopId, setSelectedShopId] = useState(() => {
    const active = localStorage.getItem("activeShopId");
    if (active) return active;
    return user?.shopIds?.[0]?._id || user?.shopIds?.[0] || "";
  });
  const [grantGeminiAccess, setGrantGeminiAccess] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(() => [
    { role: "assistant", content: initialMessage("terralink", uiCopy[uiLanguage] || uiCopy.en) },
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [viewMode, setViewMode] = useState("chat");
  const [visibleChartIndex, setVisibleChartIndex] = useState(null);
  const threadRef = useRef(null);

  const { data: conversationsData, refetch: refetchConversations } = useQuery(GET_CHAT_CONVERSATIONS, {
    variables: { limit: 24 },
    skip: !isAuthenticated,
  });
  const [createConversation] = useMutation(CREATE_CHAT_CONVERSATION);
  const [deleteConversation] = useMutation(DELETE_CHAT_CONVERSATION);

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    if (window.confirm(uiLanguage === "kh" ? "តើអ្នកប្រាកដជាចង់លុបការសន្ទនានេះមែនទេ?" : "Are you sure you want to delete this conversation?")) {
      try {
        await deleteConversation({
          variables: { _id: id }
        });
        refetchConversations();
        if (activeConversationId === id) {
          setActiveConversationId(null);
          setChatMessages([{ role: "assistant", content: initialMessage(activeService, t) }]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const exportToPDF = (title, text) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { color: #10b981; margin-bottom: 24px; border-bottom: 2px solid #eee; padding-bottom: 12px; }
            pre { background: #f5f5f5; padding: 16px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div style="font-size: 14px; white-space: pre-wrap;">${text}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportToWord = (title, text) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>" + title + "</title><style>body { font-family: Arial; }</style></head><body>";
    const footer = "</body></html>";
    const body = "<h1>" + title + "</h1><p>" + text.replace(/\n/g, "<br>") + "</p>";
    const sourceHtml = header + body + footer;
    
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    const blob = new Blob(['\\ufeff' + sourceHtml], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    fileDownload.href = url;
    fileDownload.download = `${title.toLowerCase().replace(/\\s+/g, "_")}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    localStorage.setItem("aiWorkspaceTheme", theme);
  }, [theme]);

  useEffect(() => {
    setUiLanguage(language || "en");
  }, [language]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, aiLoading]);

  useEffect(() => {
    setChatMessages([{ role: "assistant", content: initialMessage(activeService, t) }]);
    setActiveConversationId(null);
  }, [activeService, uiLanguage]);

  const setLanguage = (nextLanguage) => {
    localStorage.setItem("language", nextLanguage);
    changeLanguage?.(nextLanguage);
    setUiLanguage(nextLanguage);
  };

  const handleShopChange = (event) => {
    const newId = event.target.value;
    setSelectedShopId(newId);
    localStorage.setItem("activeShopId", newId);
    refetchConversations();
  };

  const handleNewChat = async () => {
    try {
      const res = await createConversation({
        variables: {
          title: uiLanguage === "kh" ? "សន្ទនាថ្មី" : "New AI chat",
          shopId: selectedShopId || null,
        },
      });
      if (res.data?.createChatConversation?.isSuccess) {
        setActiveConversationId(res.data.createChatConversation.data.conversationId);
        refetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
    setChatMessages([{ role: "assistant", content: initialMessage(activeService, t) }]);
  };

  const loadConversation = async (conversationId) => {
    setActiveConversationId(conversationId);
    try {
      const res = await apolloClient.query({
        query: GET_CHAT_CONVERSATION_BY_ID,
        variables: { id: conversationId },
        fetchPolicy: "network-only",
      });
      if (res.data?.getChatConversationById?.messages?.length) {
        setChatMessages(res.data.getChatConversationById.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (forcedMessage) => {
    const query = (forcedMessage ?? inputMessage).trim();
    if (!query || aiLoading) return;

    setInputMessage("");
    setChatMessages((prev) => [...prev, { role: "user", content: query }]);
    setAiLoading(true);

    try {
      let convId = activeConversationId;
      if (!convId) {
        const createRes = await createConversation({
          variables: {
            title: query.length > 32 ? `${query.slice(0, 32)}...` : query,
            shopId: selectedShopId || null,
          },
        });
        if (createRes.data?.createChatConversation?.isSuccess) {
          convId = createRes.data.createChatConversation.data.conversationId;
          setActiveConversationId(convId);
        }
      }

      const res = await apolloClient.query({
        query: AI_BUSINESS_CHAT,
        variables: {
          input: {
            message: query,
            model: activeService === "gemini" ? "chat" : "all",
            shopId: selectedShopId || null,
            language: uiLanguage,
            service: activeService,
            grantPermission: activeService === "gemini" ? grantGeminiAccess : true,
            conversationHistory: chatMessages
              .slice(-8)
              .filter((msg) => msg.content)
              .map((msg) => ({ role: msg.role, content: msg.content })),
          },
        },
        fetchPolicy: "network-only",
      });

      const reply = res.data.aiBusinessChat;
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply.answer,
          model: reply.model,
          businessAIStatus: reply.businessAIStatus,
          businessAIResult: reply.businessAIResult,
          error: reply.error,
        },
      ]);
      refetchConversations();
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "assistant", content: t.error }]);
    } finally {
      setAiLoading(false);
    }
  };

  const conversations = conversationsData?.getChatConversations || [];

  return (
    <div className={`ai-workspace-container ai-theme-${theme} ai-lang-${uiLanguage}`}>
      <aside className={`ai-shell-sidebar ${sidebarOpen ? "is-open" : "is-closed"}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Sparkles size={20} />
          </div>
          <div>
            <strong>{t.title}</strong>
            <span>{t.subtitle}</span>
          </div>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={16} />
          {t.newChat}
        </button>

        <div className="service-switch">
          {serviceOptions.map((service) => (
            <button
              key={service}
              className={activeService === service ? "active" : ""}
              onClick={() => setActiveService(service)}
            >
              {service === "gemini" ? <Sparkles size={16} /> : <Bot size={16} />}
              <span>{t.services[service]}</span>
              <small>{t.serviceDesc[service]}</small>
            </button>
          ))}
        </div>

        <div className="history-panel">
          <div className="section-title">{t.history}</div>
          <div className="history-list scrollbar-thin">
            {conversations.length ? (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`history-item-wrapper ${conversation._id === activeConversationId ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    background: conversation._id === activeConversationId ? "var(--ai-hover)" : "transparent",
                    border: conversation._id === activeConversationId ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent",
                    color: "inherit",
                    transition: "all 0.2s"
                  }}
                >
                  <button
                    className="history-item-btn"
                    onClick={() => loadConversation(conversation._id)}
                    style={{
                      flex: 1,
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      padding: "10px",
                      fontSize: "13px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <MessageSquare size={14} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conversation.title}
                    </span>
                  </button>
                  <button
                    className="delete-history-btn"
                    onClick={(e) => handleDeleteConversation(e, conversation._id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            ) : (
              <p>{t.noHistory}</p>
            )}
          </div>
        </div>
      </aside>

      <main className="ai-shell-main">
        <header className="ai-topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle sidebar">
              <Menu size={18} />
            </button>
            <button className="icon-btn" onClick={() => navigate(-1)} aria-label={t.back}>
              <ArrowLeft size={18} />
            </button>
            <div className="status-pill">
              <span />
              {t.online}
            </div>
            <button
              className={`segmented-button ${viewMode === "chat" ? "active" : ""}`}
              onClick={() => setViewMode("chat")}
              style={{
                marginLeft: 16,
                padding: "6px 12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: viewMode === "chat" ? "rgba(255,255,255,0.1)" : "transparent",
                color: "#fff",
                cursor: "pointer",
                borderRadius: 4,
                fontWeight: "600",
                fontSize: "13px"
              }}
            >
              AI Chat
            </button>
            <button
              className={`segmented-button ${viewMode === "dashboard" ? "active" : ""}`}
              onClick={() => setViewMode("dashboard")}
              style={{
                marginLeft: 8,
                padding: "6px 12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: viewMode === "dashboard" ? "rgba(255,255,255,0.1)" : "transparent",
                color: "#fff",
                cursor: "pointer",
                borderRadius: 4,
                fontWeight: "600",
                fontSize: "13px"
              }}
            >
              AI Insights
            </button>
          </div>

          <div className="topbar-controls">
            <label className="shop-select">
              <span>{t.activeBusiness}</span>
              <select value={selectedShopId || "all"} onChange={handleShopChange}>
                <option value="all">
                  {uiLanguage === "kh" ? "អាជីវកម្មទាំងមូល (ហាងទាំងអស់)" : "Whole Business (All Shops)"}
                </option>
                {user?.shopIds?.map((shop) => {
                  const id = shop._id || shop;
                  const name = uiLanguage === "kh" ? shop.nameKh || shop.nameEn : shop.nameEn || shop.nameKh;
                  return (
                    <option key={id} value={id}>
                      {name || `Shop #${String(id).slice(0, 6)}`}
                    </option>
                  );
                }) || <option value={selectedShopId}>Demo Shop</option>}
              </select>
            </label>

            <div className="segmented-control" aria-label={t.language}>
              <Languages size={15} />
              <button className={uiLanguage === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
                EN
              </button>
              <button className={uiLanguage === "kh" ? "active" : ""} onClick={() => setLanguage("kh")}>
                ខ្មែរ
              </button>
            </div>

            <button className="mode-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "dark" ? t.dark : t.light}
            </button>

            <div className="user-chip">
              <User size={16} />
              <span>{user?.nameEn || user?.nameKh || "User"}</span>
            </div>
          </div>
        </header>

        {viewMode === "dashboard" ? (
          <Box sx={{ p: 3, overflowY: "auto", height: "calc(100vh - 70px)", width: "100%", boxSizing: "border-box" }}>
            <AiInsightsDashboard tenantId={user?.tenantId?._id || user?.tenantId} language={uiLanguage} />
          </Box>
        ) : (
          <section className="ai-conversation-shell">
            <div className="conversation-header">
              <div>
                <span className="eyebrow">{t.services[activeService]}</span>
                <h1>{t.welcomeTitle}</h1>
                <p>{t.welcomeBody}</p>
              </div>
              <button className="clear-btn" onClick={() => setChatMessages([])}>
                <Trash2 size={15} />
                {t.clear}
              </button>
            </div>

            <div ref={threadRef} className="chat-thread scrollbar-thin">
              {chatMessages.length === 0 && (
                <div className="empty-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "40px 20px" }}>
                  <Sparkles size={40} style={{ color: "var(--ai-primary)" }} />
                  <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", margin: "16px 0 8px" }}>
                    {uiLanguage === "kh" ? "សូមស្វាគមន៍មកកាន់ TerraLink AI" : "Welcome to TerraLink AI"}
                  </h2>
                  <p style={{ color: "var(--ai-muted)", fontSize: "14px", marginBottom: "24px", textAlign: "center" }}>
                    {uiLanguage === "kh" ? "ជ្រើសរើសជម្រើសវិភាគខាងក្រោម ឬសួរអ្វីក៏បានពី Gemini" : "Choose an analysis option below or ask Gemini anything"}
                  </p>
                  
                  <div className="options-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", maxWidth: "500px" }}>
                    <button
                      onClick={() => sendMessage(uiLanguage === "kh" ? "វិភាគនិន្នាការលក់ និងណែនាំអ្វីដែលត្រូវធ្វើថ្ងៃនេះ។" : "Analyze my sales trend and recommend what to do today.")}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    >
                      <TrendingUp size={16} style={{ color: "var(--ai-primary)", marginBottom: "8px" }} />
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {uiLanguage === "kh" ? "វិភាគការលក់" : "Analyze Sales"}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--ai-muted)", marginTop: "4px" }}>
                        {uiLanguage === "kh" ? "ពិនិត្យនិន្នាការលក់ និងការណែនាំ" : "View sales trends & actionable operations."}
                      </div>
                    </button>

                    <button
                      onClick={() => sendMessage(uiLanguage === "kh" ? "ទំនិញណាខ្លះមានស្តុកទាប ឬមានហានិភ័យពេលផ្សព្វផ្សាយ?" : "Which products are low stock or risky to promote?")}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    >
                      <Package size={16} style={{ color: "var(--ai-primary)", marginBottom: "8px" }} />
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {uiLanguage === "kh" ? "ពិនិត្យស្តុក" : "Check Stock Risk"}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--ai-muted)", marginTop: "4px" }}>
                        {uiLanguage === "kh" ? "ស្វែងរកផលិតផលស្តុកទាប" : "Identify low safety stocks & reorder items."}
                      </div>
                    </button>

                    <button
                      onClick={() => sendMessage(uiLanguage === "kh" ? "តើពិន្ទុសុខភាពអាជីវកម្មរបស់ខ្ញុំជាអ្វី ហើយខ្ញុំអាចកែលម្អវាដោយរបៀបណា?" : "What is my business health score and how can I improve it?")}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    >
                      <BarChart3 size={16} style={{ color: "var(--ai-primary)", marginBottom: "8px" }} />
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {uiLanguage === "kh" ? "ពិន្ទុសុខភាព" : "Explain Health Score"}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--ai-muted)", marginTop: "4px" }}>
                        {uiLanguage === "kh" ? "ពន្យល់ពីពិន្ទុសុខភាព និងការណែនាំ" : "Review aggregated business health score."}
                      </div>
                    </button>

                    <button
                      onClick={() => sendMessage(uiLanguage === "kh" ? "វិភាគការលុបចោលរបស់អតិថិជន និងអត្រាទិញម្តងទៀត។" : "Analyze customer churn and repeat purchase rate.")}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    >
                      <User size={16} style={{ color: "var(--ai-primary)", marginBottom: "8px" }} />
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {uiLanguage === "kh" ? "ការរក្សាអតិថិជន" : "Review Retention"}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--ai-muted)", marginTop: "4px" }}>
                        {uiLanguage === "kh" ? "វិភាគការទិញម្តងទៀត និងអតិថិជនហានិភ័យ" : "Analyze retention & churn rates."}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {chatMessages.map((msg, index) => {
                const mockChartData = [
                  { day: "Mon", sales: 240 },
                  { day: "Tue", sales: 300 },
                  { day: "Wed", sales: 200 },
                  { day: "Thu", sales: 280 },
                  { day: "Fri", sales: 380 },
                  { day: "Sat", sales: 450 },
                  { day: "Sun", sales: 400 }
                ];

                return (
                  <div key={`${msg.role}-${index}`} className={`chat-message ${msg.role}`}>
                    <div className="message-avatar">{msg.role === "user" ? <User size={17} /> : <Bot size={17} />}</div>
                    <div className="message-card" style={{ textAlign: "left" }}>
                      <div className="message-meta">
                        <strong>{msg.role === "user" ? t.you : t.services[activeService]}</strong>
                        {msg.businessAIStatus && <span>{msg.businessAIStatus}</span>}
                      </div>
                      {msg.role === "assistant" ? (
                        <FormattedAnswer content={msg.content} />
                      ) : (
                        <p className="plain-user-message">{msg.content}</p>
                      )}
                      {msg.businessAIResult && msg.businessAIResult !== "null" && (
                        <details className="business-data-preview">
                          <summary>
                            <CheckCircle size={14} />
                            {t.sourceData}
                          </summary>
                          <pre>{msg.businessAIResult}</pre>
                        </details>
                      )}

                      {/* AI Response enhancements */}
                      {msg.role === "assistant" && (
                        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {/* Suggestion Chips */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            <button
                              onClick={() => sendMessage(uiLanguage === "kh" ? "សូមពន្យល់ពីរបាយការណ៍នេះលម្អិតបន្ថែម។" : "Explain this analytics report in more detail.")}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "999px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.03)",
                                color: "var(--ai-muted)",
                                fontSize: "12px",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              {uiLanguage === "kh" ? "💡 ពន្យល់លម្អិតបន្ថែម" : "💡 Explain in detail"}
                            </button>
                            <button
                              onClick={() => sendMessage(uiLanguage === "kh" ? "តើមានសកម្មភាពអាទិភាពអ្វីខ្លះដែលខ្ញុំត្រូវធ្វើ?" : "What are the priority actions I need to take?")}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "999px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.03)",
                                color: "var(--ai-muted)",
                                fontSize: "12px",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              {uiLanguage === "kh" ? "🎯 សកម្មភាពអាទិភាព" : "🎯 Priority actions"}
                            </button>
                          </div>

                          {/* Export & Chart Controls */}
                          <div style={{ display: "flex", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px", marginTop: "4px" }}>
                            <button
                              onClick={() => setVisibleChartIndex(visibleChartIndex === index ? null : index)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "transparent",
                                color: "var(--ai-primary)",
                                fontSize: "11px",
                                cursor: "pointer"
                              }}
                            >
                              <BarChart3 size={12} />
                              {visibleChartIndex === index ? (uiLanguage === "kh" ? "លាក់គំនូសតាង" : "Hide Chart") : (uiLanguage === "kh" ? "បង្ហាញគំនូសតាង" : "Show Chart")}
                            </button>
                            <button
                              onClick={() => exportToPDF(uiLanguage === "kh" ? "របាយការណ៍វិភាគ TerraLink AI" : "TerraLink AI Analysis Report", msg.content)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "transparent",
                                color: "var(--ai-muted)",
                                fontSize: "11px",
                                cursor: "pointer"
                              }}
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => exportToWord(uiLanguage === "kh" ? "របាយការណ៍វិភាគ TerraLink AI" : "TerraLink AI Analysis Report", msg.content)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "transparent",
                                color: "var(--ai-muted)",
                                fontSize: "11px",
                                cursor: "pointer"
                              }}
                            >
                              Word
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Inline recharts container */}
                      {msg.role === "assistant" && visibleChartIndex === index && (
                        <div style={{ marginTop: "16px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", height: "240px" }}>
                          <h4 style={{ margin: "0 0 12px", color: "var(--ai-primary)" }}>
                            {uiLanguage === "kh" ? "របាយការណ៍លក់ប្រចាំសប្តាហ៍" : "Weekly Sales Analytics"}
                          </h4>
                          <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={mockChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" />
                              <YAxis stroke="rgba(255,255,255,0.4)" />
                              <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {aiLoading && (
                <div className="chat-message assistant">
                  <div className="message-avatar spinning">
                    <RefreshCw size={17} />
                  </div>
                  <div className="message-card loading-card" style={{ textAlign: "left" }}>{t.loading}</div>
                </div>
              )}
            </div>

            <div className="prompt-row">
              {t.examples.map((example) => (
                <button key={example.label} onClick={() => sendMessage(example.prompt)}>
                  <example.icon size={16} />
                  <span>{example.label}</span>
                </button>
              ))}
            </div>

            {activeService === "gemini" && (
              <div className="gemini-permission">
                <label>
                  <input
                    type="checkbox"
                    checked={grantGeminiAccess}
                    onChange={(event) => setGrantGeminiAccess(event.target.checked)}
                  />
                  <span className="switch-track" />
                  <span>{t.dataAccess}</span>
                </label>
                <small>
                  <Shield size={13} />
                  {t.dataAccessNote}
                </small>
              </div>
            )}

            <form
              className="chat-composer"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <textarea
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={t.ask}
                rows={2}
              />
              <button type="submit" disabled={aiLoading || !inputMessage.trim()} aria-label={t.send}>
                {aiLoading ? <RefreshCw size={18} /> : <Send size={18} />}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
