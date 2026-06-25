import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import {
  Send, Sparkles, Plus, Trash2, MessageSquare, Bot, User,
  TrendingUp, Warehouse, Brain, LineChart, Target, AlertTriangle,
  Lightbulb, ClipboardList, Info, CheckCircle2, Menu, X, Star, Zap, Shield, Mountain, BarChart3
} from "lucide-react";
import {
  GET_CHAT_CONVERSATIONS,
  GET_CHAT_CONVERSATION_BY_ID,
  AI_BUSINESS_CHAT
} from "../../graphql/queries";
import {
  CREATE_CHAT_CONVERSATION,
  ADD_CHAT_MESSAGE,
  DELETE_CHAT_CONVERSATION,
  CLEAR_ALL_CHAT_CONVERSATIONS
} from "../../graphql/mutation";
import "../Styles/ChatBot.css";

const modelOptions = [
  { value: "auto", label: { en: "Auto Select", kh: "ស្វ័យប្រវត្តិ" } },
  { value: "customer_churn", label: { en: "Customer Retention", kh: "ការរក្សាអតិថិជន" } },
  { value: "employee_performance", label: { en: "Employee Performance", kh: "ប្រសិទ្ធភាពបុគ្គលិក" } },
  { value: "sales_forecast", label: { en: "Sales Forecast", kh: "ការព្យាករណ៍លក់" } },
  { value: "inventory_optimization", label: { en: "Inventory Health", kh: "សុខភាពស្តុក" } },
  { value: "all", label: { en: "Full Business Report", kh: "របាយការណ៍អាជីវកម្ម" } },
  { value: "customer_behavior", label: { en: "Customer Behavior", kh: "ឥរិយាបថអតិថិជន" } },
  { value: "marketing_performance", label: { en: "Marketing Performance", kh: "ប្រសិទ្ធភាពទីផ្សារ" } },
  { value: "profitability_analysis", label: { en: "Profitability Analysis", kh: "ការវិភាគប្រាក់ចំណេញ" } },
  { value: "risk_analysis", label: { en: "Risk Analysis", kh: "ការវិភាគហានិភ័យ" } },
  { value: "growth_opportunities", label: { en: "Growth Opportunities", kh: "ឱកាសលូតលាស់" } },
  { value: "operations_advisor", label: { en: "Operations Advisor", kh: "ទីប្រឹក្សាប្រតិបត្តិការ" } },
  { value: "product_performance", label: { en: "Product Performance", kh: "ប្រសិទ្ធភាពផលិតផល" } },
  { value: "customer_product_recommendation", label: { en: "Product Risk & Performance", kh: "ហានិភ័យ និងប្រសិទ្ធភាពផលិតផល" } },
];

const promptCards = [
  {
    title: { en: "I'm new — teach me", kh: "ខ្ញុំទើបតែចាប់ផ្តើម - បង្រៀនខ្ញុំ" },
    desc: { en: "I'm a complete beginner. Teach me what I need to understand first, step by step.", kh: "ខ្ញុំជាអ្នកចាប់ផ្តើមដំបូងបង្អស់។ បង្រៀនខ្ញុំពីអ្វីដែលខ្ញុំត្រូវយល់ដឹងជាមុន ជំហានម្តងៗ។" },
    icon: <Star size={18} />,
    colorClass: "chatbot-prompt-card__icon--gold",
    prompt: {
      en: "I'm a complete beginner. Teach me what I need to understand first, step by step.",
      kh: "ខ្ញុំជាអ្នកចាប់ផ្តើមដំបូងបង្អស់។ បង្រៀនខ្ញុំពីអ្វីដែលខ្ញុំត្រូវយល់ដឹងជាមុន ជំហានម្តងៗ។"
    },
    model: "all"
  },
  {
    title: { en: "Explain a concept", kh: "ពន្យល់អំពីគោលគំនិត" },
    desc: { en: "Explain what profit margin and break-even are, with a simple real-life example", kh: "ពន្យល់ពីអ្វីទៅជាប្រាក់ចំណេញសុទ្ធ និងចំណុចរួចខ្លួន ជាមួយឧទាហរណ៍ជាក់ស្តែងដ៏សាមញ្ញមួយ" },
    icon: <Zap size={18} />,
    colorClass: "chatbot-prompt-card__icon--blue",
    prompt: {
      en: "Explain what profit margin and break-even are, with a simple real-life example",
      kh: "ពន្យល់ពីអ្វីទៅជាប្រាក់ចំណេញសុទ្ធ និងចំណុចរួចខ្លួន ជាមួយឧទាហរណ៍ជាក់ស្តែងដ៏សាមញ្ញមួយ"
    },
    model: "profitability_analysis"
  },
  {
    title: { en: "Risk management", kh: "ការគ្រប់គ្រងហានិភ័យ" },
    desc: { en: "How do I manage business risk if my capital is $5,000 and I want to minimize losses?", kh: "តើខ្ញុំត្រូវគ្រប់គ្រងហានិភ័យអាជីវកម្មយ៉ាងដូចម្តេច ប្រសិនបើដើមទុនរបស់ខ្ញុំគឺ $5,000 ហើយខ្ញុំចង់កាត់បន្ថយការខាតបង់?" },
    icon: <Shield size={18} />,
    colorClass: "chatbot-prompt-card__icon--green",
    prompt: {
      en: "How do I manage business risk if my capital is $5,000 and I want to minimize losses?",
      kh: "តើខ្ញុំត្រូវគ្រប់គ្រងហានិភ័យអាជីវកម្មយ៉ាងដូចម្តេច ប្រសិនបើដើមទុនរបស់ខ្ញុំគឺ $5,000 ហើយខ្ញុំចង់កាត់បន្ថយការខាតបង់?"
    },
    model: "risk_analysis"
  },
  {
    title: { en: "Market outlook", kh: "ទស្សនវិស័យទីផ្សារ" },
    desc: { en: "What is the current business environment and what should I focus on today?", kh: "តើបរិយាកាសអាជីវកម្មបច្ចុប្បន្នជាអ្វី ហើយតើខ្ញុំគួរផ្តោតលើអ្វីនៅថ្ងៃនេះ?" },
    icon: <Mountain size={18} />,
    colorClass: "chatbot-prompt-card__icon--purple",
    prompt: {
      en: "What is the current business environment and what should I focus on today?",
      kh: "តើបរិយាកាសអាជីវកម្មបច្ចុប្បន្នជាអ្វី ហើយតើខ្ញុំគួរផ្តោតលើអ្វីនៅថ្ងៃនេះ?"
    },
    model: "sales_forecast"
  },
  {
    title: { en: "Improve my business", kh: "កែលម្អអាជីវកម្មរបស់ខ្ញុំ" },
    desc: { en: "What are the most common mistakes that make businesses lose money?", kh: "តើអ្វីទៅជាកំហុសទូទៅបំផុតដែលធ្វើឱ្យអាជីវកម្មខាតបង់ប្រាក់?" },
    icon: <TrendingUp size={18} />,
    colorClass: "chatbot-prompt-card__icon--gold",
    prompt: {
      en: "What are the most common mistakes that make businesses lose money?",
      kh: "តើអ្វីទៅជាកំហុសទូទៅបំផុតដែលធ្វើឱ្យអាជីវកម្មខាតបង់ប្រាក់?"
    },
    model: "growth_opportunities"
  },
  {
    title: { en: "Customer retention risk", kh: "ហានិភ័យបាត់បង់អតិថិជន" },
    desc: { en: "Identify which customers are at risk of leaving and get recommendations to retain them.", kh: "ស្វែងរកអតិថិជនណាខ្លះដែលមានហានិភ័យនៃការឈប់ទិញទំនិញ និងវិធីសាស្ត្ររក្សាពួកគេ។" },
    icon: <BarChart3 size={18} />,
    colorClass: "chatbot-prompt-card__icon--blue",
    prompt: {
      en: "Analyze customer churn risk and suggest concrete customer retention strategies based on purchase history.",
      kh: "វិភាគហានិភ័យបាត់បង់អតិថិជន និងផ្តល់អនុសាសន៍រក្សាអតិថិជនដោយផ្អែកលើប្រវត្តិទិញទំនិញ។"
    },
    model: "customer_churn"
  }
];

const uiText = {
  en: {
    advisor: "TerraLink Business Advisor",
    subtitle: "Ask business questions and get clear decisions, risks, causes, and next actions.",
    intro: "Hello. Ask me what is happening in your business, what needs attention, and what action you should take next.",
    helper: "Ask in simple language. The advisor will translate business signals into owner-friendly recommendations.",
    placeholder: "Ask about sales, low stock, churn risk, employee performance, or product analysis...",
    businessDecision: "Business decision summary",
    health: "Business health",
    supportingSignals: "Supporting Business Signals",
    noShop: "No active shop",
    model: "Model",
    analysis: "Analysis",
    confidence: "confidence",
    risk: "risk",
    action: "action",
    loading: "Preparing business advice...",
  },
  kh: {
    advisor: "ទីប្រឹក្សាអាជីវកម្ម TerraLink",
    subtitle: "សួរសំណួរអាជីវកម្ម ហើយទទួលបានសេចក្តីសម្រេច ហានិភ័យ មូលហេតុ និងសកម្មភាពបន្ទាប់។",
    intro: "សួស្តី។ សួរខ្ញុំអំពីអ្វីកំពុងកើតឡើងក្នុងអាជីវកម្មរបស់អ្នក អ្វីត្រូវយកចិត្តទុកដាក់ និងអ្វីគួរធ្វើបន្ទាប់។",
    helper: "សួរជាភាសាសាមញ្ញ។ ទីប្រឹក្សានឹងបម្លែងសញ្ញាអាជីវកម្មទៅជាអនុសាសន៍ងាយយល់។",
    placeholder: "សួរអំពីការលក់ ស្តុកទាប ហានិភ័យបាត់បង់អតិថិជន ប្រសិទ្ធភាពបុគ្គលិក ឬការវិភាគផលិតផល...",
    businessDecision: "សេចក្តីសម្រេចសម្រាប់អាជីវកម្ម",
    health: "សុខភាពអាជីវកម្ម",
    supportingSignals: "សញ្ញាគាំទ្រអាជីវកម្ម",
    noShop: "មិនមានហាងសកម្ម",
    model: "ផ្នែកវិភាគ",
    analysis: "ការវិភាគ",
    confidence: "ភាពជឿជាក់",
    risk: "ហានិភ័យ",
    action: "សកម្មភាព",
    loading: "កំពុងរៀបចំអនុសាសន៍អាជីវកម្ម...",
  },
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getActiveShopId = () => {
  const activeShopId = localStorage.getItem("activeShopId");
  if (activeShopId) return activeShopId;

  const user = getStoredUser();
  const firstShop = user?.shopIds?.[0];
  return firstShop?._id || firstShop || "";
};

const parseBusinessAIResult = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const prettyJson = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
};

const businessAreaLabels = {
  chat: { en: "Chat", kh: "Chat" },
  customer_churn: { en: "Customer Retention", kh: "ការរក្សាអតិថិជន" },
  customerChurn: { en: "Customer Retention", kh: "ការរក្សាអតិថិជន" },
  employee_performance: { en: "Employee Performance", kh: "ប្រសិទ្ធភាពបុគ្គលិក" },
  employeePerformance: { en: "Employee Performance", kh: "ប្រសិទ្ធភាពបុគ្គលិក" },
  inventory_optimization: { en: "Inventory Health", kh: "សុខភាពស្តុក" },
  inventoryOptimization: { en: "Inventory Health", kh: "សុខភាពស្តុក" },
  sales_forecast: { en: "Sales Forecast", kh: "ការព្យាករណ៍លក់" },
  salesForecast: { en: "Sales Forecast", kh: "ការព្យាករណ៍លក់" },
  all: { en: "Full Business Report", kh: "របាយការណ៍អាជីវកម្ម" },
  customer_behavior: { en: "Customer Behavior", kh: "ឥរិយាបថអតិថិជន" },
  marketing_performance: { en: "Marketing Performance", kh: "ប្រសិទ្ធភាពទីផ្សារ" },
  profitability_analysis: { en: "Profitability Analysis", kh: "ការវិភាគប្រាក់ចំណេញ" },
  risk_analysis: { en: "Risk Analysis", kh: "ការវិភាគហានិភ័យ" },
  growth_opportunities: { en: "Growth Opportunities", kh: "ឱកាសលូតលាស់" },
  operations_advisor: { en: "Operations Advisor", kh: "ទីប្រឹក្សាប្រតិបត្តិការ" },
  product_performance: { en: "Product Performance", kh: "ប្រសិទ្ធភាពផលិតផល" },
  customer_product_recommendation: { en: "Product Risk & Performance", kh: "ហានិភ័យ និងប្រសិទ្ធភាពផលិតផល" },
  customerProductRecommendation: { en: "Product Risk & Performance", kh: "ហានិភ័យ និងប្រសិទ្ធភាពផលិតផល" },
};

const getLabel = (label, language = "en") => {
  if (!label) return "";
  if (typeof label === "string") return label;
  return label[language] || label.en || "";
};

const toBusinessArea = (value, language = "en") =>
  getLabel(businessAreaLabels[value], language) || value || (language === "kh" ? "ផ្នែកអាជីវកម្ម" : "Business Area");

const sectionNames = [
  "Summary",
  "Key Findings",
  "Business Impact",
  "Recommendations",
  "Priority Level",
  "Data Needed",
  "Executive Summary",
  "Critical Alerts",
  "Opportunities",
  "Business Analysis Table",
  "Recommended Actions",
  "AI Advisor Recommendation",
  "Risk Level",
  "Next Actions",
  "Clarifying Questions",
  "Follow-up Questions",
];

const parseStructuredAnswer = (content = "") => {
  const sections = [];
  let current = { title: "Answer", lines: [] };

  content.split("\n").forEach((line) => {
    const cleanLine = line.replace(/\*\*/g, "").replace(/^#+\s*/, "").trim();
    const matchedTitle = sectionNames.find((title) =>
      new RegExp(`^${title}\\s*:?$`, "i").test(cleanLine)
    );

    if (matchedTitle) {
      if (current.lines.some(Boolean)) sections.push(current);
      current = { title: matchedTitle, lines: [] };
      return;
    }

    current.lines.push(line);
  });

  if (current.lines.some(Boolean)) sections.push(current);
  return sections.length ? sections : [{ title: "Answer", lines: [content] }];
};

const formatLine = (line) => line.replace(/^\s*[-*]\s*/, "").replace(/^\s*\d+\.\s*/, "").trim();

const isListSection = (title) =>
  [
    "Key Findings",
    "Critical Alerts",
    "Opportunities",
    "Recommended Actions",
    "Recommendations",
    "Next Actions",
    "Data Needed",
    "Clarifying Questions",
    "Follow-up Questions",
  ].includes(title);

const isTableSection = (title) => title === "Business Analysis Table";

const extractHealthScore = (content = "") => {
  const match = content.match(/Business Health Score:\s*(\d{1,3})\s*\/\s*100/i);
  if (!match) return null;
  return Math.max(0, Math.min(100, Number(match[1])));
};

const removeReportNoise = (line) =>
  line
    .replace(/^#\s*TerraLink AI Business Report\s*$/i, "")
    .replace(/Business Health Score:\s*\d{1,3}\s*\/\s*100/i, "")
    .trim();

const getBusinessItems = (result) => {
  if (!result || typeof result !== "object") return [];
  if (result.model) return [result];
  return Object.entries(result)
    .map(([key, value]) => (value && typeof value === "object" ? { key, ...value } : null))
    .filter(Boolean);
};

const getRiskColor = (risk) => {
  const value = String(risk || "").toLowerCase();
  if (["high", "critical", "urgent"].includes(value)) return "high";
  if (["medium", "normal"].includes(value)) return "medium";
  if (["low", "ok"].includes(value)) return "low";
  return "low";
};

const sectionMeta = {
  Summary: { icon: Info },
  "Key Findings": { icon: ClipboardList },
  "Business Impact": { icon: TrendingUp },
  Recommendations: { icon: Target },
  "Priority Level": { icon: AlertTriangle },
  "Data Needed": { icon: Lightbulb },
  "Executive Summary": { icon: Info },
  "Critical Alerts": { icon: AlertTriangle },
  Opportunities: { icon: Lightbulb },
  "Recommended Actions": { icon: Target },
  "AI Advisor Recommendation": { icon: CheckCircle2 },
  "Clarifying Questions": { icon: Info },
  "Follow-up Questions": { icon: Info },
};

const sectionTitleLabels = {
  Summary: { en: "Summary", kh: "សង្ខេប" },
  "Key Findings": { en: "Key Findings", kh: "ចំណុចសំខាន់ៗ" },
  "Business Impact": { en: "Business Impact", kh: "ផលប៉ះពាល់អាជីវកម្ម" },
  Recommendations: { en: "Recommendations", kh: "អនុសាសន៍" },
  "Priority Level": { en: "Priority Level", kh: "កម្រិតអាទិភាព" },
  "Data Needed": { en: "Data Needed", kh: "ទិន្នន័យត្រូវការ" },
  "Executive Summary": { en: "Executive Summary", kh: "សេចក្តីសង្ខេបសម្រាប់ម្ចាស់អាជីវកម្ម" },
  "Critical Alerts": { en: "Critical Alerts", kh: "ការជូនដំណឹងបន្ទាន់" },
  Opportunities: { en: "Opportunities", kh: "ឱកាស" },
  "Recommended Actions": { en: "Recommended Actions", kh: "សកម្មភាពណែនាំ" },
  "AI Advisor Recommendation": { en: "AI Advisor Recommendation", kh: "អនុសាសន៍ពីទីប្រឹក្សា" },
  "Risk Level": { en: "Risk Level", kh: "កម្រិតហានិភ័យ" },
  "Next Actions": { en: "Next Actions", kh: "សកម្មភាពបន្ទាប់" },
  "Clarifying Questions": { en: "Clarifying Questions", kh: "សំណួរបំភ្លឺបន្ថែម" },
  "Follow-up Questions": { en: "Follow-up Questions", kh: "សំណួរតាមដាន" },
};

const displaySectionTitle = (title, language = "en") => getLabel(sectionTitleLabels[title], language) || title;

const SectionIcon = ({ title }) => {
  const Icon = sectionMeta[title]?.icon || Info;
  return <Icon size={18} />;
};

const extractPriority = (content = "") => {
  const match = content.match(/Priority Level\s*:?\s*(Critical|High|Medium|Low)/i);
  if (match) return match[1];

  const line = content
    .split("\n")
    .map((item) => item.trim())
    .find((item) => /^(Critical|High|Medium|Low)$/i.test(item));

  return line || null;
};

const riskToScore = (risk) => {
  const value = String(risk || "").toLowerCase();
  if (value === "critical") return 100;
  if (value === "high" || value === "urgent") return 82;
  if (value === "medium" || value === "normal") return 55;
  if (value === "low" || value === "ok") return 22;
  return 35;
};

const barColor = (score) => {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  return "#22c55e";
};

const formatRelativeTime = (dateStr, lang) => {
  if (!dateStr) return "";
  const date = new Date(Number(dateStr) || dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (lang === "kh") {
    if (diffMins < 1) return "មុននេះបន្តិច";
    if (diffMins < 60) return `មុននេះ ${diffMins} នាទី`;
    if (diffHours < 24) return `មុននេះ ${diffHours} ម៉ោង`;
    if (diffDays === 1) return "ម្សិលមិញ";
    if (diffDays < 7) return `មុននេះ ${diffDays} ថ្ងៃ`;
    return date.toLocaleDateString("km-KH");
  } else {
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US");
  }
};

export default function ChatBot() {
  const apolloClient = useApolloClient();
  const [input, setInput] = useState("");
  const [model, setModel] = useState("auto");
  const [language, setLanguage] = useState(() => localStorage.getItem("aiAdvisorLanguage") || "en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);

  const shopId = useMemo(() => getActiveShopId(), []);
  const threadEndRef = useRef(null);

  // Queries
  const { data: listData, loading: listLoading, refetch: refetchList } = useQuery(
    GET_CHAT_CONVERSATIONS,
    {
      variables: { limit: 50 },
      fetchPolicy: "network-only"
    }
  );

  const { data: activeConvData, refetch: refetchActiveConv } = useQuery(
    GET_CHAT_CONVERSATION_BY_ID,
    {
      variables: { id: activeConversationId },
      skip: !activeConversationId,
      fetchPolicy: "network-only"
    }
  );

  // Mutations
  const [createConversation] = useMutation(CREATE_CHAT_CONVERSATION);
  const [addChatMessage] = useMutation(ADD_CHAT_MESSAGE);
  const [deleteConversation] = useMutation(DELETE_CHAT_CONVERSATION);
  const [clearAllChatConversations] = useMutation(CLEAR_ALL_CHAT_CONVERSATIONS);

  // Synchronize database messages to localMessages on load/selection
  useEffect(() => {
    if (activeConversationId && activeConvData?.getChatConversationById?.messages) {
      setLocalMessages(activeConvData.getChatConversationById.messages);
    } else if (!activeConversationId) {
      setLocalMessages([
        {
          role: "assistant",
          content: uiText[language].intro,
          plain: true
        }
      ]);
    }
  }, [activeConvData, activeConversationId, language]);

  // Handle scroll to bottom
  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, aiLoading]);

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    const promptText = language === "kh" 
      ? "តើអ្នកពិតជាចង់លុបការសន្ទនានេះមែនទេ?" 
      : "Are you sure you want to delete this conversation?";
    if (window.confirm(promptText)) {
      try {
        await deleteConversation({ variables: { _id: convId } });
        if (activeConversationId === convId) {
          setActiveConversationId(null);
        }
        refetchList();
      } catch (err) {
        console.error("Delete conversation error:", err);
      }
    }
  };

  const handleClearAllConversations = async () => {
    const promptText = language === "kh" 
      ? "តើអ្នកពិតជាចង់លុបការសន្ទនាទាំងអស់មែនទេ?" 
      : "Are you sure you want to clear all chat history?";
    if (window.confirm(promptText)) {
      try {
        await clearAllChatConversations();
        setActiveConversationId(null);
        refetchList();
      } catch (err) {
        console.error("Clear all error:", err);
      }
    }
  };

  const sendMessage = async (messageText = input, overrideModel = model) => {
    const question = (typeof messageText === "string" ? messageText : "").trim();
    if (!question || aiLoading) return;

    setInput("");
    setSidebarOpen(false);

    // 1. Add user message locally
    const tempUserMsg = {
      role: "user",
      content: question,
      createdAt: new Date().toISOString()
    };
    setLocalMessages(prev => [...prev, tempUserMsg]);
    setAiLoading(true);

    try {
      let currentConvId = activeConversationId;

      // 2. Create conversation if not selected
      if (!currentConvId) {
        const createRes = await createConversation({
          variables: {
            title: "New conversation",
            shopId: shopId || null
          }
        });
        if (createRes.data?.createChatConversation?.isSuccess) {
          currentConvId = createRes.data.createChatConversation.data.conversationId;
          setActiveConversationId(currentConvId);
        } else {
          throw new Error("Failed to create conversation");
        }
      }

      // 3. Persist user message in DB
      await addChatMessage({
        variables: {
          conversationId: currentConvId,
          role: "user",
          content: question
        }
      });

      // 4. Extract conversation history context for AI input (last 6 messages)
      const recentHistory = localMessages
        .filter(m => m.content !== uiText[language].intro)
        .slice(-6)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      // 5. Query the AI Business Chat
      const aiRes = await apolloClient.query({
        query: AI_BUSINESS_CHAT,
        variables: {
          input: {
            message: question,
            model: overrideModel === "auto" ? null : overrideModel,
            shopId: shopId || null,
            language,
            conversationHistory: recentHistory
          }
        },
        fetchPolicy: "network-only"
      });

      const aiResult = aiRes.data.aiBusinessChat;

      // 6. Save assistant message in DB
      await addChatMessage({
        variables: {
          conversationId: currentConvId,
          role: "assistant",
          content: aiResult.answer,
          model: aiResult.model,
          businessAIStatus: aiResult.businessAIStatus,
          businessAIRoute: aiResult.businessAIRoute,
          businessAIResult: aiResult.businessAIResult,
          error: aiResult.error,
          plain: aiResult.businessAIStatus === "chat"
        }
      });

      // 7. Update local state
      const tempAssistantMsg = {
        role: "assistant",
        content: aiResult.answer,
        model: aiResult.model,
        businessAIStatus: aiResult.businessAIStatus,
        businessAIRoute: aiResult.businessAIRoute,
        businessAIResult: aiResult.businessAIResult,
        error: aiResult.error,
        plain: aiResult.businessAIStatus === "chat",
        createdAt: new Date().toISOString()
      };
      setLocalMessages(prev => [...prev, tempAssistantMsg]);

      // 8. Sync Apollo state
      refetchList();
      refetchActiveConv();

    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg = {
        role: "assistant",
        content: `I could not complete the AI request: ${error.message}`,
        plain: true,
        createdAt: new Date().toISOString()
      };
      setLocalMessages(prev => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  const renderTable = (lines) => {
    const rows = lines
      .filter((line) => line.includes("|"))
      .map((line) =>
        line
          .split("|")
          .map((cell) => cell.trim())
          .filter(Boolean)
      )
      .filter((row) => row.length && !row.every((cell) => /^-+$/.test(cell)));

    if (!rows.length) return null;
    const [header, ...body] = rows;

    return (
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              {header.map((cell, idx) => (
                <th key={idx}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStructuredAnswer = (content, lang) => {
    const healthScore = extractHealthScore(content);
    const priority = extractPriority(content);
    const sections = parseStructuredAnswer(content);

    return (
      <div className="chatbot-structured-answer">
        {/* Optional Top Health Banner */}
        {healthScore !== null && (
          <div className="chatbot-health">
            <div className="chatbot-health__label">
              {uiText[lang].health}
            </div>
            <div className="chatbot-health__score" style={{ color: barColor(healthScore) }}>
              {healthScore}/100
            </div>
            <div className="chatbot-health__bar">
              <div
                className="chatbot-health__fill"
                style={{ width: `${healthScore}%`, backgroundColor: barColor(healthScore) }}
              />
            </div>
          </div>
        )}

        {/* Priority Badge */}
        {priority && (
          <div style={{ marginBottom: "12px" }}>
            <span className={`chatbot-priority-chip chatbot-priority-chip--${priority.toLowerCase()}`}>
              {lang === "kh" ? "អាទិភាព" : "Priority"}: {priority}
            </span>
          </div>
        )}

        {/* Sections */}
        {sections.map((section, sIdx) => {
          const lines = section.lines.map(removeReportNoise).map(formatLine).filter(Boolean);
          if (!lines.length) return null;

          const Icon = sectionMeta[section.title]?.icon || Info;

          return (
            <div key={sIdx} className="chatbot-section">
              <div className="chatbot-section__header">
                <Icon size={16} />
                <div className="chatbot-section__title">
                  {displaySectionTitle(section.title, lang)}
                </div>
              </div>
              <div className="chatbot-section__body">
                {isTableSection(section.title) ? (
                  renderTable(lines)
                ) : isListSection(section.title) ? (
                  <ul className="chatbot-section__list">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx} className="chatbot-section__list-item">
                        <CheckCircle2 size={14} style={{ minWidth: "14px", marginTop: "3px" }} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                    {lines.join("\n")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBusinessSignalChart = (result, lang) => {
    const items = getBusinessItems(result);
    if (!items.length) return null;

    return (
      <div className="chatbot-signal-chart">
        <div className="chatbot-signal-chart__header">
          <LineChart size={16} />
          <div className="chatbot-signal-chart__title">
            {lang === "kh" ? "ការវិភាគតាមក្រាហ្វ" : "Chart Analysis"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((item, idx) => {
            const riskScore = riskToScore(item.riskLevel || item.priority);
            const confidenceScore =
              typeof item.confidence === "number" ? Math.round(item.confidence * 100) : null;
            return (
              <div key={idx} className="chatbot-signal-bar">
                <div className="chatbot-signal-bar__labels">
                  <div className="chatbot-signal-bar__name">
                    {toBusinessArea(item.model || item.key, lang)}
                  </div>
                  <div className="chatbot-signal-bar__risk">
                    {item.riskLevel || item.priority || "normal"}
                  </div>
                </div>
                <div className="chatbot-signal-bar__track">
                  <div
                    className="chatbot-signal-bar__fill"
                    style={{ width: `${riskScore}%`, backgroundColor: barColor(riskScore) }}
                  />
                </div>
                {confidenceScore !== null && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600" }}>
                      {lang === "kh" ? "ភាពជឿជាក់" : "Confidence"}: {confidenceScore}%
                    </span>
                    <div style={{ flex: 1, height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${confidenceScore}%`, height: "100%", background: "var(--accent-blue)" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBusinessResultCards = (result, lang) => {
    const items = getBusinessItems(result);
    if (!items.length) return null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
        <div className="chatbot-sidebar__section-label" style={{ padding: 0, marginBottom: "4px" }}>
          {uiText[lang].supportingSignals}
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="chatbot-section" style={{ background: "rgba(255,255,255,0.01)" }}>
            <div className="chatbot-chips" style={{ marginBottom: "8px" }}>
              <span className="chatbot-chip" style={{ color: "var(--accent-gold)", fontWeight: "700" }}>
                {toBusinessArea(item.model || item.key, lang)}
              </span>
              {item.riskLevel && (
                <span className={`chatbot-chip chatbot-chip--risk-${getRiskColor(item.riskLevel)}`}>
                  {uiText[lang].risk}: {item.riskLevel}
                </span>
              )}
              {item.priority && (
                <span className="chatbot-chip" style={{ borderColor: "var(--card-border)" }}>
                  {uiText[lang].action}: {item.priority}
                </span>
              )}
            </div>

            {item.summary && (
              <p style={{ margin: "0 0 6px 0", fontSize: "13px", color: "var(--text-primary)", fontWeight: "500", lineHeight: "1.5" }}>
                {item.summary}
              </p>
            )}

            {item.businessImpact && (
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                Impact: {item.businessImpact}
              </p>
            )}

            {Array.isArray(item.recommendations) && item.recommendations.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                {item.recommendations.slice(0, 3).map((rec, rIdx) => (
                  <li key={rIdx}>
                    {typeof rec === "string" ? rec : rec.action || rec.reason || prettyJson(rec)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="chatbot-wrapper">
      {/* Mobile Toggle */}
      <button
        className="chatbot-mobile-toggle"
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`chatbot-overlay ${sidebarOpen ? "chatbot-overlay--visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar (History & controls) */}
      <aside className={`chatbot-sidebar ${sidebarOpen ? "chatbot-sidebar--open" : ""}`}>
        <button
          className="chatbot-sidebar__new-chat-btn"
          onClick={() => {
            setActiveConversationId(null);
            setSidebarOpen(false);
          }}
        >
          <Plus size={18} />
          <span>{language === "kh" ? "សន្ទនាថ្មី" : "New chat"}</span>
        </button>

        <div className="chatbot-sidebar__section-label">
          {language === "kh" ? "ប្រវត្តិនៃការសន្ទនា" : "History"}
        </div>

        <div className="chatbot-sidebar__history-list">
          {listLoading ? (
            <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "10px" }}>
              {language === "kh" ? "កំពុងទាញយក..." : "Loading..."}
            </div>
          ) : listData?.getChatConversations?.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "12px", padding: "10px", fontStyle: "italic" }}>
              {language === "kh" ? "គ្មានប្រវត្តិសន្ទនា" : "No history yet"}
            </div>
          ) : (
            listData?.getChatConversations?.map((conv) => (
              <button
                key={conv._id}
                className={`chatbot-sidebar__history-item ${activeConversationId === conv._id ? "chatbot-sidebar__history-item--active" : ""}`}
                onClick={() => {
                  setActiveConversationId(conv._id);
                  setSidebarOpen(false);
                }}
              >
                <MessageSquare className="chatbot-sidebar__history-icon" />
                <div className="chatbot-sidebar__history-text">
                  <div className="chatbot-sidebar__history-title">{conv.title}</div>
                  <div className="chatbot-sidebar__history-time">
                    {formatRelativeTime(conv.updatedAt || conv.createdAt, language)}
                  </div>
                </div>
                <button
                  className="chatbot-sidebar__history-delete"
                  onClick={(e) => handleDeleteConversation(e, conv._id)}
                  title={language === "kh" ? "លុប" : "Delete"}
                >
                  <Trash2 size={14} />
                </button>
              </button>
            ))
          )}
        </div>

        <button className="chatbot-sidebar__clear-btn" onClick={handleClearAllConversations}>
          <Trash2 size={14} />
          <span>{language === "kh" ? "លុបប្រវត្តិទាំងអស់" : "Clear all history"}</span>
        </button>
      </aside>

      {/* Main Chat Panel */}
      <main className="chatbot-main">
        {/* Model Bar / Lang Selector */}
        <header className="chatbot-model-bar">
          <select
            className="chatbot-model-bar__select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {modelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {getLabel(opt.label, language)}
              </option>
            ))}
          </select>

          <div className="chatbot-model-bar__spacer" />

          {shopId && (
            <div className="chatbot-model-bar__shop-chip">
              {language === "kh" ? `ហាង: ${shopId}` : `Shop: ${shopId}`}
            </div>
          )}

          <div style={{ display: "flex", gap: "4px" }}>
            {["en", "kh"].map((lang) => (
              <button
                key={lang}
                className={`chatbot-model-bar__lang-btn ${language === lang ? "chatbot-model-bar__lang-btn--active" : ""}`}
                onClick={() => {
                  localStorage.setItem("aiAdvisorLanguage", lang);
                  setLanguage(lang);
                }}
              >
                {lang === "en" ? "EN" : "ខ្មែរ"}
              </button>
            ))}
          </div>
        </header>

        {/* Content body */}
        {localMessages.length <= 1 && !activeConversationId ? (
          <div className="chatbot-welcome">
            <div className="chatbot-welcome__icon">
              <Sparkles size={32} />
            </div>
            <h1 className="chatbot-welcome__title">TerraLink AI</h1>
            <p className="chatbot-welcome__subtitle">{uiText[language].subtitle}</p>

            <div className="chatbot-prompt-grid">
              {promptCards.map((card, idx) => (
                <button
                  key={idx}
                  className="chatbot-prompt-card"
                  onClick={() => sendMessage(getLabel(card.prompt, language), card.model)}
                  disabled={aiLoading}
                >
                  <div className="chatbot-prompt-card__header">
                    <div className={`chatbot-prompt-card__icon ${card.colorClass}`}>
                      {card.icon}
                    </div>
                    <div className="chatbot-prompt-card__title">
                      {getLabel(card.title, language)}
                    </div>
                  </div>
                  <div className="chatbot-prompt-card__desc">
                    {getLabel(card.desc, language)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chatbot-thread">
            {localMessages.map((msg, idx) => {
              const isAssistant = msg.role === "assistant";
              
              if (idx === 0 && !isAssistant && msg.content === uiText[language].intro) return null;

              const parsedMetaResult = msg.businessAIResult ? parseBusinessAIResult(msg.businessAIResult) : null;
              const hasMeta = isAssistant && msg.businessAIStatus && msg.businessAIStatus !== "chat";

              return (
                <div
                  key={idx}
                  className={`chatbot-msg ${isAssistant ? "chatbot-msg--assistant" : "chatbot-msg--user"}`}
                >
                  <div className={`chatbot-msg__avatar ${isAssistant ? "chatbot-msg__avatar--assistant" : "chatbot-msg__avatar--user"}`}>
                    {isAssistant ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="chatbot-msg__bubble">
                    {isAssistant && !msg.plain ? (
                      renderStructuredAnswer(msg.content, language)
                    ) : (
                      <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                    )}

                    {hasMeta && parsedMetaResult && (
                      <div style={{ marginTop: "14px" }}>
                        <hr style={{ border: 0, borderTop: "1px solid var(--card-border)", margin: "12px 0" }} />
                        {renderBusinessSignalChart(parsedMetaResult, language)}
                        {renderBusinessResultCards(parsedMetaResult, language)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {aiLoading && (
              <div className="chatbot-msg chatbot-msg--assistant">
                <div className="chatbot-msg__avatar chatbot-msg__avatar--assistant">
                  <Bot size={16} />
                </div>
                <div className="chatbot-typing">
                  <div className="chatbot-typing__dots">
                    <div className="chatbot-typing__dot" />
                    <div className="chatbot-typing__dot" />
                    <div className="chatbot-typing__dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>
        )}

        {/* Input Form */}
        <div className="chatbot-input-area">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <div className="chatbot-input-wrapper">
              <textarea
                value={input}
                disabled={aiLoading}
                onChange={(e) => setInput(e.target.value)}
                placeholder={uiText[language].placeholder}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
              />
              <button
                type="submit"
                className="chatbot-input__send-btn"
                disabled={aiLoading || !input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
          <div className="chatbot-disclaimer">
            {language === "kh"
              ? "TerraLink AI ផ្តល់នូវការវិភាគបែបអប់រំ មិនមែនជាដំបូន្មានហិរញ្ញវត្ថុនោះទេ។"
              : "TerraLink AI provides educational analysis, not financial advice."}
          </div>
        </div>
      </main>
    </div>
  );
}
