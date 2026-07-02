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
  ShoppingCart,
  AlertTriangle,
  Star,
  Copy,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
  X,
} from "lucide-react";
import { Box } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid } from "recharts";
import AiInsightsDashboard from "../Components/AiInsightsDashboard";
import { useAuth } from "../Context/AuthContext";
import {
  AI_BUSINESS_CHAT,
  GET_CHAT_CONVERSATION_BY_ID,
  GET_CHAT_CONVERSATIONS,
  GET_ALL_SHOP,
} from "../../graphql/queries";
import { CREATE_CHAT_CONVERSATION, DELETE_CHAT_CONVERSATION } from "../../graphql/mutation";
import { canAccessShop } from "../utils/tenantAccess";
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
    let table = null;

    const flushList = () => {
      if (list?.items?.length) result.push(list);
      list = null;
    };

    const flushTable = () => {
      if (table) result.push(table);
      table = null;
    };

    lines.forEach((line) => {
      const heading = line.match(/^#{1,3}\s+(.+)$/);
      const bullet = line.match(/^[-*]\s+(.+)$/);
      const numbered = line.match(/^(\d+)\.\s+(.+)$/);
      const keyValue = line.match(/^([^:]{3,42}):\s*(.+)$/);
      const isTableRow = line.startsWith("|") && line.endsWith("|");

      if (isTableRow) {
        flushList();
        if (line.match(/^\|[\s:-|]+$/) || line.includes("---")) {
          return;
        }
        const cells = line
          .split("|")
          .map((c) => c.trim())
          .slice(1, -1);

        if (!table) {
          table = { type: "table", headers: cells, rows: [] };
        } else {
          table.rows.push(cells);
        }
      } else {
        flushTable();
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
      }
    });

    flushList();
    flushTable();
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
        if (block.type === "table") {
          return (
            <div className="table-responsive" key={index} style={{ overflowX: "auto", margin: "14px 0", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#f8fafc" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {block.headers.map((header, hIdx) => (
                      <th key={hIdx} style={{ padding: "10px 12px", textAlign: "left", fontWeight: "700", color: "var(--ai-muted)" }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: rIdx < block.rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      {row.map((cell, cIdx) => {
                        const isStatus = block.headers[cIdx] === "ស្ថានភាព" || block.headers[cIdx] === "Status" || cell.includes("ស្តុក");
                        if (isStatus && (cell.includes("ទាប") || cell.toLowerCase().includes("low"))) {
                          return (
                            <td key={cIdx} style={{ padding: "10px 12px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
                                {cell}
                              </span>
                            </td>
                          );
                        }
                        if (isStatus && (cell.includes("ជិត") || cell.toLowerCase().includes("near") || cell.toLowerCase().includes("warning"))) {
                          return (
                            <td key={cIdx} style={{ padding: "10px 12px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                                {cell}
                              </span>
                            </td>
                          );
                        }
                        return (
                          <td key={cIdx} style={{ padding: "10px 12px" }}>
                            {renderInline(cell)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "paragraph" && block.text.startsWith("💡")) {
          return (
            <div key={index} style={{
              background: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.15)",
              borderRadius: "10px",
              padding: "14px",
              margin: "12px 0",
              color: "#f8fafc",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start"
            }}>
              <span style={{ fontSize: "16px", lineHeight: "1" }}>💡</span>
              <div style={{ flex: 1, fontSize: "13px", lineHeight: "1.6" }}>
                <strong>{renderInline(block.text.replace("💡", "").split(":")[0] + ":")}</strong>
                {block.text.includes(":") && renderInline(block.text.substring(block.text.indexOf(":") + 1))}
              </div>
            </div>
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
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(true);
  const threadRef = useRef(null);

  const { data: conversationsData, refetch: refetchConversations } = useQuery(GET_CHAT_CONVERSATIONS, {
    variables: { limit: 24 },
    skip: !isAuthenticated,
  });
  const { data: shopsData } = useQuery(GET_ALL_SHOP, {
    skip: !isAuthenticated,
  });

  const accessibleShops = useMemo(() => {
    const rawShops = shopsData?.getAllShops || [];
    return rawShops.filter((shop) => canAccessShop(user, shop?._id));
  }, [shopsData, user]);

  const [createConversation] = useMutation(CREATE_CHAT_CONVERSATION);
  const [deleteConversation] = useMutation(DELETE_CHAT_CONVERSATION);

  useEffect(() => {
    if (!selectedShopId && accessibleShops.length > 0) {
      const active = localStorage.getItem("activeShopId");
      if (active) {
        setSelectedShopId(active);
      } else {
        const isTenantAdmin = ["superAdmin", "owner", "admin", "manager"].includes(user?.role);
        setSelectedShopId(isTenantAdmin ? "all" : accessibleShops[0]._id);
      }
    }
  }, [accessibleShops, selectedShopId, user]);

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
            shopId: selectedShopId === "all" ? null : (selectedShopId || null),
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
            shopId: selectedShopId === "all" ? null : (selectedShopId || null),
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

  const getRelativeTime = (date) => {
    if (!date) return uiLanguage === "kh" ? "2 ម៉ោងមុន" : "2 hours ago";
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return uiLanguage === "kh" ? `${diffMins} នាទីមុន` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return uiLanguage === "kh" ? `${diffHours} ម៉ោងមុន` : `${diffHours}h ago`;
    } else {
      return uiLanguage === "kh" ? `${diffDays} ថ្ងៃមុន` : `${diffDays}d ago`;
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert(uiLanguage === "kh" ? "បានចម្លងទៅកាន់ Clipboard!" : "Copied to clipboard!");
  };

  const exampleQuestions = [
    {
      icon: TrendingUp,
      color: "#0bb3a3",
      prompt: "តើផលិតផលណាខ្លះមានស្តុកទាប?",
      textKh: "តើផលិតផលណាខ្លះមានស្តុកទាប?",
      textEn: "Which products are low stock?"
    },
    {
      icon: DollarSign,
      color: "#16a34a",
      prompt: "តើចំណូលសរុបប្រចាំថ្ងៃរបស់ខ្ញុំប៉ុន្មាន?",
      textKh: "តើចំណូលសរុបប្រចាំថ្ងៃរបស់ខ្ញុំប៉ុន្មាន?",
      textEn: "What is my daily revenue?"
    },
    {
      icon: BarChart3,
      color: "#2563eb",
      prompt: "ប្រៀបធៀបការលក់តាមហាង",
      textKh: "ប្រៀបធៀបការលក់តាមហាង",
      textEn: "Compare sales by shop"
    },
    {
      icon: AlertTriangle,
      color: "#dc2626",
      prompt: "តើអាជីវកម្មមានហានិភ័យអ្វីខ្លះ?",
      textKh: "តើអាជីវកម្មមានហានិភ័យអ្វីខ្លះ?",
      textEn: "What are the business risks?"
    }
  ];

  const getInsightsData = () => {
    const assistantMsgs = chatMessages.filter(m => m.role === "assistant");
    const lastMsg = assistantMsgs[assistantMsgs.length - 1];

    let dynamicData = null;
    if (lastMsg?.businessAIResult) {
      try {
        dynamicData = JSON.parse(lastMsg.businessAIResult);
      } catch (err) {
        console.error("Failed to parse businessAIResult:", err);
      }
    }

    const getModelData = (key) => {
      if (!dynamicData) return null;
      if (dynamicData[key]) return dynamicData[key];
      if (dynamicData.model === key) return dynamicData;
      return null;
    };
    
    const text = (lastMsg?.content || "").toLowerCase();
    const userMsgs = chatMessages.filter(m => m.role === "user");
    const lastUserQuery = userMsgs.length ? userMsgs[userMsgs.length - 1].content.toLowerCase() : "";
    
    const isInventory = text.includes("stock") || text.includes("inventory") || text.includes("ស្តុក") || 
                        lastUserQuery.includes("stock") || lastUserQuery.includes("inventory") || lastUserQuery.includes("ស្តុក") ||
                        lastMsg?.model === "inventory_optimization" || lastMsg?.model === "product_performance";
                        
    const isSales = text.includes("sale") || text.includes("revenue") || text.includes("លក់") || text.includes("ចំណូល") ||
                    lastUserQuery.includes("sale") || lastUserQuery.includes("revenue") || lastUserQuery.includes("លក់") || lastUserQuery.includes("ចំណូល") ||
                    lastMsg?.model === "sales_forecast" || lastMsg?.model === "profitability_analysis";
                    
    const isCustomer = text.includes("customer") || text.includes("churn") || text.includes("អតិថិជន") ||
                       lastUserQuery.includes("customer") || lastUserQuery.includes("churn") || lastUserQuery.includes("អតិថិជន") ||
                       lastMsg?.model === "customer_churn" || lastMsg?.model === "marketing_performance";

    if (isInventory) {
      const invData = getModelData("inventory_optimization") || getModelData("inventory") || {};
      const stock = invData.payload?.stock ?? invData.stock ?? 12456;
      const minStock = invData.payload?.minStock ?? invData.minStock ?? 20;
      const daysUntilStockout = invData.prediction?.daysUntilStockout ?? invData.daysUntilStockout ?? 2;
      const isLowStock = invData.prediction?.isLowStock ?? invData.isLowStock ?? false;
      const dailyUsage = invData.payload?.dailyUsage ?? invData.dailyUsage ?? 5;
      const recommendations = invData.recommendations ?? (uiLanguage === "kh" ? [
        "គួរកម្ម៉ង់ទិញ Espresso, Croissant និង Coca Cola Pack ជាបន្ទាន់",
        "ពិនិត្យរបាយការណ៍លក់ Orange Juice ក្នុងរយៈពេល ២-៣ ថ្ងៃ"
      ] : [
        "Reorder Espresso, Croissant and Coca Cola Pack immediately",
        "Monitor Orange Juice sales performance over the next 2-3 days"
      ]);

      return {
        kpis: [
          { icon: ShoppingCart, color: "#2563eb", labelKh: "ផលិតផលសរុប", value: "156", labelEn: "Total Products" },
          { icon: AlertTriangle, color: "#c084fc", labelKh: "ថ្ងៃជិតអស់ស្តុក", value: `${daysUntilStockout} days`, labelEn: "Days Until Stockout" },
          { icon: Package, color: "#f97316", labelKh: "សរុបស្តុក", value: `${stock}`, labelEn: "Total Stock" },
          { icon: DollarSign, color: "#10b981", labelKh: "ស្ថានភាពស្តុក", value: isLowStock ? (uiLanguage === "kh" ? "ស្តុកទាប" : "Low Stock") : (uiLanguage === "kh" ? "ល្អ" : "Healthy"), labelEn: "Stock Status" }
        ],
        chartTitle: uiLanguage === "kh" ? "ក្រាបប្រវត្តិកម្រិតស្តុក Low Stock Trend" : "Low Stock Trend",
        chartData: [
          { name: "Day 1", value: stock },
          { name: "Day 2", value: Math.max(0, stock - Math.round(dailyUsage)) },
          { name: "Day 3", value: Math.max(0, stock - Math.round(dailyUsage * 2)) },
          { name: "Day 4", value: Math.max(0, stock - Math.round(dailyUsage * 3)) },
          { name: "Day 5", value: Math.max(0, stock - Math.round(dailyUsage * 4)) }
        ],
        recommendationsTitle: uiLanguage === "kh" ? "អនុសាសន៍ Recommendations" : "Recommendations",
        recommendations
      };
    } else if (isSales) {
      const salesData = getModelData("sales_forecast") || getModelData("sales") || {};
      const predictedSales = salesData.prediction?.predictedSales ?? salesData.predictedSales ?? 14250;
      const level = salesData.prediction?.level ?? salesData.level ?? "Medium";
      const previous7DaySalesAvg = salesData.payload?.previous7DaySalesAvg ?? salesData.previous7DaySalesAvg ?? 10;
      const discountTotal = salesData.payload?.discountTotal ?? salesData.discountTotal ?? 0;
      const ordersCount = salesData.payload?.ordersCount ?? salesData.ordersCount ?? 345;
      const recommendations = salesData.recommendations ?? (uiLanguage === "kh" ? [
        "បង្កើនការផ្សព្វផ្សាយលក់នៅចុងសប្តាហ៍ចំពោះមុខទំនិញលក់ដាច់",
        "កាត់បន្ថយការចំណាយមិនចាំបាច់ដើម្បីរក្សាម៉ាជីនចំណេញ"
      ] : [
        "Boost weekend promotions for high-volume products",
        "Optimize operating costs to maintain profit margins"
      ]);

      return {
        kpis: [
          { icon: DollarSign, color: "#2563eb", labelKh: "ចំណូលព្យាករណ៍", value: `$${Number(predictedSales).toFixed(2)}`, labelEn: "Forecasted Revenue" },
          { icon: ShoppingCart, color: "#c084fc", labelKh: "ប្រតិបត្តិការសរុប", value: `${ordersCount}`, labelEn: "Total Transactions" },
          { icon: Package, color: "#f97316", labelKh: "បញ្ចុះតម្លៃសរុប", value: `$${Number(discountTotal).toFixed(2)}`, labelEn: "Total Discounts" },
          { icon: TrendingUp, color: "#10b981", labelKh: "កម្រិតតម្រូវការ", value: `${level}`, labelEn: "Demand Level" }
        ],
        chartTitle: uiLanguage === "kh" ? "ក្រាបនិន្នាការលក់ Sales Trend" : "Sales Trend",
        chartData: [
          { name: "Mon", value: previous7DaySalesAvg * 0.9 },
          { name: "Tue", value: previous7DaySalesAvg * 1.1 },
          { name: "Wed", value: previous7DaySalesAvg },
          { name: "Thu", value: previous7DaySalesAvg * 1.05 },
          { name: "Forecast", value: predictedSales }
        ],
        recommendationsTitle: uiLanguage === "kh" ? "អនុសាសន៍ Recommendations" : "Recommendations",
        recommendations
      };
    } else if (isCustomer) {
      const custData = getModelData("customer_churn") || getModelData("churn") || {};
      const probability = custData.prediction?.probability ?? custData.probability ?? 0.35;
      const label = custData.prediction?.label ?? custData.label ?? "monitor";
      const totalSpent = custData.payload?.totalSpent ?? custData.totalSpent ?? 1000;
      const daysSinceLastOrder = custData.payload?.daysSinceLastOrder ?? custData.daysSinceLastOrder ?? 5;
      const recommendations = custData.recommendations ?? (uiLanguage === "kh" ? [
        "ផ្ញើ coupon បញ្ចុះតម្លៃទៅកាន់អតិថិជនដែលមិនបានទិញទំនិញលើសពី ៣០ ថ្ងៃ",
        "បង្កើតកម្មវិធីសន្សំពិន្ទុ (Loyalty Program) ដើម្បីរក្សាអតិថិជនចាស់"
      ] : [
        "Send discount coupons to customers inactive for over 30 days",
        "Launch a loyalty points program to improve customer retention"
      ]);

      return {
        kpis: [
          { icon: User, color: "#2563eb", labelKh: "លទ្ធភាព Churn", value: `${(probability * 100).toFixed(1)}%`, labelEn: "Churn Probability" },
          { icon: AlertTriangle, color: "#c084fc", labelKh: "ស្ថានភាពហានិភ័យ", value: `${label}`, labelEn: "Risk Level" },
          { icon: TrendingUp, color: "#f97316", labelKh: "ការទិញចុងក្រោយ", value: `${daysSinceLastOrder} days ago`, labelEn: "Last Order" },
          { icon: DollarSign, color: "#10b981", labelKh: "ចំណាយសរុប", value: `$${Number(totalSpent).toFixed(2)}`, labelEn: "Total Spent" }
        ],
        chartTitle: uiLanguage === "kh" ? "អត្រារក្សាអតិថិជន Retention Trend" : "Retention Trend",
        chartData: [
          { name: "Stable", value: 1 - probability },
          { name: "Risk", value: probability }
        ],
        recommendationsTitle: uiLanguage === "kh" ? "អនុសាសន៍ Recommendations" : "Recommendations",
        recommendations
      };
    } else {
      const invData = getModelData("inventory_optimization") || {};
      const custData = getModelData("customer_churn") || {};
      
      const isLowStock = invData.prediction?.isLowStock ?? false;
      const churnProb = custData.prediction?.probability ?? 0.15;
      const healthScore = Math.max(10, Math.min(100, Math.round(95 - (isLowStock ? 15 : 0) - (churnProb * 30))));
      const criticalRisksCount = (isLowStock ? 1 : 0) + (churnProb >= 0.7 ? 1 : 0);
      
      const recommendations = uiLanguage === "kh" ? [
        "សូមពិនិត្យមើលរបាយការណ៍លម្អិតនៅក្នុងផ្ទាំង AI Insights",
        "សួរសំណួរជាក់លាក់អំពី ស្តុក ឬ ការលក់ ដើម្បីទទួលបានការវិភាគលម្អិត"
      ] : [
        "Check the detailed analytics inside the AI Insights tab",
        "Ask specific questions about stock or sales for deeper analysis"
      ];

      return {
        kpis: [
          { icon: Sparkles, color: "#2563eb", labelKh: "ពិន្ទុសុខភាព", value: `${healthScore}/100`, labelEn: "Health Score" },
          { icon: AlertTriangle, color: "#c084fc", labelKh: "ហានិភ័យធ្ងន់ធ្ងរ", value: `${criticalRisksCount}`, labelEn: "Critical Risks" },
          { icon: DollarSign, color: "#f97316", labelKh: "ស្ថានភាពប្រព័ន្ធ", value: "98.2%", labelEn: "System Status" },
          { icon: CheckCircle, color: "#10b981", labelKh: "សុខភាពទូទៅ", value: healthScore >= 80 ? "Excellent" : healthScore >= 65 ? "Good" : "At Risk", labelEn: "Overall Health" }
        ],
        chartTitle: uiLanguage === "kh" ? "ពិន្ទុសុខភាពអាជីវកម្ម Business Health Score" : "Business Health Score",
        chartData: [
          { name: "Day 1", value: 88 },
          { name: "Day 2", value: 89 },
          { name: "Day 3", value: 91 },
          { name: "Day 4", value: 90 },
          { name: "Day 5", value: healthScore }
        ],
        recommendationsTitle: uiLanguage === "kh" ? "អនុសាសន៍ Recommendations" : "Recommendations",
        recommendations
      };
    }
  };

  const insightsData = getInsightsData();

  return (
    <div className={`ai-workspace-container ai-theme-${theme} ai-lang-${uiLanguage}`} style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Topbar full-width at the very top */}
      <header className="ai-topbar" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid var(--ai-border)",
        background: "var(--ai-panel)",
        height: "64px",
        boxSizing: "border-box",
        flexShrink: 0
      }}>
        {/* Topbar Left: Logo & Title & Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="icon-btn" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle sidebar" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ai-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Menu size={18} />
          </button>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #0bb3a3, #2563eb)",
            display: "grid",
            placeItems: "center",
            fontWeight: "900",
            color: "#fff",
            fontSize: "18px",
            boxShadow: "0 4px 10px rgba(11,179,163,0.3)"
          }}>
            T
          </div>
          <strong style={{ fontSize: "16px", color: "#fff", fontWeight: "800" }}>{t.title}</strong>
        </div>

        {/* Topbar Center: Segmented switcher */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            className={`segmented-button ${viewMode === "chat" ? "active" : ""}`}
            onClick={() => setViewMode("chat")}
            style={{
              padding: "6px 16px",
              border: "none",
              background: viewMode === "chat" ? "var(--ai-primary)" : "transparent",
              color: viewMode === "chat" ? "#06211e" : "var(--ai-muted)",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "13px",
              transition: "all 0.2s"
            }}
          >
            AI Chat
          </button>
          <button
            className={`segmented-button ${viewMode === "dashboard" ? "active" : ""}`}
            onClick={() => setViewMode("dashboard")}
            style={{
              padding: "6px 16px",
              border: "none",
              background: viewMode === "dashboard" ? "var(--ai-primary)" : "transparent",
              color: viewMode === "dashboard" ? "#06211e" : "var(--ai-muted)",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "13px",
              transition: "all 0.2s"
            }}
          >
            AI Insights
          </button>
        </div>

        {/* Topbar Right: Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Active Business Select */}
          <label className="shop-select" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ai-muted)" }}>
            <span style={{ fontWeight: "700" }}>{t.activeBusiness}</span>
            <select value={selectedShopId || "all"} onChange={handleShopChange} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
              padding: "4px 8px",
              fontSize: "12px",
              outline: "none"
            }}>
              <option value="all" style={{ background: "#111827" }}>
                {uiLanguage === "kh" ? "អាជីវកម្មទាំងមូល (ហាងទាំងអស់)" : "Whole Business (All Shops)"}
              </option>
              {accessibleShops.map((shop) => {
                const id = shop._id;
                const name = uiLanguage === "kh" ? shop.nameKh || shop.nameEn : shop.nameEn || shop.nameKh;
                return (
                  <option key={id} value={id} style={{ background: "#111827" }}>
                    {name || `Shop #${String(id).slice(0, 6)}`}
                  </option>
                );
              })}
            </select>
          </label>

          {/* Language Switch */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", color: "var(--ai-muted)", fontSize: "13px", fontWeight: "700" }} onClick={() => setLanguage(uiLanguage === "en" ? "kh" : "en")}>
            <Languages size={15} />
            <span>{uiLanguage === "en" ? "EN" : "KH"}</span>
          </div>

          {/* Toggle Insights Panel */}
          <button onClick={() => setInsightsPanelOpen(prev => !prev)} style={{ background: "transparent", border: "none", color: insightsPanelOpen ? "var(--ai-primary)" : "var(--ai-muted)", cursor: "pointer", display: "grid", placeItems: "center" }} title={uiLanguage === "kh" ? (insightsPanelOpen ? "លាក់លទ្ធផលវិភាគ" : "បង្ហាញលទ្ធផលវិភាគ") : (insightsPanelOpen ? "Hide AI Results" : "Show AI Results")}>
            <BarChart3 size={16} />
          </button>

          {/* Theme Toggle */}
          <button style={{ background: "transparent", border: "none", color: "var(--ai-muted)", cursor: "pointer", display: "grid", placeItems: "center" }} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User chip */}
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontSize: "13px",
            fontWeight: "bold",
            border: "1px solid rgba(255,255,255,0.15)"
          }} title={user?.nameEn || user?.nameKh || "User"}>
            {String(user?.nameEn || user?.nameKh || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main workspace body */}
      <div className="ai-workspace-body" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <aside className={`ai-shell-sidebar ${sidebarOpen ? "is-open" : "is-closed"}`} style={{ display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
          {/* New Chat Button */}
          <button className="new-chat-btn" onClick={handleNewChat} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", padding: "12px 14px", height: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", fontSize: "14px" }}>
              <Plus size={16} />
              <span>{uiLanguage === "kh" ? "សួរសំណួរថ្មី" : "New Chat"}</span>
            </div>
            <span style={{ fontSize: "10px", opacity: 0.8, fontWeight: "normal" }}>
              {uiLanguage === "kh" ? "New Chat" : ""}
            </span>
          </button>

          {/* Service Switcher */}
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

          {/* History Panel */}
          <div className="history-panel" style={{ flex: "none" }}>
            <div className="section-title" style={{ fontSize: "11px", fontWeight: "900", color: "var(--ai-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
              {uiLanguage === "kh" ? "ប្រវត្តិប្រើប្រាស់ History" : "History"}
            </div>
            <div className="history-list scrollbar-thin" style={{ maxHeight: "240px", overflowY: "auto" }}>
              {conversations.length ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`history-item-wrapper ${conversation._id === activeConversationId ? "active" : ""}`}
                  >
                    <button
                      className="history-item-btn"
                      onClick={() => loadConversation(conversation._id)}
                    >
                      <MessageSquare size={16} style={{ flexShrink: 0, color: "var(--ai-primary)" }} />
                      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "700" }}>
                          {conversation.title}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--ai-muted)", marginTop: "2px" }}>
                          {getRelativeTime(conversation.updatedAt)}
                        </span>
                      </div>
                    </button>
                    <button
                      className="delete-history-btn"
                      onClick={(e) => handleDeleteConversation(e, conversation._id)}
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
            {/* View All Button */}
            <button style={{
              width: "100%",
              padding: "8px",
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "var(--ai-muted)",
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "center",
              marginTop: "8px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
            >
              {uiLanguage === "kh" ? "មើលទាំងអស់ View All" : "View All"}
            </button>
          </div>

          {/* Example Questions Section */}
          <div className="example-questions-panel" style={{ marginTop: "10px", borderTop: "1px solid var(--ai-border)", paddingTop: "16px" }}>
            <div className="section-title" style={{ fontSize: "11px", fontWeight: "900", color: "var(--ai-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
              {uiLanguage === "kh" ? "ឧទាហរណ៍សំណួរ Example Questions" : "Example Questions"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {exampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q.prompt)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    color: "#f8fafc",
                    textAlign: "left",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = q.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: `${q.color}20`,
                    color: q.color,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0
                  }}>
                    <q.icon size={15} />
                  </div>
                  <span style={{ fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {uiLanguage === "kh" ? q.textKh : q.textEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Workspace Main content */}
        <main className="ai-shell-main" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {viewMode === "dashboard" ? (
            <Box sx={{ p: 3, overflowY: "auto", height: "calc(100vh - 70px)", width: "100%", boxSizing: "border-box" }}>
              <AiInsightsDashboard tenantId={user?.tenantId?._id || user?.tenantId} language={uiLanguage} />
            </Box>
          ) : (
            <div className="ai-workspace-content-columns" style={{ display: "flex", flex: 1, overflow: "hidden", background: "var(--ai-bg)" }}>
              {/* Middle Column: Chat */}
              <div className="ai-chat-column" style={{
                flex: 3,
                display: "flex",
                flexDirection: "column",
                borderRight: insightsPanelOpen ? "1px solid var(--ai-border)" : "none",
                overflow: "hidden",
                padding: "20px",
                boxSizing: "border-box"
              }}>
                {/* Chat Column Subheader */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#fff", margin: 0 }}>AI Chat</h2>
                    <p style={{ fontSize: "11px", color: "var(--ai-muted)", margin: "4px 0 0" }}>
                      {uiLanguage === "kh" ? "សួរសំណួរឆ្លើយឆ្លើយជាមួយ TerraLink AI" : "Chat and inquire with TerraLink AI"}
                    </p>
                  </div>
                  
                  {!insightsPanelOpen && (
                    <button
                      onClick={() => setInsightsPanelOpen(true)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--ai-border)",
                        background: "rgba(255,255,255,0.03)",
                        color: "var(--ai-primary)",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <BarChart3 size={14} />
                      <span>{uiLanguage === "kh" ? "បង្ហាញលទ្ធផល AI" : "Show AI Results"}</span>
                    </button>
                  )}
                </div>

                <div ref={threadRef} className="chat-thread scrollbar-thin" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", border: "none", background: "transparent", padding: 0, boxShadow: "none" }}>
                  {chatMessages.length === 0 && (
                    <div className="empty-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "40px 20px", margin: "auto" }}>
                      <Sparkles size={40} style={{ color: "var(--ai-primary)" }} />
                      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", margin: "16px 0 8px" }}>
                        {uiLanguage === "kh" ? "សូមស្វាគមន៍មកកាន់ TerraLink AI" : "Welcome to TerraLink AI"}
                      </h2>
                      <p style={{ color: "var(--ai-muted)", fontSize: "14px", marginBottom: "24px", textAlign: "center" }}>
                        {uiLanguage === "kh" ? "ជ្រើសរើសជម្រើសវិភាគខាងឆ្វេង ឬសួរអ្វីក៏បានពី Gemini" : "Choose an analysis option on the left or ask Gemini anything"}
                      </p>
                    </div>
                  )}

                  {chatMessages.map((msg, index) => {
                    return (
                      <div key={`${msg.role}-${index}`} className={`chat-message-group ${msg.role}`} style={{ display: "flex", flexDirection: "column", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", width: "100%", maxWidth: "85%" }}>
                        {/* Message Timestamp */}
                        <span className="message-timestamp" style={{ fontSize: "10px", color: "var(--ai-muted)", marginBottom: "4px", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", paddingLeft: msg.role === "user" ? "0" : "48px", paddingRight: msg.role === "user" ? "48px" : "0" }}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "10:30 AM"}
                        </span>
                        
                        <div className={`chat-message ${msg.role}`} style={{ display: "flex", gap: "12px", flexDirection: msg.role === "user" ? "row-reverse" : "row", width: "100%" }}>
                          <div className="message-avatar" style={{
                            borderRadius: "50%",
                            background: msg.role === "user" ? "var(--ai-primary)" : "linear-gradient(135deg, #0bb3a3, #2563eb)",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "14px",
                            width: "36px",
                            height: "36px",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0
                          }}>
                            {msg.role === "user" ? "U" : "T"}
                          </div>
                          
                          <div className="message-card" style={{
                            textAlign: "left",
                            background: msg.role === "user" ? "var(--ai-primary)" : "var(--ai-panel)",
                            color: msg.role === "user" ? "#06211e" : "#f8fafc",
                            border: msg.role === "user" ? "none" : "1px solid var(--ai-border)",
                            borderRadius: "18px",
                            padding: "16px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            flex: 1,
                            minWidth: 0
                          }}>
                            {msg.role === "assistant" ? (
                              <FormattedAnswer content={msg.content} />
                            ) : (
                              <p className="plain-user-message" style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                            )}

                            {msg.businessAIResult && msg.businessAIResult !== "null" && (
                              <details className="business-data-preview" style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
                                <summary style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--ai-muted)", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                                  <CheckCircle size={12} />
                                  {t.sourceData}
                                </summary>
                                <pre style={{ maxHeight: "150px", overflowY: "auto", margin: "8px 0 0", padding: "10px", background: "#020617", color: "#67e8f9", fontSize: "11px", borderRadius: "8px" }}>{msg.businessAIResult}</pre>
                              </details>
                            )}

                            {/* AI assistant message footer options */}
                            {msg.role === "assistant" && (
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px" }}>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    onClick={() => sendMessage(uiLanguage === "kh" ? "សូមពន្យល់ពីរបាយការណ៍នេះលម្អិតបន្ថែម។" : "Explain this analytics report in more detail.")}
                                    style={{
                                      padding: "4px 10px",
                                      borderRadius: "999px",
                                      border: "1px solid rgba(255,255,255,0.08)",
                                      background: "rgba(255,255,255,0.02)",
                                      color: "var(--ai-muted)",
                                      fontSize: "11px",
                                      cursor: "pointer",
                                      transition: "all 0.2s"
                                    }}
                                  >
                                    {uiLanguage === "kh" ? "💡 ពន្យល់លម្អិត" : "💡 Explain Detail"}
                                  </button>
                                  <button
                                    onClick={() => sendMessage(uiLanguage === "kh" ? "តើមានសកម្មភាពអាទិភាពអ្វីខ្លះដែលខ្ញុំត្រូវធ្វើ?" : "What are the priority actions I need to take?")}
                                    style={{
                                      padding: "4px 10px",
                                      borderRadius: "999px",
                                      border: "1px solid rgba(255,255,255,0.08)",
                                      background: "rgba(255,255,255,0.02)",
                                      color: "var(--ai-muted)",
                                      fontSize: "11px",
                                      cursor: "pointer",
                                      transition: "all 0.2s"
                                    }}
                                  >
                                    {uiLanguage === "kh" ? "🎯 សកម្មភាពអាទិភាព" : "🎯 Priority Actions"}
                                  </button>
                                </div>

                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button onClick={() => handleCopyText(msg.content)} style={{ background: "transparent", border: "none", color: "var(--ai-muted)", cursor: "pointer", padding: "4px" }} title="Copy Response">
                                    <Copy size={13} />
                                  </button>
                                  <button style={{ background: "transparent", border: "none", color: "var(--ai-muted)", cursor: "pointer", padding: "4px" }} title="Like">
                                    <ThumbsUp size={13} />
                                  </button>
                                  <button style={{ background: "transparent", border: "none", color: "var(--ai-muted)", cursor: "pointer", padding: "4px" }} title="Dislike">
                                    <ThumbsDown size={13} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {aiLoading && (
                    <div className="chat-message assistant" style={{ display: "flex", gap: "12px", width: "100%", alignSelf: "flex-start" }}>
                      <div className="message-avatar spinning" style={{ borderRadius: "50%", background: "linear-gradient(135deg, #0bb3a3, #2563eb)", color: "#fff", width: "36px", height: "36px", display: "grid", placeItems: "center" }}>
                        <RefreshCw size={14} className="spinning" />
                      </div>
                      <div className="message-card loading-card" style={{ background: "var(--ai-panel)", border: "1px solid var(--ai-border)", borderRadius: "18px", padding: "16px", flex: 1 }}>{t.loading}</div>
                    </div>
                  )}
                </div>

                {activeService === "gemini" && (
                  <div className="gemini-permission" style={{ margin: "10px 0" }}>
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

                {/* Chat Composer */}
                <form
                  className="chat-composer"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid var(--ai-border)",
                    borderRadius: "16px",
                    background: "var(--ai-panel)",
                    padding: "10px",
                    position: "relative",
                    marginTop: "12px"
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
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "var(--ai-text)",
                      width: "100%",
                      resize: "none",
                      fontSize: "13px",
                      padding: "4px 8px",
                      minHeight: "40px"
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                    <button type="button" style={{ background: "transparent", border: "none", color: "var(--ai-muted)", cursor: "pointer", padding: "4px" }} title="Attach files">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    </button>
                    <button type="submit" disabled={aiLoading || !inputMessage.trim()} style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--ai-primary)",
                      color: "#06211e",
                      border: "none",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      opacity: aiLoading || !inputMessage.trim() ? 0.6 : 1,
                      transition: "all 0.2s"
                    }}>
                      {aiLoading ? <RefreshCw size={14} className="spinning" /> : <Send size={14} />}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: AI Response Result */}
              {insightsPanelOpen && (
                <div className="ai-insights-column scrollbar-thin" style={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  padding: "20px",
                  boxSizing: "border-box",
                  background: "rgba(0,0,0,0.15)"
                }}>
                  {/* Insights Column Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                    <div>
                      <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#fff", margin: 0 }}>
                        {uiLanguage === "kh" ? "លទ្ធផលឆ្លើយតប AI" : "AI Response Result"}
                      </h2>
                      <p style={{ fontSize: "11px", color: "var(--ai-muted)", margin: "4px 0 0" }}>
                        {uiLanguage === "kh" ? "ការវិភាគ និងការរកឃើញពី AI" : "Analysis and findings from AI"}
                      </p>
                    </div>
                    <button
                      onClick={() => setInsightsPanelOpen(false)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--ai-muted)",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--ai-muted)"}
                      title={uiLanguage === "kh" ? "លាក់លទ្ធផល" : "Hide Results"}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Summary / សង្ខេបសហគ្រាស */}
                  <div style={{ fontSize: "12px", color: "var(--ai-muted)", fontWeight: "bold", textTransform: "uppercase", marginTop: "10px" }}>
                    {uiLanguage === "kh" ? "សង្ខេបសហគ្រាស Summary" : "Summary"}
                  </div>
                  
                  {/* Summary KPI Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "14px 0" }}>
                    {insightsData.kpis.map((kpi, kIdx) => (
                      <div key={kIdx} style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "12px",
                        padding: "14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        minHeight: "100px",
                        boxSizing: "border-box"
                      }}>
                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: `${kpi.color}15`,
                          color: kpi.color,
                          display: "grid",
                          placeItems: "center"
                        }}>
                          <kpi.icon size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--ai-muted)", fontWeight: "bold" }}>{kpi.labelKh}</div>
                          <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff", margin: "4px 0" }}>{kpi.value}</div>
                          <div style={{ fontSize: "10px", color: "var(--ai-muted)" }}>{kpi.labelEn}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trend Chart / ក្រាបនិន្នាការ */}
                  <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    padding: "16px",
                    margin: "14px 0",
                    height: "220px",
                    boxSizing: "border-box"
                  }}>
                    <div style={{ fontSize: "12px", color: "var(--ai-muted)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "12px" }}>
                      {insightsData.chartTitle}
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                      <LineChart data={insightsData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                        <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                        <Line type="monotone" dataKey="value" stroke="var(--ai-primary)" strokeWidth={2} dot={{ r: 4, fill: "var(--ai-primary)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recommendations / អនុសាសន៍ */}
                  <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    padding: "16px",
                    position: "relative",
                    minHeight: "120px",
                    boxSizing: "border-box"
                  }}>
                    <div style={{ fontSize: "12px", color: "var(--ai-muted)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "12px" }}>
                      {insightsData.recommendationsTitle}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "16px", display: "grid", gap: "8px", fontSize: "12px", color: "#f8fafc" }}>
                      {insightsData.recommendations.map((rec, rIdx) => (
                        <li key={rIdx} style={{ lineHeight: "1.5" }}>{rec}</li>
                      ))}
                    </ul>
                    <button style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(11, 179, 163, 0.15)",
                      color: "var(--ai-primary)",
                      border: "none",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer"
                    }} title="Mark as Favorite">
                      <Star size={14} fill="var(--ai-primary)" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
