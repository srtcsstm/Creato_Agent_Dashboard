// src/api/adminMockData.js
// Bu dosya, yönetici paneli için geliştirme/tanıtım amaçlı sahte veri sağlar.

// Tarihleri DD-MM-YYYY HH:mm formatına dönüştürmek için yardımcı fonksiyon
const formatMockDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

let mockUsers = [
  { id: 'usr_1', name: 'Demo Customer 1', email: 'customer1@example.com', password_hash: 'hashedpass1', company_name: 'Acme Corp', client_id: 'client_001', created_at: formatMockDate('2023-01-15T10:00:00Z') },
  { id: 'usr_2', name: 'Demo Customer 2', email: 'customer2@example.com', password_hash: 'hashedpass2', company_name: 'Beta Ltd', client_id: 'client_002', created_at: formatMockDate('2023-02-20T11:30:00Z') },
];

let mockOffers = [
  { id: 'off_1', client_id: 'client_001', title: 'Annual Premium Plan', amount: 1200.00, status: 'Pending', sent_at: formatMockDate('2024-05-01T09:00:00Z'), offer_url: 'https://example.com/offer/001.pdf', payment_link: 'https://example.com/pay/001' },
  { id: 'off_2', client_id: 'client_002', title: 'Standard Plan Upgrade', amount: 500.00, status: 'Accepted', sent_at: formatMockDate('2024-04-10T14:00:00Z'), offer_url: 'https://example.com/offer/002.pdf', payment_link: 'https://example.com/pay/002' },
  { id: 'off_3', client_id: 'client_001', title: 'Custom Integration', amount: 2500.00, status: 'Rejected', sent_at: formatMockDate('2024-03-20T16:00:00Z'), offer_url: 'https://example.com/offer/003.pdf', payment_link: 'https://example.com/pay/003' },
  { id: 'off_4', client_id: 'client_001', title: 'Maintenance Package', amount: 300.00, status: 'Pending', sent_at: formatMockDate('2024-05-15T10:00:00Z'), offer_url: 'https://example.com/offer/004.pdf', payment_link: 'https://example.com/pay/004' },
  { id: 'off_5', client_id: 'client_001', title: 'New Feature Development', amount: 5000.00, status: 'Accepted', sent_at: formatMockDate('2024-05-10T11:00:00Z'), offer_url: 'https://example.com/offer/005.pdf', payment_link: 'https://example.com/pay/005' },
];

let mockInvoices = [
  { id: 'inv_1', client_id: 'client_001', invoice_number: 'INV-2024-001', amount: 1200.00, status: 'Pending', invoice_url: 'https://example.com/invoice/001', issued_at: formatMockDate('2024-05-05T10:00:00Z') },
  { id: 'inv_2', client_id: 'client_002', invoice_number: 'INV-2024-002', amount: 500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/002', issued_at: formatMockDate('2024-04-15T11:00:00Z') },
  { id: 'inv_3', client_id: 'client_001', invoice_number: 'INV-2024-003', amount: 2500.00, status: 'Overdue', invoice_url: 'https://example.com/invoice/003', issued_at: formatMockDate('2024-03-25T12:00:00Z') },
  { id: 'inv_4', client_id: 'client_001', invoice_number: 'INV-2023-001', amount: 1500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-001', issued_at: formatMockDate('2023-01-10T10:00:00Z') },
  { id: 'inv_5', client_id: 'client_001', invoice_number: 'INV-2023-002', amount: 2000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-002', issued_at: formatMockDate('2023-02-15T11:00:00Z') },
  { id: 'inv_6', client_id: 'client_001', invoice_number: 'INV-2023-003', amount: 1800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-003', issued_at: formatMockDate('2023-03-20T12:00:00Z') },
  { id: 'inv_7', client_id: 'client_001', invoice_number: 'INV-2023-004', amount: 2500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-004', issued_at: formatMockDate('2023-04-25T13:00:00Z') },
  { id: 'inv_8', client_id: 'client_001', invoice_number: 'INV-2023-005', amount: 1000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-005', issued_at: formatMockDate('2023-05-30T14:00:00Z') },
  { id: 'inv_9', client_id: 'client_001', invoice_number: 'INV-2023-006', amount: 3000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-006', issued_at: formatMockDate('2023-06-05T15:00:00Z') },
  { id: 'inv_10', client_id: 'client_001', invoice_number: 'INV-2023-007', amount: 2800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-007', issued_at: formatMockDate('2023-07-10T16:00:00Z') },
  { id: 'inv_11', client_id: 'client_001', invoice_number: 'INV-2023-008', amount: 1200.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-008', issued_at: formatMockDate('2023-08-15T17:00:00Z') },
  { id: 'inv_12', client_id: 'client_001', invoice_number: 'INV-2023-009', amount: 3500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-009', issued_at: formatMockDate('2023-09-20T18:00:00Z') },
  { id: 'inv_13', client_id: 'client_001', invoice_number: 'INV-2023-010', amount: 1500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-010', issued_at: formatMockDate('2023-10-25T19:00:00Z') },
  { id: 'inv_14', client_id: 'client_001', invoice_number: 'INV-2023-011', amount: 4000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-011', issued_at: formatMockDate('2023-11-30T20:00:00Z') },
  { id: 'inv_15', client_id: 'client_001', invoice_number: 'INV-2023-012', amount: 1800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-012', issued_at: formatMockDate('2023-12-05T21:00:00Z') },
  { id: 'inv_16', client_id: 'client_002', invoice_number: 'INV-2023-013', amount: 800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-013', issued_at: formatMockDate('2023-01-15T10:00:00Z') },
  { id: 'inv_17', client_id: 'client_002', invoice_number: 'INV-2023-014', amount: 1000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-014', issued_at: formatMockDate('2023-02-20T11:00:00Z') },
  { id: 'inv_18', client_id: 'client_002', invoice_number: 'INV-2023-015', amount: 700.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-015', issued_at: formatMockDate('2023-03-25T12:00:00Z') },
  { id: 'inv_19', client_id: 'client_001', invoice_number: 'INV-2024-004', amount: 1999.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-004', issued_at: formatMockDate('2024-05-10T10:00:00Z') },
  { id: 'inv_20', client_id: 'client_001', invoice_number: 'INV-2024-005', amount: 39.00, status: 'completed', invoice_url: 'https://example.com/invoice/24-005', issued_at: formatMockDate('2024-05-11T11:00:00Z') },
  { id: 'inv_21', client_id: 'client_001', invoice_number: 'INV-2024-006', amount: 299.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-006', issued_at: formatMockDate('2024-05-12T12:00:00Z') },
  { id: 'inv_22', client_id: 'client_001', invoice_number: 'INV-2024-007', amount: 99.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-007', issued_at: formatMockDate('2024-05-13T13:00:00Z') },
  { id: 'inv_23', client_id: 'client_001', invoice_number: 'INV-2024-008', amount: 39.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-008', issued_at: formatMockDate('2024-05-14T14:00:00Z') },
];


let mockMessages = [
  { id: 'msg_1', client_id: 'client_001', session_id: 'sess_abc', timestamp: formatMockDate('2024-05-10T10:00:00Z'), channel: 'Web', user_message: 'Hello, I need help with my account.', ai_response: 'Sure, I can assist you. What is your account number?' },
  { id: 'msg_2', client_id: 'client_001', session_id: 'sess_abc', timestamp: formatMockDate('2024-05-10T10:01:00Z'), channel: 'Web', user_message: 'It is 12345.', ai_response: 'Thank you. Please wait while I retrieve your details.' },
  { id: 'msg_3', client_id: 'client_002', session_id: 'sess_def', timestamp: formatMockDate('2024-05-11T11:00:00Z'), channel: 'WhatsApp', user_message: 'Hi, I have a question about my recent invoice.', ai_response: 'Certainly, which invoice number are you referring to?' },
  { id: 'msg_4', client_id: 'client_001', session_id: 'sess_xyz', timestamp: formatMockDate('2024-05-12T12:00:00Z'), channel: 'Instagram', user_message: 'How do I reset my password?', ai_response: 'I can help with that. Please provide your username.' },
  { id: 'msg_5', client_id: 'client_001', session_id: 'sess_xyz', timestamp: formatMockDate('2024-05-12T12:05:00Z'), channel: 'Instagram', user_message: 'My username is demo_user.', ai_response: 'Thank you. I have sent a password reset link to your registered email.' },
  { id: 'msg_6', client_id: 'client_002', session_id: 'sess_ghi', timestamp: formatMockDate('2024-05-13T13:00:00Z'), channel: 'Telegram', user_message: 'Can I get a demo of the new feature?', ai_response: 'Yes, I can schedule a demo for you. What is your preferred time?' },
  { id: 'msg_7', client_id: 'client_001', session_id: 'sess_new1', timestamp: formatMockDate('2024-05-16T09:00:00Z'), channel: 'Web', user_message: 'I need support for product X.', ai_response: 'Please describe your issue in more detail.' },
  { id: 'msg_8', client_id: 'client_001', session_id: 'sess_new1', timestamp: formatMockDate('2024-05-16T09:02:00Z'), channel: 'Web', user_message: 'The feature Y is not working.', ai_response: 'I see. Have you tried restarting the application?' },
  { id: 'msg_9', client_id: 'client_001', session_id: 'sess_new2', timestamp: formatMockDate('2024-05-16T10:00:00Z'), channel: 'WhatsApp', user_message: 'Hello, is anyone there?', ai_response: 'Hi! How can I help you today?' },
  { id: 'msg_10', client_id: 'client_001', session_id: 'sess_new2', timestamp: formatMockDate('2024-05-16T10:01:00Z'), channel: 'WhatsApp', user_message: 'I want to know about pricing.', ai_response: 'Our pricing details are available on our website.' },
  { id: 'msg_11', client_id: 'client_001', session_id: 'sess_abc', timestamp: formatMockDate('2024-05-10T10:02:00Z'), channel: 'Web', user_message: 'Thanks for your help!', ai_response: 'You\'re welcome!' },
  { id: 'msg_12', client_id: 'client_001', session_id: 'sess_new3', timestamp: formatMockDate('2024-05-17T11:00:00Z'), channel: 'Telegram', user_message: 'I have a new question.', ai_response: 'How can I assist you?' },
  { id: 'msg_13', client_id: 'client_001', session_id: 'sess_new3', timestamp: formatMockDate('2024-05-17T11:05:00Z'), channel: 'Telegram', user_message: 'It is about billing.', ai_response: 'Please provide your invoice number.' },
  { id: 'msg_14', client_id: 'client_002', session_id: 'sess_def', timestamp: formatMockDate('2024-05-11T11:02:00Z'), channel: 'WhatsApp', user_message: 'Invoice INV-2024-002.', ai_response: 'Checking details for INV-2024-002.' },
  { id: 'msg_15', client_id: 'client_002', session_id: 'sess_def', timestamp: formatMockDate('2024-05-11T11:05:00Z'), channel: 'WhatsApp', user_message: 'It seems correct now.', ai_response: 'Glad to hear that!' },
];

let mockCalls = [
  { id: 'call_1', client_id: 'client_001', date: formatMockDate('2024-05-09T00:00:00Z'), duration: 120, duration_minutes: 2, summary: 'Customer inquired about service upgrade.', details: 'The customer called to ask about upgrading their current service plan. They were interested in the premium features and asked about pricing. Agent provided details and offered to send a proposal.' },
  { id: 'call_2', client_id: 'client_002', date: formatMockDate('2024-05-08T00:00:00Z'), duration: 300, duration_minutes: 5, summary: 'Support call regarding a technical issue.', details: 'Customer reported an issue with their dashboard not loading correctly. Agent guided them through troubleshooting steps, which resolved the problem. Customer was satisfied.' },
  { id: 'call_3', client_id: 'client_001', date: formatMockDate('2024-05-07T00:00:00Z'), duration: 60, duration_minutes: 1, summary: 'Quick follow-up on a previous proposal.', details: 'Short call to follow up on the proposal sent last week. Customer confirmed receipt and said they would review it by end of day.' },
  { id: 'call_4', client_id: 'client_001', date: formatMockDate('2024-05-10T00:00:00Z'), duration: 180, duration_minutes: 3, summary: 'New client onboarding call.', details: 'Onboarding call with a new client to explain dashboard features and initial setup. Covered data import and user management.' },
  { id: 'call_5', client_id: 'client_002', date: formatMockDate('2024-05-11T00:00:00Z'), duration: 90, duration_minutes: 1.5, summary: 'Billing inquiry.', details: 'Client called to clarify a charge on their latest invoice. Explained the breakdown of services and charges.' },
  { id: 'call_6', client_id: 'client_001', date: formatMockDate('2024-05-12T00:00:00Z'), duration: 240, duration_minutes: 4, summary: 'Product demo and Q&A.', details: 'Provided a detailed demo of Product Z and answered all client questions regarding its features and benefits.' },
  { id: 'call_7', client_id: 'client_001', date: formatMockDate('2024-05-13T00:00:00Z'), duration: 150, duration_minutes: 2.5, summary: 'Technical support for integration.', details: 'Assisted client with integrating our API. Troubleshooted connection issues and guided them through the setup process.' },
];

let mockDashboardLogs = [
  { id: 'log_1', client_id: 'client_001', date: formatMockDate('2024-05-01T00:00:00Z'), message_count: 50, call_count: 5, avg_response_time: 1.2 },
  { id: 'log_2', client_id: 'client_001', date: formatMockDate('2024-05-02T00:00:00Z'), message_count: 60, call_count: 7, avg_response_time: 1.1 },
  { id: 'log_3', client_id: 'client_001', date: formatMockDate('2024-05-03T00:00:00Z'), message_count: 55, call_count: 6, avg_response_time: 1.3 },
  { id: 'log_4', client_id: 'client_001', date: formatMockDate('2024-05-04T00:00:00Z'), message_count: 70, call_count: 8, avg_response_time: 1.0 },
  { id: 'log_5', client_id: 'client_001', date: formatMockDate('2024-05-05T00:00:00Z'), message_count: 65, call_count: 7, avg_response_time: 1.2 },
  { id: 'log_6', client_id: 'client_001', date: formatMockDate('2024-05-06T00:00:00Z'), message_count: 75, call_count: 9, avg_response_time: 0.9 },
  { id: 'log_7', client_id: 'client_001', date: formatMockDate('2024-05-07T00:00:00Z'), message_count: 80, call_count: 10, avg_response_time: 0.8 },
  { id: 'log_8', client_id: 'client_001', date: formatMockDate('2024-05-08T00:00:00Z'), message_count: 85, call_count: 11, avg_response_time: 0.9 },
  { id: 'log_9', client_id: 'client_001', date: formatMockDate('2024-05-09T00:00:00Z'), message_count: 90, call_count: 12, avg_response_time: 0.85 },
  { id: 'log_10', client_id: 'client_001', date: formatMockDate('2024-05-10T00:00:00Z'), message_count: 95, call_count: 13, avg_response_time: 0.95 },
  { id: 'log_11', client_id: 'client_001', date: formatMockDate('2024-05-11T00:00:00Z'), message_count: 100, call_count: 14, avg_response_time: 0.9 },
  { id: 'log_12', client_id: 'client_001', date: formatMockDate('2024-05-12T00:00:00Z'), message_count: 105, call_count: 15, avg_response_time: 0.8 },
  { id: 'log_13', client_id: 'client_002', date: formatMockDate('2024-05-01T00:00:00Z'), message_count: 30, call_count: 2, avg_response_time: 1.5 },
  { id: 'log_14', client_id: 'client_002', date: formatMockDate('2024-05-02T00:00:00Z'), message_count: 35, call_count: 3, avg_response_time: 1.4 },
];

let mockLeads = [
  { id: 'lead_1', client_id: 'client_001', name: 'John Doe', email: 'john@example.com', phone: '111-222-3333', interest: 'Product A', timestamp: formatMockDate('2024-05-01T10:00:00Z') },
  { id: 'lead_2', client_id: 'client_001', name: 'Jane Smith', email: 'jane@example.com', phone: '444-555-6666', interest: 'Service B', timestamp: formatMockDate('2024-05-03T11:00:00Z') },
  { id: 'lead_3', client_id: 'client_002', name: 'Peter Jones', email: 'peter@example.com', phone: '777-888-9999', interest: 'Product C', timestamp: formatMockDate('2024-05-05T12:00:00Z') },
  { id: 'lead_4', client_id: 'client_001', name: 'Alice Brown', email: 'alice@example.com', phone: '123-456-7890', interest: 'Service A', timestamp: formatMockDate('2024-05-07T13:00:00Z') },
  { id: 'lead_5', client_id: 'client_001', name: 'Bob White', email: 'bob@example.com', phone: '987-654-3210', interest: 'Product B', timestamp: formatMockDate('2024-05-07T14:00:00Z') },
  { id: 'lead_6', client_id: 'client_001', name: 'Charlie Green', email: 'charlie@example.2com', phone: '555-123-4567', interest: 'Product A', timestamp: formatMockDate('2024-05-08T10:00:00Z') },
  { id: 'lead_7', client_id: 'client_001', name: 'Diana Prince', email: 'diana@example.com', phone: '555-987-6543', interest: 'Service B', timestamp: formatMockDate('2024-05-09T11:00:00Z') },
  { id: 'lead_8', client_id: 'client_002', name: 'Eve Adams', email: 'eve@example.com', phone: '555-111-2222', interest: 'Product C', timestamp: formatMockDate('2024-05-10T12:00:00Z') },
];

let mockPayments = [
  { id: 'pay_1', client_id: 'client_001', invoice_id: 'inv_2', amount: 500.00, status: 'completed', payment_date: formatMockDate('2024-04-16T00:00:00Z') },
  { id: 'pay_2', client_id: 'client_002', invoice_id: 'inv_1', amount: 1200.00, status: 'completed', payment_date: formatMockDate('2024-05-06T00:00:00Z') },
  { id: 'pay_3', client_id: 'client_001', invoice_id: 'inv_19', amount: 1999.00, status: 'completed', payment_date: formatMockDate('2024-05-10T00:00:00Z') },
  { id: 'pay_4', client_id: 'client_001', invoice_id: 'inv_20', amount: 39.00, status: 'completed', payment_date: formatMockDate('2024-05-11T00:00:00Z') },
  { id: 'pay_5', client_id: 'client_001', invoice_id: 'inv_21', amount: 299.00, status: 'completed', payment_date: formatMockDate('2024-05-12T00:00:00Z') },
];

let mockNotifications = [
  { id: 'notif_1', client_id: 'client_001', type: 'lead', title: 'Yeni lead oluşturuldu', description: 'Facebook üzerinden yeni bir lead toplandı.', status: 'unread', created_at: '27-07-2025 14:23', link: '/leads', priority: 'normal', source_id: 'lead_1' },
  { id: 'notif_2', client_id: 'client_001', type: 'call', title: 'Çağrı tamamlandı', description: '3 dakikalık bir çağrı görüşmesi sona erdi.', status: 'read', created_at: '27-07-2025 10:40', link: '/calls', priority: 'low', source_id: 'call_1' },
  { id: 'notif_3', client_id: 'client_002', type: 'offer', title: 'Yeni teklif hazırlandı', description: 'Domates hattı projesi için teklif sunuldu.', status: 'unread', created_at: '26-07-2025 17:05', link: '/proposals', priority: 'high', source_id: 'off_3' },
  { id: 'notif_4', client_id: 'client_001', type: 'invoice', title: 'Yeni fatura oluşturuldu', description: 'INV-2024-001 numaralı fatura oluşturuldu.', status: 'unread', created_at: '27-07-2025 15:00', link: '/invoices', priority: 'normal', source_id: 'inv_1' },
  { id: 'notif_5', client_id: 'client_001', type: 'system', title: 'Sistem Bakımı', description: 'Planlı sistem bakımı bu gece 02:00-04:00 arası yapılacaktır.', status: 'unread', created_at: '27-07-2025 09:00', link: '#', priority: 'high', source_id: 'sys_1' },
  { id: 'notif_6', client_id: 'client_001', type: 'lead', title: 'Yeni lead', description: 'Web sitesinden yeni bir lead geldi.', status: 'unread', created_at: '27-07-2025 16:00', link: '/leads', priority: 'normal', source_id: 'lead_2' },
];


const generateUniqueId = (prefix) => {
  return prefix + '_' + Math.random().toString(36).substr(2, 9);
};

export const mockFetch = async (tableName) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  switch (tableName) {
    case 'users':
      return [...mockUsers];
    case 'offers':
      return [...mockOffers];
    case 'invoices':
      return [...mockInvoices];
    case 'messages':
      return [...mockMessages];
    case 'calls':
      return [...mockCalls];
    case 'dashboard_logs':
      return [...mockDashboardLogs];
    case 'leads':
      return [...mockLeads];
    case 'payments':
      return [...mockPayments];
    case 'notifications':
      return [...mockNotifications];
    default:
      return [];
  }
};

export const mockCreate = async (tableName, data) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  const newItem = { id: generateUniqueId(tableName.slice(0, 3)), ...data };
  switch (tableName) {
    case 'users':
      mockUsers.push(newItem);
      break;
    case 'offers':
      mockOffers.push(newItem);
      break;
    case 'invoices':
      mockInvoices.push(newItem);
      break;
    case 'messages':
      mockMessages.push(newItem);
      break;
    case 'calls':
      mockCalls.push(newItem);
      break;
    case 'dashboard_logs':
      mockDashboardLogs.push(newItem);
      break;
    case 'leads':
      mockLeads.push(newItem);
      break;
    case 'payments':
      mockPayments.push(newItem);
      break;
    case 'notifications':
      mockNotifications.push(newItem);
      break;
    default:
      break;
  }
  return newItem;
};

export const mockUpdate = async (tableName, id, data) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  let collection;
  switch (tableName) {
    case 'users':
      collection = mockUsers;
      break;
    case 'offers':
      collection = mockOffers;
      break;
    case 'invoices':
      collection = mockInvoices;
      break;
    case 'messages':
      collection = mockMessages;
      break;
    case 'calls':
      collection = mockCalls;
      break;
    case 'dashboard_logs':
      collection = mockDashboardLogs;
      break;
    case 'leads':
      collection = mockLeads;
      break;
    case 'payments':
      collection = mockPayments;
      break;
    case 'notifications':
      collection = mockNotifications;
      break;
    default:
      return null;
  }
  const index = collection.findIndex(item => item.id === id);
  if (index !== -1) {
    collection[index] = { ...collection[index], ...data };
    return collection[index];
  }
  return null;
};

export const mockDelete = async (tableName, id) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  let collection;
  switch (tableName) {
    case 'users':
      collection = mockUsers;
      break;
    case 'offers':
      collection = mockOffers;
      break;
    case 'invoices':
      collection = mockInvoices;
      break;
    case 'messages':
      collection = mockMessages;
      break;
    case 'calls':
      collection = mockCalls;
      break;
    case 'dashboard_logs':
      collection = mockDashboardLogs;
      break;
    case 'leads':
      collection = mockLeads;
      break;
    case 'payments':
      collection = mockPayments;
      break;
    case 'notifications':
      collection = mockNotifications;
      break;
    default:
      return false;
  }
  const initialLength = collection.length;
  const updatedCollection = collection.filter(item => item.id !== id);
  if (tableName === 'users') mockUsers = updatedCollection;
  if (tableName === 'offers') mockOffers = updatedCollection;
  if (tableName === 'invoices') mockInvoices = updatedCollection;
  if (tableName === 'messages') mockMessages = updatedCollection;
  if (tableName === 'calls') mockCalls = updatedCollection;
  if (tableName === 'dashboard_logs') mockDashboardLogs = updatedCollection;
  if (tableName === 'leads') mockLeads = updatedCollection;
  if (tableName === 'payments') mockPayments = updatedCollection;
  if (tableName === 'notifications') mockNotifications = updatedCollection;
  return updatedCollection.length < initialLength;
};
