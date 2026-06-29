import React from "react";
import { Box, Typography, Paper, Stack, Button } from "@mui/material";
import { Scale, CheckCircle, ShieldAlert } from "lucide-react";
import { jsPDF } from "jspdf";

export default function PrivacyCompliance() {
  const handleDownloadDPA = () => {
    const doc = new jsPDF();
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("DATA PROCESSING AGREEMENT (DPA)", 14, 22);
    
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Effective Date: June 29, 2026 | Document Reference: TL-AI-DPA-2026", 14, 28);
    
    doc.setDrawColor(200);
    doc.line(14, 32, 196, 32);
    
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("Helvetica", "bold");
    doc.text("1. Purpose, Scope, and Applicability", 14, 42);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const body1 = "This Data Processing Agreement (\"DPA\") is entered into by and between TerraLink Inc. (\"Processor\") and the Customer subscribing to TerraLink Services (\"Controller\"). This agreement governs the security, storage, and processing parameters of Controller's business data, sales invoices, user sessions, and customer lists. This DPA is integrated into, and subject to, the Master Terms of Service.";
    const splitBody1 = doc.splitTextToSize(body1, 180);
    doc.text(splitBody1, 14, 47);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("2. Technical Partitioning & Tenant Isolation", 14, 70);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const body2 = "Processor warrants that strict logical boundaries are maintained to isolate Controller's databases. Specifically:\n" +
      "• Database Isolation: Customer data resides in separate logical partitions. Cross-tenant access is prohibited by active kernel access checks and security credentials constraints.\n" +
      "• Encryption Standards: All Controller data is encrypted in transit using TLS 1.3 protocols and at rest using AES-256 bit encryption standards. Backups are encrypted under separate unique tenant keys.";
    const splitBody2 = doc.splitTextToSize(body2, 180);
    doc.text(splitBody2, 14, 75);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("3. AI Data Scoping & Non-Training Guarantees", 14, 110);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const body3 = "To protect proprietary business operations, Processor establishes the following guarantees regarding artificial intelligence (AI) agents:\n" +
      "• Dedicated Context Scoping: Personal data or business records queried by AI Assistants are limited to the specific tenant's context boundaries. No query results leak across workspaces.\n" +
      "• Training Exemptions: Processor explicitly guarantees that Controller's data, transactions, and prompts are never utilized to train, retrain, fine-tune, or adjust foundational large language models (LLMs) or subprocessors' models. Data remains private and owned solely by the Controller.";
    const splitBody3 = doc.splitTextToSize(body3, 180);
    doc.text(splitBody3, 14, 115);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("4. Subprocessors and Audits", 14, 150);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const body4 = "Processor works with vetted cloud providers (e.g. Supabase, Firebase) for backup and cloud hosting under standard GDPR-compliant processing clauses. Controller has the right to request audit logs detailing database accesses by subprocessor nodes.";
    const splitBody4 = doc.splitTextToSize(body4, 180);
    doc.text(splitBody4, 14, 155);

    doc.text("Signed on behalf of TerraLink: Security & Privacy Compliance Director", 14, 185);
    doc.text("Signed on behalf of Tenant: Workspace System Administrator", 14, 192);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("TerraLink Corporate Privacy Office | Reference: DPA-ENG-2026", 14, 280);
    
    doc.save("terralink-dpa-agreement-en.pdf");
  };

  const handleDownloadRetention = () => {
    const doc = new jsPDF();
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("DATA RETENTION & DELETION POLICY", 14, 22);
    
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Effective Date: June 29, 2026 | Document Reference: TL-DRP-2026", 14, 28);
    
    doc.setDrawColor(200);
    doc.line(14, 32, 196, 32);
    
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("Helvetica", "bold");
    doc.text("1. Retention Overview & Schedules", 14, 42);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const body1 = "This Policy outlines how long TerraLink retains data and the exact purging processes. Retentions are classified as:\n" +
      "• Core Business Data: Sales logs, product inventories, and customer profiles are stored for the lifetime of the tenant workspace.\n" +
      "• Connection & Security Audit Logs: IP addresses, login records, and API queries are kept for a rolling 90 days before being automatically purged.\n" +
      "• Database Backups: Snapshot copies are saved on a rolling 30-day schedule (FIFO) for disaster recovery and system stability.";
    const splitBody1 = doc.splitTextToSize(body1, 180);
    doc.text(splitBody1, 14, 47);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("2. Multi-Phase Deletion Process", 14, 82);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const body2 = "When a tenant initiates account deletion or requests complete database purges:\n" +
      "• Phase 1 (Soft Delete): Access is disabled immediately. Data is locked from active queries and held for a 30-day safety period to allow recovery if requested.\n" +
      "• Phase 2 (Hard Purge): Within 30 days of the soft-delete, all database rows are permanently zeroed out from production disks.\n" +
      "• Phase 3 (Backup Expiration): Backups containing archival records expire naturally within their 30-day retention cycles, resulting in absolute database deletion.";
    const splitBody2 = doc.splitTextToSize(body2, 180);
    doc.text(splitBody2, 14, 87);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("3. Legal & Accounting Preservations", 14, 126);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const body3 = "In accordance with local accounting regulations and tax guidelines, transactional invoices and cash receipts must be archived for up to 7 years. These records are isolated, encrypted, and excluded from standard deletion schedules until their compliance term is met.";
    const splitBody3 = doc.splitTextToSize(body3, 180);
    doc.text(splitBody3, 14, 131);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("TerraLink Corporate Privacy Office | Reference: DRP-ENG-2026", 14, 280);
    
    doc.save("terralink-data-retention-policy-en.pdf");
  };

  const handlePrintKhmer = (type) => {
    const printWindow = window.open("", "_blank");
    
    let title = "";
    let contentHtml = "";
    
    if (type === "dpa") {
      title = "កិច្ចព្រមព្រៀងដំណើរការទិន្នន័យ AI (Enterprise AI DPA)";
      contentHtml = `
        <div style="font-family: 'Nokora', 'Hanuman', 'Khmer OS Battambang', sans-serif; padding: 40px; color: #333; line-height: 1.8; max-width: 800px; margin: 0 auto; text-align: justify;">
          <h1 style="text-align: center; color: #1D4592;">កិច្ចព្រមព្រៀងដំណើរការទិន្នន័យ (DPA)</h1>
          <h3 style="text-align: center; color: #666; font-weight: normal;">កាលបរិច្ឆេទចូលជាធរមាន៖ ថ្ងៃទី២៩ ខែមិថុនា ឆ្នាំ២០២៦ | លេខយោង៖ TL-AI-DPA-2026</h3>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />
          
          <h3 style="color: #1D4592; margin-top: 30px;">១. គោលបំណង វិសាលភាព និងការអនុវត្ត</h3>
          <p>កិច្ចព្រមព្រៀងដំណើរការទិន្នន័យនេះ ("DPA") ត្រូវបានព្រមព្រៀងឡើងរវាងក្រុមហ៊ុន TerraLink Inc. ("អ្នកដំណើរការ") និងអតិថិជនដែលចុះឈ្មោះប្រើប្រាស់សេវាកម្ម ("អ្នកគ្រប់គ្រង")។ កិច្ចព្រមព្រៀងនេះគ្រប់គ្រងលើប៉ារ៉ាម៉ែត្រសន្តិសុខ ការរក្សាទុក និងដំណើរការទិន្នន័យផ្ទាល់ខ្លួន និងព័ត៌មានប្រតិបត្តិការទាំងអស់ ដែលត្រូវបានធ្វើឡើងក្នុងនាមសហគ្រាសរបស់អ្នកគ្រប់គ្រង។ DPA នេះត្រូវបានបញ្ចូលជាផ្នែកមួយនៃលក្ខខណ្ឌសេវាកម្មទូទៅ។</p>
          
          <h3 style="color: #1D4592; margin-top: 30px;">២. ការបែងចែកបច្ចេកវិទ្យា និងការបំបែកទិន្នន័យ</h3>
          <p>អ្នកដំណើរការធានាថា វិធានការបច្ចេកទេស និងការរៀបចំរចនាសម្ព័ន្ធដ៏តឹងរ៉ឹងត្រូវបានរក្សា ដើម្បីធានាសុវត្ថិភាពទិន្នន័យ៖</p>
          <ul>
            <li><strong>ការបំបែកមូលដ្ឋានទិន្នន័យ៖</strong> ទិន្នន័យរបស់អ្នកជួលនីមួយៗត្រូវបានរក្សាទុកដាច់ដោយឡែកពីគ្នានៅក្នុងភាគថាសមូលដ្ឋានទិន្នន័យ (Logical Partitions) ជាមួយនឹងការត្រួតពិនិត្យការចូលប្រើប្រាស់យ៉ាងតឹងរ៉ឹង ដើម្បីការពារការលេចធ្លាយព័ត៌មានឆ្លងកាត់គណនីផ្សេងគ្នា។</li>
            <li><strong>ស្ដង់ដារកូដនីយកម្ម៖</strong> ទិន្នន័យទាំងអស់ត្រូវបានការពារដោយការសរសេរកូដសម្ងាត់ (Encryption) រួមមានពិធីការ TLS 1.3 សម្រាប់ការបញ្ជូនទិន្នន័យ និង AES-256 សម្រាប់ការរក្សាទុកទិន្នន័យក្នុងប្រព័ន្ធ។ ទិន្នន័យបម្រុងទុក (Backups) ត្រូវបានអ៊ិនគ្រីបដោយឡែកពីគ្នា។</li>
          </ul>

          <h3 style="color: #1D4592; margin-top: 30px;">៣. ការធានាគ្មានការបណ្តុះបណ្តាល AI ឆ្លងកាត់គណនី</h3>
          <p>ដើម្បីការពារព័ត៌មានសម្ងាត់ និងប្រតិបត្តិការអាជីវកម្មរបស់អ្នកគ្រប់គ្រង អ្នកដំណើរការបង្កើតការធានាដូចខាងក្រោម៖</p>
          <ul>
            <li><strong>វិសាលភាពបរិcontextដាច់ដោយឡែក៖</strong> រាល់ទិន្នន័យ ឬឯកសារអាជីវកម្មដែលត្រូវបានសួរដោយភ្នាក់ងារ AI (AI Agents) ត្រូវបានកំណត់ត្រឹមបរិបទកន្លែងធ្វើការឯកជនរបស់អ្នកជួលម្នាក់ៗប៉ុណ្ណោះ។</li>
            <li><strong>គ្មានការបណ្តុះបណ្តាល៖</strong> អ្នកដំណើរការធានាថារាល់ទិន្នន័យ ប្រតិបត្តិការ និងព័ត៌មានរបស់អ្នកគ្រប់គ្រង មិនត្រូវបានយកទៅប្រើប្រាស់ដើម្បីបណ្តុះបណ្តាល ឬកែលម្អម៉ូដែល AI ដើម (Base LLMs) សម្រាប់ចែករំលែកជាមួយអតិថិជនផ្សេងទៀតឡើយ។</li>
          </ul>

          <h3 style="color: #1D4592; margin-top: 30px;">៤. អ្នកដំណើរការរង និងការសវនកម្ម</h3>
          <p>អ្នកដំណើរការធ្វើការជាមួយអ្នកផ្តល់សេវាពពក (Cloud Providers) ដែលបានវាយតម្លៃត្រឹមត្រូវ (ដូចជា Supabase, Firebase) សម្រាប់ការរក្សាទុកទិន្នន័យ ក្រោមលក្ខខណ្ឌស្របតាម GDPR។ អ្នកគ្រប់គ្រងមានសិទ្ធិស្នើសុំកំណត់ហេតុសវនកម្មដែលបង្ហាញពីការចូលប្រើប្រាស់មូលដ្ឋានទិន្នន័យ។</p>

          <br/><br/>
          <table style="width: 100%; margin-top: 40px; line-height: 1.5;">
            <tr>
              <td style="width: 50%;">
                <strong>តំណាងក្រុមហ៊ុន TerraLink Inc.</strong><br/><br/>
                ___________________________<br/>
                នាយកផ្នែកអនុលោមភាពសន្តិសុខ និងឯកជនភាព
              </td>
              <td style="width: 50%;">
                <strong>តំណាងអង្គភាពអតិថិជន (Tenant)</strong><br/><br/>
                ___________________________<br/>
                អ្នកគ្រប់គ្រងប្រព័ន្ធកន្លែងធ្វើការ
              </td>
            </tr>
          </table>
        </div>
      `;
    } else {
      title = "គោលនយោបាយរក្សាទុក និងលុបទិន្នន័យ (Data Retention & Deletion Policy)";
      contentHtml = `
        <div style="font-family: 'Nokora', 'Hanuman', 'Khmer OS Battambang', sans-serif; padding: 40px; color: #333; line-height: 1.8; max-width: 800px; margin: 0 auto; text-align: justify;">
          <h1 style="text-align: center; color: #E65100;">គោលនយោបាយរក្សាទុក និងលុបទិន្នន័យ</h1>
          <h3 style="text-align: center; color: #666; font-weight: normal;">កាលបរិច្ឆេទចូលជាធរមាន៖ ថ្ងៃទី២៩ ខែមិថុនា ឆ្នាំ២០២៦ | លេខយោង៖ TL-DRP-2026</h3>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />
          
          <h3 style="color: #E65100; margin-top: 30px;">១. ទិដ្ឋភាពទូទៅនៃការរក្សាទុក និងកាលវិភាគ</h3>
          <p>គោលនយោបាយនេះកំណត់អំពីរយៈពេលនៃការរក្សាទុកទិន្នន័យរបស់អតិថិជននៅលើប្រព័ន្ធ TerraLink ក្នុងគោលបំណងការពារឯកជនភាព និងសុវត្ថិភាពព័ត៌មាន។ រយៈពេលរក្សាទុកត្រូវបានបែងចែកជា៖</p>
          <ul>
            <li><strong>ទិន្នន័យស្នូលអាជីវកម្ម៖</strong> ព័ត៌មានលក់ សារពើភ័ណ្ឌផលិតផល និងព័ត៌មានអតិថិជន ត្រូវបានរក្សាទុកជាបន្តបន្ទាប់ពេញមួយវដ្តជីវិតនៃគណនីរបស់អ្នកជួល (Tenant Workspace)។</li>
            <li><strong>កំណត់ហេតុប្រព័ន្ធ និងសវនកម្ម (Audit Logs):</strong> ព័ត៌មានអាសយដ្ឋាន IP កំណត់ត្រាចូល និងសំណើ API ត្រូវបានរក្សាទុករយៈពេល ៩០ ថ្ងៃប៉ុណ្ណោះ មុននឹងលុបចេញដោយស្វ័យប្រវត្តិ។</li>
            <li><strong>ទិន្នន័យបម្រុងទុក (Backups):</strong> រូបភាពចម្លងមូលដ្ឋានទិន្នន័យសម្រាប់ការការពារប្រព័ន្ធ ត្រូវបានរក្សាទុកក្នុងរយៈពេល ៣០ ថ្ងៃតាមគោលការណ៍ FIFO (ចូលមុន លុបមុន)។</li>
          </ul>
          
          <h3 style="color: #E65100; margin-top: 30px;">២. ដំណើរការលុបទិន្នន័យជាច្រើនដំណាក់កាល</h3>
          <p>នៅពេលអ្នកជួលស្នើសុំលុបគណនី ឬស្នើសុំលុបទិន្នន័យជាអចិន្ត្រៃយ៍៖</p>
          <ul>
            <li><strong>ដំណាក់កាលទី១ (Soft Delete):</strong> ការចូលប្រើប្រាស់គណនីត្រូវបានផ្អាកភ្លាមៗ។ ទិន្នន័យត្រូវបានរក្សាទុករយៈពេល ៣០ ថ្ងៃសម្រាប់សុវត្ថិភាព ក្នុងករណីដែលចង់ស្តារគណនីឡើងវិញ។</li>
            <li><strong>ដំណាក់កាលទី២ (Hard Purge):</strong> ក្នុងរយៈពេល ៣០ ថ្ងៃបន្ទាប់ពីដំណាក់កាលទី១ ទិន្នន័យទាំងអស់នៅក្នុងមូលដ្ឋានទិន្នន័យផលិតកម្ម នឹងត្រូវលុបចោលជាស្ថាពរ និងអចិន្ត្រៃយ៍។</li>
            <li><strong>ដំណាក់កាលទី៣ (Backup Expiration):</strong> ទិន្នន័យបម្រុងទុកដែលពាក់ព័ន្ធនឹងផុតកំណត់ និងលុបទាំងស្រុងទៅតាមវដ្ត ៣០ ថ្ងៃនៃការបម្រុងទុក។</li>
          </ul>

          <h3 style="color: #E65100; margin-top: 30px;">៣. ការរក្សាទុកតាមច្បាប់តម្រូវ</h3>
          <p>យោងតាមបទប្បញ្ញត្តិគណនេយ្យ និងពន្ធដារក្នុងស្រុក ឯកសារប្រតិបត្តិការហិរញ្ញវត្ថុមួយចំនួន (ដូចជា វិក្កយបត្រលក់) ត្រូវតែរក្សាទុករហូតដល់រយៈពេល ៧ ឆ្នាំ។ ទិន្នន័យទាំងនេះត្រូវបានបំបែកចេញ អ៊ិនគ្រីប និងដកចេញពីដំណើរការលុបស្តង់ដារ រហូតដល់ផុតកំណត់នៃច្បាប់តម្រូវ។</p>
        </div>
      `;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
            body { font-family: 'Khmer OS Battambang', 'Nokora', sans-serif; background-color: #fff; margin: 0; }
            .print-btn-container { text-align: center; padding: 20px; background-color: #f5f5f5; border-bottom: 1px solid #ddd; }
            .print-btn { background-color: #1D4592; color: white; border: none; padding: 10px 20px; font-size: 14px; font-weight: bold; cursor: pointer; border-radius: 4px; }
            .print-btn:hover { background-color: #15326b; }
          </style>
        </head>
        <body>
          <div class="print-btn-container no-print">
            <button class="print-btn" onclick="window.print()">បោះពុម្ព ឬរក្សាទុកជា PDF (Print or Save as PDF)</button>
          </div>
          ${contentHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Box sx={{ color: "#607D8B" }}>
          <Scale size={32} />
        </Box>
        <Box textAlign={"start"}>
          <Typography variant="h4" fontWeight="700" color="text.primary">Privacy & Compliance</Typography>
          <Typography variant="body2" color="text.secondary">
            Review TerraLink's data processing agreements and compliance status.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={4}>
        {/* Enterprise DPA Section */}
        <Paper sx={{ p: 4, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", textAlign: "start" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <CheckCircle size={24} color="#4CAF50" />
            <Typography variant="h6" fontWeight="600">Enterprise AI Data Processing Agreement</Typography>
          </Stack>
          
          {/* Scrollable Long Legal Document */}
          <Box sx={{ 
            maxHeight: 250, 
            overflowY: "auto", 
            p: 2, 
            mb: 3, 
            bgcolor: "action.hover", 
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            fontSize: "0.85rem",
            color: "text.secondary",
            lineHeight: 1.6
          }}>
            <Typography variant="subtitle2" fontWeight="700" color="text.primary" mb={1}>DATA PROCESSING AGREEMENT (DPA)</Typography>
            <Typography variant="body2" paragraph>
              <strong>1. Purpose, Scope, and Applicability:</strong> This Data Processing Agreement ("DPA") governs the processing of business-sensitive database queries, audit trails, and transactional records by TerraLink Inc. ("Processor") on behalf of the customer ("Controller"). This DPA is integrated into the Master Services Agreement.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>2. Data Partitioning & Tenant Isolation:</strong> The Processor warrants that Controller's data is stored in isolated logical databases. Access control policies dynamically prevent query leaks or cross-tenant storage overlaps. Data is encrypted using TLS 1.3 in transit and AES-256 at rest.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>3. No Cross-Client AI Training:</strong> The Processor guarantees that no customer database records, product listings, or custom prompts are utilized for training or fine-tuning underlying Large Language Models (LLMs) used by subprocessors or other customers. 
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>4. Subprocessors:</strong> Cloud data infrastructure is managed through verified subprocessors complying with GDPR frameworks. Audit logs of cloud operations are available to the Controller upon request.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" color="primary" onClick={handleDownloadDPA} sx={{ textTransform: "none", fontWeight: 600 }}>
              Download DPA (English)
            </Button>
            <Button variant="outlined" color="primary" onClick={() => handlePrintKhmer("dpa")} sx={{ textTransform: "none", fontWeight: 600 }}>
              Download DPA (ភាសាខ្មែរ)
            </Button>
          </Stack>
        </Paper>

        {/* Data Retention & Deletion Policy Card */}
        <Paper sx={{ p: 4, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", textAlign: "start" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <ShieldAlert size={24} color="#FF9800" />
            <Typography variant="h6" fontWeight="600">Data Retention & Deletion Policy</Typography>
          </Stack>

          {/* Scrollable Retention Policy details */}
          <Box sx={{ 
            maxHeight: 250, 
            overflowY: "auto", 
            p: 2, 
            mb: 3, 
            bgcolor: "action.hover", 
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            fontSize: "0.85rem",
            color: "text.secondary",
            lineHeight: 1.6
          }}>
            <Typography variant="subtitle2" fontWeight="700" color="text.primary" mb={1}>DATA RETENTION AND ERASURE STANDARDS</Typography>
            <Typography variant="body2" paragraph>
              <strong>1. Retention Overview:</strong> Business inventories, user tables, and client profiles are stored indefinitely while the workspace subscription remains active. Logging databases (audit trails, API query requests, modifications logs) are kept on a rolling 90-day retention schedule.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>2. Backup FIFO Schedules:</strong> Copy snapshots for data recovery are retained for 30 days before expiring. Old backups are automatically purged via a First-In-First-Out schedule.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>3. Deactivation & Hard Purge:</strong> When the Controller deletes the workspace, access tokens are immediate invalidated. Database rows enter a 30-day soft-deleted safety phase before being permanently wiped from all physical drives and production partitions.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>4. Compliance Holds:</strong> Financial ledgers and invoices are held for up to 7 years in restricted-access partitions to satisfy local tax compliance regulations, after which they are automatically zeroed.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" color="secondary" onClick={handleDownloadRetention} sx={{ textTransform: "none", fontWeight: 600 }}>
              Download Policy (English)
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => handlePrintKhmer("retention")} sx={{ textTransform: "none", fontWeight: 600 }}>
              Download Policy (ភាសាខ្មែរ)
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
