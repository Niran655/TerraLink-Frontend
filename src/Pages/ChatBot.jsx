import { useApolloClient } from "@apollo/client/react";
import { Alert, Box, Button, Chip, CircularProgress, Divider, IconButton, MenuItem, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import { AlertTriangle, Bot, Brain, CheckCircle2, ClipboardList, Info, Lightbulb, LineChart, Send, ShoppingCart, Sparkles, Target, TrendingUp, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";

import { AI_BUSINESS_CHAT } from "../../graphql/queries";

const modelOptions = [
  { value: "auto", label: { en: "Auto", kh: "ស្វ័យប្រវត្តិ" } },
  { value: "customer_churn", label: { en: "Customer Retention", kh: "ការរក្សាអតិថិជន" } },
  { value: "employee_performance", label: { en: "Employee Performance", kh: "ប្រសិទ្ធភាពបុគ្គលិក" } },
  { value: "sales_forecast", label: { en: "Sales Forecast", kh: "ការព្យាករណ៍លក់" } },
  { value: "inventory_optimization", label: { en: "Inventory Health", kh: "សុខភាពស្តុក" } },
  { value: "all", label: { en: "Full Business Report", kh: "របាយការណ៍អាជីវកម្ម" } },
];

const quickQuestions = [
  {
    label: { en: "Sales today", kh: "ការលក់ថ្ងៃនេះ" },
    icon: <ShoppingCart size={16} />,
    prompt: {
      en: "Forecast sales and explain what action the shop should take today.",
      kh: "ព្យាករណ៍ការលក់ ហើយពន្យល់ថាហាងគួរធ្វើអ្វីថ្ងៃនេះ។",
    },
    model: "sales_forecast",
  },
  {
    label: { en: "Low stock", kh: "ស្តុកទាប" },
    icon: <Warehouse size={16} />,
    prompt: {
      en: "Check inventory risk and tell me what needs reorder action first.",
      kh: "ពិនិត្យហានិភ័យស្តុក ហើយប្រាប់ថាត្រូវបញ្ជាទិញអ្វីមុនគេ។",
    },
    model: "inventory_optimization",
  },
  {
    label: { en: "Churn risk", kh: "ហានិភ័យបាត់បង់អតិថិជន" },
    icon: <Brain size={16} />,
    prompt: {
      en: "Analyze customer churn risk and give retention recommendations.",
      kh: "វិភាគហានិភ័យបាត់បង់អតិថិជន និងផ្តល់អនុសាសន៍រក្សាអតិថិជន។",
    },
    model: "customer_churn",
  },
  {
    label: { en: "Business health", kh: "សុខភាពអាជីវកម្ម" },
    icon: <LineChart size={16} />,
    prompt: {
      en: "Use all Business AI models and summarize business health with next actions.",
      kh: "ប្រើការវិភាគអាជីវកម្មទាំងអស់ ហើយសង្ខេបសុខភាពអាជីវកម្ម និងសកម្មភាពបន្ទាប់។",
    },
    model: "all",
  },
];

const uiText = {
  en: {
    advisor: "TerraLink Business Advisor",
    subtitle: "Ask business questions and get clear decisions, risks, causes, and next actions.",
    intro: "Hello. Ask me what is happening in your business, what needs attention, and what action you should take next.",
    helper: "Ask in simple language. The advisor will translate business signals into owner-friendly recommendations.",
    placeholder: "Ask about sales, low stock, churn, employees, or business recommendations...",
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
    placeholder: "សួរអំពីការលក់ ស្តុកទាប អតិថិជន បុគ្គលិក ឬអនុសាសន៍អាជីវកម្ម...",
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
  customer_churn: { en: "Customer Retention", kh: "ការរក្សាអតិថិជន" },
  customerChurn: { en: "Customer Retention", kh: "ការរក្សាអតិថិជន" },
  employee_performance: { en: "Employee Performance", kh: "ប្រសិទ្ធភាពបុគ្គលិក" },
  employeePerformance: { en: "Employee Performance", kh: "ប្រសិទ្ធភាពបុគ្គលិក" },
  inventory_optimization: { en: "Inventory Health", kh: "សុខភាពស្តុក" },
  inventoryOptimization: { en: "Inventory Health", kh: "សុខភាពស្តុក" },
  sales_forecast: { en: "Sales Forecast", kh: "ការព្យាករណ៍លក់" },
  salesForecast: { en: "Sales Forecast", kh: "ការព្យាករណ៍លក់" },
  all: { en: "Full Business Report", kh: "របាយការណ៍អាជីវកម្ម" },
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
  if (["high", "critical", "urgent"].includes(value)) return "error";
  if (["medium", "normal"].includes(value)) return "warning";
  if (["low", "ok"].includes(value)) return "success";
  return "default";
};

const sectionMeta = {
  Summary: { icon: Info, color: "primary.main", tone: "primary" },
  "Key Findings": { icon: ClipboardList, color: "info.main", tone: "info" },
  "Business Impact": { icon: TrendingUp, color: "warning.main", tone: "warning" },
  Recommendations: { icon: Target, color: "success.main", tone: "success" },
  "Priority Level": { icon: AlertTriangle, color: "error.main", tone: "error" },
  "Data Needed": { icon: Lightbulb, color: "secondary.main", tone: "secondary" },
  "Executive Summary": { icon: Info, color: "primary.main", tone: "primary" },
  "Critical Alerts": { icon: AlertTriangle, color: "error.main", tone: "error" },
  Opportunities: { icon: Lightbulb, color: "success.main", tone: "success" },
  "Recommended Actions": { icon: Target, color: "success.main", tone: "success" },
  "AI Advisor Recommendation": { icon: CheckCircle2, color: "success.main", tone: "success" },
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

const priorityChipColor = (priority) => {
  const value = String(priority || "").toLowerCase();
  if (value === "critical") return "error";
  if (value === "high") return "warning";
  if (value === "medium") return "info";
  if (value === "low") return "success";
  return "default";
};

const getAdvisorTheme = (theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    panelBg: isDark ? "#2b2b2a" : "#ffffff",
    panelBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)",
    innerBg: isDark ? "rgba(255,255,255,0.035)" : "rgba(15,23,42,0.035)",
    innerBgStrong: isDark ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)",
    text: isDark ? "#f4f4ef" : "#172033",
    muted: isDark ? "#c7c7c3" : "#5f6b7a",
    subtle: isDark ? "#a8a8a2" : "#6b7280",
    progressTrack: isDark ? "rgba(255,255,255,0.16)" : "rgba(15,23,42,0.12)",
    shadow: isDark ? "0 20px 60px rgba(0,0,0,0.18)" : "0 18px 50px rgba(15,23,42,0.1)",
    confidence: isDark ? "#fff7c2" : "#8a5b00",
  };
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

const HealthScore = ({ score, language = "en" }) => {
  const theme = useTheme();
  const advisorTheme = getAdvisorTheme(theme);
  if (score === null) return null;

  const color = score >= 75 ? "#22c55e" : score >= 55 ? "#fbbf24" : "#f43f5e";

  return (
    <Box
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: advisorTheme.panelBorder,
        borderRadius: 1,
        bgcolor: advisorTheme.innerBg,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="baseline" sx={{ minWidth: 160 }}>
          <Typography variant="body2" sx={{ color: advisorTheme.muted, fontWeight: 800 }}>
            {uiText[language].health}
          </Typography>
          <Typography variant="h6" fontWeight={900} sx={{ color }}>
            {score}/100
          </Typography>
        </Stack>
        <Box sx={{ flex: 1, height: 5, borderRadius: 1, bgcolor: advisorTheme.progressTrack, overflow: "hidden" }}>
          <Box sx={{ width: `${score}%`, height: "100%", bgcolor: color }} />
        </Box>
      </Stack>
    </Box>
  );
};

const BusinessSignalChart = ({ result, language = "en" }) => {
  const theme = useTheme();
  const advisorTheme = getAdvisorTheme(theme);
  const items = getBusinessItems(result);
  if (!items.length) return null;

  return (
    <Box
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: advisorTheme.panelBorder,
        borderRadius: 1,
        bgcolor: advisorTheme.innerBg,
        textAlign: "start",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25, color: advisorTheme.text }}>
        <LineChart size={18} />
        <Typography variant="subtitle2" fontWeight={900}>
          {language === "kh" ? "ការវិភាគតាមក្រាហ្វ" : "Chart Analysis"}
        </Typography>
      </Stack>

      <Stack spacing={1.1}>
        {items.map((item, index) => {
          const riskScore = riskToScore(item.riskLevel || item.priority);
          const confidenceScore =
            typeof item.confidence === "number" ? Math.round(item.confidence * 100) : null;
          return (
            <Box key={`${item.model || item.key || "signal"}-${index}`}>
              <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.4 }}>
                <Typography variant="caption" fontWeight={900} sx={{ color: advisorTheme.text }}>
                  {toBusinessArea(item.model || item.key, language)}
                </Typography>
                <Typography variant="caption" sx={{ color: advisorTheme.muted, fontWeight: 800 }}>
                  {item.riskLevel || item.priority || "normal"}
                </Typography>
              </Stack>
              <Stack spacing={0.45}>
                <Box sx={{ height: 7, borderRadius: 1, bgcolor: advisorTheme.progressTrack, overflow: "hidden" }}>
                  <Box sx={{ width: `${riskScore}%`, height: "100%", bgcolor: barColor(riskScore) }} />
                </Box>
                {confidenceScore !== null && (
                  <Box sx={{ height: 5, borderRadius: 1, bgcolor: advisorTheme.progressTrack, overflow: "hidden" }}>
                    <Box sx={{ width: `${confidenceScore}%`, height: "100%", bgcolor: theme.palette.primary.main }} />
                  </Box>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

const SimpleMarkdownTable = ({ lines }) => {
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
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <Box component="thead">
          <Box component="tr">
            {header.map((cell) => (
              <Box
                key={cell}
                component="th"
                sx={{ textAlign: "left", p: 0.75, borderBottom: "1px solid", borderColor: "divider" }}
              >
                {cell}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {body.map((row, rowIndex) => (
            <Box key={rowIndex} component="tr">
              {row.map((cell, cellIndex) => (
                <Box
                  key={`${rowIndex}-${cellIndex}`}
                  component="td"
                  sx={{ p: 0.75, borderBottom: "1px solid", borderColor: "divider" }}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const StructuredAnswer = ({ content, language = "en" }) => {
  const theme = useTheme();
  const advisorTheme = getAdvisorTheme(theme);
  const healthScore = extractHealthScore(content);
  const priority = extractPriority(content);

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          p: 0,
          border: "none",
          bgcolor: "transparent",
          textAlign: "start",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="overline" sx={{ color: advisorTheme.subtle, fontWeight: 900, letterSpacing: 0 }}>
              {uiText[language].advisor}
            </Typography>
            <Typography variant="h6" fontWeight={900} sx={{ color: advisorTheme.text, lineHeight: 1.45 }}>
              {uiText[language].businessDecision}
            </Typography>
          </Box>
          {priority && (
            <Chip
              color={priorityChipColor(priority)}
              label={`${language === "kh" ? "អាទិភាព" : "Priority"}: ${priority}`}
              sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontWeight: 800 }}
            />
          )}
        </Stack>
      </Box>
      <HealthScore score={healthScore} language={language} />
      {parseStructuredAnswer(content).map((section) => {
        const lines = section.lines.map(removeReportNoise).map(formatLine).filter(Boolean);
      if (!lines.length) return null;

      return (
        <Box
          key={section.title}
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: advisorTheme.panelBorder,
            borderRadius: 1,
            bgcolor: advisorTheme.innerBg,
            textAlign: "start",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: advisorTheme.muted }}>
            <SectionIcon title={section.title} />
            <Typography variant="subtitle2" fontWeight={900} sx={{ color: advisorTheme.text }}>
              {displaySectionTitle(section.title, language)}
            </Typography>
          </Stack>
          {isTableSection(section.title) ? (
            <SimpleMarkdownTable lines={lines} />
          ) : isListSection(section.title) ? (
            <Stack spacing={0.75} sx={{ alignItems: "stretch" }}>
              {lines.map((line, index) => (
                <Stack
                  key={`${section.title}-${index}`}
                  direction="row"
                  spacing={1}
                  alignItems="flex-start"
                  sx={{
                    p: 0.75,
                    borderRadius: 1,
                    bgcolor: advisorTheme.innerBgStrong,
                  }}
                >
                  <CheckCircle2 size={16} style={{ marginTop: 2, flex: "0 0 auto", color: advisorTheme.muted }} />
                  <Typography variant="body2" sx={{ color: advisorTheme.text, fontWeight: 650, lineHeight: 1.55, textAlign: "start" }}>
                    {line}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: advisorTheme.muted, fontWeight: 650, lineHeight: 1.65, textAlign: "start" }}>
              {lines.join("\n")}
            </Typography>
          )}
        </Box>
      );
    })}
    </Stack>
  );
};

const BusinessResultCards = ({ result, language = "en" }) => {
  const theme = useTheme();
  const advisorTheme = getAdvisorTheme(theme);
  const items = getBusinessItems(result);
  if (!items.length) return null;

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" fontWeight={900} sx={{ color: advisorTheme.text, textTransform: "uppercase", fontSize: 12, textAlign: "start" }}>
        {uiText[language].supportingSignals}
      </Typography>
      {items.map((item, index) => (
        <Box
          key={`${item.model || item.key || "model"}-${index}`}
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: advisorTheme.panelBorder,
            borderRadius: 1,
            bgcolor: advisorTheme.innerBg,
            textAlign: "start",
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1, justifyContent: "flex-start" }}>
            <Chip
              size="small"
              label={toBusinessArea(item.model || item.key, language)}
              sx={{ bgcolor: "transparent", color: advisorTheme.text, fontWeight: 900, pl: 0 }}
            />
            {item.riskLevel && (
              <Chip size="small" color={getRiskColor(item.riskLevel)} label={`${uiText[language].risk}: ${item.riskLevel}`} />
            )}
            {item.priority && <Chip size="small" variant="outlined" label={`${uiText[language].action}: ${item.priority}`} sx={{ color: advisorTheme.text, borderColor: advisorTheme.panelBorder }} />}
            {typeof item.confidence === "number" && (
              <Chip size="small" variant="outlined" label={`${uiText[language].confidence}: ${Math.round(item.confidence * 100)}%`} sx={{ color: advisorTheme.confidence, borderColor: advisorTheme.confidence, bgcolor: theme.palette.mode === "dark" ? "rgba(255,247,194,0.08)" : "rgba(245,158,11,0.08)" }} />
            )}
          </Stack>

          {item.summary && (
            <Typography variant="body2" sx={{ mb: 0.75, color: advisorTheme.muted, fontWeight: 700, lineHeight: 1.55, textAlign: "start" }}>
              {item.summary}
            </Typography>
          )}

          {item.businessImpact && (
            <Typography variant="caption" sx={{ display: "block", mb: 0.75, color: advisorTheme.subtle, fontWeight: 700, textAlign: "start" }}>
              Impact: {item.businessImpact}
            </Typography>
          )}

          {Array.isArray(item.recommendations) && item.recommendations.length > 0 && (
            <Stack component="ul" spacing={0.25} sx={{ m: 0, pl: 2.5, alignItems: "flex-start", textAlign: "start" }}>
              {item.recommendations.slice(0, 3).map((recommendation, recIndex) => (
                <Typography key={recIndex} component="li" variant="caption" sx={{ color: advisorTheme.text, fontWeight: 750, textAlign: "start" }}>
                  {typeof recommendation === "string"
                    ? recommendation
                    : recommendation.action || recommendation.reason || prettyJson(recommendation)}
                </Typography>
              ))}
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default function ChatBot() {
  const theme = useTheme();
  const advisorTheme = getAdvisorTheme(theme);
  const apolloClient = useApolloClient();
  const [input, setInput] = useState("");
  const [model, setModel] = useState("auto");
  const [language, setLanguage] = useState(() => localStorage.getItem("aiAdvisorLanguage") || "en");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: uiText[localStorage.getItem("aiAdvisorLanguage") || "en"].intro,
    },
  ]);

  const shopId = useMemo(() => getActiveShopId(), []);

  const askBackendAI = async ({ question, selectedModel }) => {
    const response = await apolloClient.query({
      query: AI_BUSINESS_CHAT,
      variables: {
        input: {
          message: question,
          model: selectedModel === "auto" ? null : selectedModel,
          shopId: shopId || null,
          language,
        },
      },
      fetchPolicy: "network-only",
    });

    return response.data.aiBusinessChat;
  };

  const sendMessage = async (messageText = input, overrideModel = model) => {
    const question = (typeof messageText === "string" ? messageText : "").trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const result = await askBackendAI({ question, selectedModel: overrideModel });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          meta: {
            model: result.model,
            status: result.businessAIStatus,
            route: result.businessAIRoute,
            error: result.error,
            businessAIResult: parseBusinessAIResult(result.businessAIResult),
          },
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I could not complete the AI request: ${error.message}`,
          meta: { status: "error" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1180, mx: "auto", height: "calc(100vh - 120px)", minHeight: 620 }}>
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  display: "grid",
                  placeItems: "center",
                  color: theme.palette.primary.contrastText,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                <Bot size={24} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {uiText[language].advisor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {uiText[language].subtitle}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={shopId ? `Shop ${shopId}` : uiText[language].noShop} size="small" />
              <Stack direction="row" spacing={0.5}>
                {["en", "kh"].map((item) => (
                  <Button
                    key={item}
                    size="small"
                    variant={language === item ? "contained" : "outlined"}
                    onClick={() => {
                      localStorage.setItem("aiAdvisorLanguage", item);
                      setLanguage(item);
                    }}
                    sx={{ minWidth: 44, borderRadius: 1 }}
                  >
                    {item === "en" ? "EN" : "ខ្មែរ"}
                  </Button>
                ))}
              </Stack>
              <TextField
                select
                size="small"
                label={uiText[language].model}
                value={model}
                onChange={(event) => setModel(event.target.value)}
                sx={{ minWidth: 190 }}
              >
                {modelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {getLabel(option.label, language)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>
        </Paper>

        <Alert severity="info">
          {uiText[language].helper}
        </Alert>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {quickQuestions.map((item) => (
            <Button
              key={item.label}
              variant="outlined"
              startIcon={item.icon}
              onClick={() => sendMessage(getLabel(item.prompt, language), item.model)}
              disabled={loading}
              sx={{ borderRadius: 1 }}
            >
              {getLabel(item.label, language)}
            </Button>
          ))}
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <Stack spacing={1.5}>
              {messages.map((message, index) => (
                <Box
                  key={`${message.role}-${index}`}
                  sx={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: { xs: "100%", md: "82%" },
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: message.role === "assistant" ? 2.25 : 1.5,
                      borderRadius: message.role === "assistant" ? 1.5 : 1,
                      bgcolor:
                        message.role === "user" ? theme.palette.primary.main : advisorTheme.panelBg,
                      color:
                        message.role === "user"
                          ? theme.palette.primary.contrastText
                          : advisorTheme.text,
                      whiteSpace: "pre-wrap",
                      border:
                        message.role === "assistant"
                          ? `1px solid ${advisorTheme.panelBorder}`
                          : "none",
                      boxShadow:
                        message.role === "assistant"
                          ? advisorTheme.shadow
                          : "none",
                      textAlign: "start",
                    }}
                  >
                    {message.role === "assistant" ? (
                      <StructuredAnswer content={message.content} language={language} />
                    ) : (
                      <Typography variant="body2">{message.content}</Typography>
                    )}

                    {message.meta && (
                      <Box sx={{ mt: 1.5 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1, justifyContent: "flex-start" }}>
                          {message.meta.model && <Chip size="small" label={toBusinessArea(message.meta.model, language)} />}
                          {message.meta.status && (
                            <Chip
                              size="small"
                              color={message.meta.status === "ok" ? "success" : "warning"}
                              label={`${uiText[language].analysis}: ${message.meta.status}`}
                            />
                          )}
                        </Stack>
                        {message.meta.error && (
                          <Alert severity="warning" sx={{ mb: 1 }}>
                            {message.meta.error}
                          </Alert>
                        )}
                        {message.meta.businessAIResult && (
                          <Stack spacing={1}>
                            <BusinessSignalChart result={message.meta.businessAIResult} language={language} />
                            <BusinessResultCards result={message.meta.businessAIResult} language={language} />
                          </Stack>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Box>
              ))}

              {loading && (
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                  <CircularProgress size={18} />
                  <Typography variant="body2">{uiText[language].loading}</Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Divider />
          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            sx={{ p: 1.5 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                value={input}
                disabled={loading}
                onChange={(event) => setInput(event.target.value)}
                placeholder={uiText[language].placeholder}
                InputProps={{
                  startAdornment: <Sparkles size={18} style={{ marginRight: 8 }} />,
                }}
              />
              <IconButton type="submit" color="primary" disabled={loading || !input.trim()}>
                <Send size={20} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
