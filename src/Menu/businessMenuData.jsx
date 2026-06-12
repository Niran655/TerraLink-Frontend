import {
  CalendarClock,
  FileImage,
  FolderTree,
  Gift,
  Globe2,
  Mail,
  Megaphone,
  MessageSquareText,
  Newspaper,
  SearchCheck,
  Share2,
  Tags,
  UserCheck,
  UsersRound,
  Workflow,
} from "lucide-react";

export const CMS_MODULES = [
  {
    label: "Content Management",
    path: "/cms/content-management",
    icon: Newspaper,
    items: ["Blog Posts", "News Articles", "Promotions", "Announcements", "Landing Pages"],
  },
  {
    label: "Media Library",
    path: "/cms/media-library",
    icon: FileImage,
    items: ["Images", "Videos", "Documents", "File Manager"],
  },
  {
    label: "Categories & Tags",
    path: "/cms/categories-tags",
    icon: Tags,
    items: ["Categories", "Tags", "Content Organization"],
  },
  {
    label: "Social Media Management",
    path: "/social-cms",
    icon: Share2,
    items: ["Facebook Pages", "Instagram", "Telegram", "TikTok", "LinkedIn"],
  },
  {
    label: "Post Scheduling",
    path: "/cms/post-scheduling",
    icon: CalendarClock,
    items: ["Draft", "Scheduled", "Published", "Archived"],
  },
  {
    label: "SEO Management",
    path: "/cms/seo-management",
    icon: SearchCheck,
    items: ["Meta Title", "Meta Description", "Keywords", "URL Slug"],
  },
  {
    label: "Website Builder",
    path: "/cms/website-builder",
    icon: Globe2,
    items: ["Homepage Builder", "Landing Pages", "Contact Pages"],
  },
  {
    label: "Email Marketing",
    path: "/cms/email-marketing",
    icon: Mail,
    items: ["Newsletter", "Campaigns", "Email Templates"],
  },
];

export const CRM_MODULES = [
  {
    label: "Customer Management",
    path: "/crm/customer-management",
    icon: UsersRound,
    items: ["Customer Database", "Customer Profile", "Contact Info", "Purchase History", "Notes"],
  },
  {
    label: "Lead Management",
    path: "/crm/lead-management",
    icon: UserCheck,
    items: ["New Lead", "Contacted", "Qualified", "Converted"],
  },
  {
    label: "Customer Interactions",
    path: "/crm/customer-interactions",
    icon: MessageSquareText,
    items: ["Calls", "Messages", "Facebook Chats", "Emails"],
  },
  {
    label: "Loyalty Program",
    path: "/crm/loyalty-program",
    icon: Gift,
    items: ["Points", "Rewards", "Membership Levels"],
  },
  {
    label: "Customer Segmentation",
    path: "/crm/customer-segmentation",
    icon: FolderTree,
    items: ["VIP Customers", "New Customers", "Inactive Customers"],
  },
  {
    label: "Marketing Automation",
    path: "/crm/marketing-automation",
    icon: Workflow,
    items: ["Auto Follow-up", "Birthday Messages", "Promotion Messages"],
  },
];

export const businessMenuSections = [
  {
    key: "cms",
    label: "Core CMS",
    icon: Megaphone,
    modules: CMS_MODULES,
  },
  {
    key: "crm",
    label: "CRM",
    icon: UsersRound,
    modules: CRM_MODULES,
  },
];

export const findBusinessModule = (area, modulePath) => {
  const modules = area === "crm" ? CRM_MODULES : CMS_MODULES;
  return modules.find((module) => module.path.split("/").pop() === modulePath);
};
