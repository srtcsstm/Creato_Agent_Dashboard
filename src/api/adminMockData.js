// src/api/adminMockData.js
// Bu dosya, yönetici paneli için geliştirme/tanıtım amaçlı sahte veri sağlar.

// Tarihleri ISO 8601 formatına dönüştürmek için yardımcı fonksiyon
// NocoDB'nin genellikle döndürdüğü formatı taklit etmek için kullanıyoruz.
const formatMockDateToISO = (date) => {
  return date.toISOString();
};

// Güncel tarihe yakın mock veriler oluşturmak için yardımcı fonksiyon
const getRecentDate = (daysAgo, hoursAgo = 0, minutesAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  return formatMockDateToISO(date);
};

let mockUsers = [
  { id: 'usr_1', name: 'Demo Customer 1', email: 'customer1@example.com', password_hash: 'hashedpass1', company_name: 'Acme Corp', client_id: 'client_001', created_date: getRecentDate(10) },
  { id: 'usr_2', name: 'Demo Customer 2', email: 'customer2@example.com', password_hash: 'hashedpass2', company_name: 'Beta Ltd', client_id: 'client_002', created_date: getRecentDate(20) },
];

let mockOffers = [
  { id: 'off_1', client_id: 'client_001', title: 'Annual Premium Plan', amount: 1200.00, status: 'Pending', sent_at: getRecentDate(5, 2), created_date: getRecentDate(5, 2), offer_url: 'https://example.com/offer/001.pdf', payment_link: 'https://example.com/pay/001' },
  { id: 'off_2', client_id: 'client_002', title: 'Standard Plan Upgrade', amount: 500.00, status: 'Accepted', sent_at: getRecentDate(15, 5), created_date: getRecentDate(15, 5), offer_url: 'https://example.com/offer/002.pdf', payment_link: 'https://example.com/pay/002' },
  { id: 'off_3', client_id: 'client_001', title: 'Custom Integration', amount: 2500.00, status: 'Rejected', sent_at: getRecentDate(25, 1), created_date: getRecentDate(25, 1), offer_url: 'https://example.com/offer/003.pdf', payment_link: 'https://example.com/pay/003' },
  { id: 'off_4', client_id: 'client_001', title: 'Maintenance Package', amount: 300.00, status: 'Pending', sent_at: getRecentDate(2, 10), created_date: getRecentDate(2, 10), offer_url: 'https://example.com/offer/004.pdf', payment_link: 'https://example.com/pay/004' },
  { id: 'off_5', client_id: 'client_001', title: 'New Feature Development', amount: 5000.00, status: 'Accepted', sent_at: getRecentDate(7, 3), created_date: getRecentDate(7, 3), offer_url: 'https://example.com/offer/005.pdf', payment_link: 'https://example.com/pay/005' },
  // Adding more recent offers for client_001
  { id: 'off_6', client_id: 'client_001', title: 'Q3 Marketing Campaign', amount: 1500.00, status: 'Pending', sent_at: getRecentDate(1), created_date: getRecentDate(1), offer_url: 'https://example.com/offer/006.pdf', payment_link: 'https://example.com/pay/006' },
  { id: 'off_7', client_id: 'client_001', title: 'Website Redesign', amount: 3000.00, status: 'Accepted', sent_at: getRecentDate(5), created_date: getRecentDate(5), offer_url: 'https://example.com/offer/007.pdf', payment_link: 'https://example.com/pay/007' },
  { id: 'off_8', client_id: 'client_001', title: 'SEO Optimization', amount: 800.00, status: 'Rejected', sent_at: getRecentDate(10), created_date: getRecentDate(10), offer_url: 'https://example.com/offer/008.pdf', payment_link: 'https://example.com/pay/008' },
];

let mockInvoices = [
  { id: 'inv_1', client_id: 'client_001', invoice_number: 'INV-2024-001', amount: 1200.00, status: 'Pending', invoice_url: 'https://example.com/invoice/001', issued_at: getRecentDate(3, 1), created_date: getRecentDate(3, 1) },
  { id: 'inv_2', client_id: 'client_002', invoice_number: 'INV-2024-002', amount: 500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/002', issued_at: getRecentDate(10, 4), created_date: getRecentDate(10, 4) },
  { id: 'inv_3', client_id: 'client_001', invoice_number: 'INV-2024-003', amount: 2500.00, status: 'Overdue', invoice_url: 'https://example.com/invoice/003', issued_at: getRecentDate(20, 8), created_date: getRecentDate(20, 8) },
  { id: 'inv_4', client_id: 'client_001', invoice_number: 'INV-2023-001', amount: 1500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-001', issued_at: getRecentDate(365, 1), created_date: getRecentDate(365, 1) },
  { id: 'inv_5', client_id: 'client_001', invoice_number: 'INV-2023-002', amount: 2000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-002', issued_at: getRecentDate(300, 2), created_date: getRecentDate(300, 2) },
  { id: 'inv_6', client_id: 'client_001', invoice_number: 'INV-2023-003', amount: 1800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-003', issued_at: getRecentDate(270, 3), created_date: getRecentDate(270, 3) },
  { id: 'inv_7', client_id: 'client_001', invoice_number: 'INV-2023-004', amount: 2500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-004', issued_at: getRecentDate(240, 4), created_date: getRecentDate(240, 4) },
  { id: 'inv_8', client_id: 'client_001', invoice_number: 'INV-2023-005', amount: 1000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-005', issued_at: getRecentDate(210, 5), created_date: getRecentDate(210, 5) },
  { id: 'inv_9', client_id: 'client_001', invoice_number: 'INV-2023-006', amount: 3000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-006', issued_at: getRecentDate(180, 6), created_date: getRecentDate(180, 6) },
  { id: 'inv_10', client_id: 'client_001', invoice_number: 'INV-2023-007', amount: 2800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-007', issued_at: getRecentDate(150, 7), created_date: getRecentDate(150, 7) },
  { id: 'inv_11', client_id: 'client_001', invoice_number: 'INV-2023-008', amount: 1200.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-008', issued_at: getRecentDate(120, 8), created_date: getRecentDate(120, 8) },
  { id: 'inv_12', client_id: 'client_001', invoice_number: 'INV-2023-009', amount: 3500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-009', issued_at: getRecentDate(90, 9), created_date: getRecentDate(90, 9) },
  { id: 'inv_13', client_id: 'client_001', invoice_number: 'INV-2023-010', amount: 1500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-010', issued_at: getRecentDate(60, 10), created_date: getRecentDate(60, 10) },
  { id: 'inv_14', client_id: 'client_001', invoice_number: 'INV-2023-011', amount: 4000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-011', issued_at: getRecentDate(30, 11), created_date: getRecentDate(30, 11) },
  { id: 'inv_15', client_id: 'client_001', invoice_number: 'INV-2023-012', amount: 1800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-012', issued_at: getRecentDate(1, 12), created_date: getRecentDate(1, 12) },
  { id: 'inv_16', client_id: 'client_002', invoice_number: 'INV-2023-013', amount: 800.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-013', issued_at: getRecentDate(400, 1), created_date: getRecentDate(400, 1) },
  { id: 'inv_17', client_id: 'client_002', invoice_number: 'INV-2023-014', amount: 1000.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-014', issued_at: getRecentDate(350, 2), created_date: getRecentDate(350, 2) },
  { id: 'inv_18', client_id: 'client_002', invoice_number: 'INV-2023-015', amount: 700.00, status: 'Paid', invoice_url: 'https://example.com/invoice/23-015', issued_at: getRecentDate(280, 3), created_date: getRecentDate(280, 3) },
  { id: 'inv_19', client_id: 'client_001', invoice_number: 'INV-2024-004', amount: 1999.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-004', issued_at: getRecentDate(5, 1), created_date: getRecentDate(5, 1) },
  { id: 'inv_20', client_id: 'client_001', invoice_number: 'INV-2024-005', amount: 39.00, status: 'completed', invoice_url: 'https://example.com/invoice/24-005', issued_at: getRecentDate(4, 2), created_date: getRecentDate(4, 2) },
  { id: 'inv_21', client_id: 'client_001', invoice_number: 'INV-2024-006', amount: 299.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-006', issued_at: getRecentDate(3, 3), created_date: getRecentDate(3, 3) },
  { id: 'inv_22', client_id: 'client_001', invoice_number: 'INV-2024-007', amount: 99.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-007', issued_at: getRecentDate(2, 4), created_date: getRecentDate(2, 4) },
  { id: 'inv_23', client_id: 'client_001', invoice_number: 'INV-2024-008', amount: 39.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-008', issued_at: getRecentDate(1, 5), created_date: getRecentDate(1, 5) },
  // Adding more recent invoices for client_001
  { id: 'inv_24', client_id: 'client_001', invoice_number: 'INV-2024-009', amount: 150.00, status: 'Pending', invoice_url: 'https://example.com/invoice/24-009', issued_at: getRecentDate(0, 1), created_date: getRecentDate(0, 1) },
  { id: 'inv_25', client_id: 'client_001', invoice_number: 'INV-2024-010', amount: 500.00, status: 'Paid', invoice_url: 'https://example.com/invoice/24-010', issued_at: getRecentDate(2), created_date: getRecentDate(2) },
];


let mockMessages = [
  { id: 'msg_1', client_id: 'client_001', session_id: 'sess_abc', timestamp: getRecentDate(0, 0, 5), created_date: getRecentDate(0, 0, 5), channel: 'Web', user_message: 'Hello, I need help with my account.', ai_response: 'Sure, I can assist you. What is your account number?' },
  { id: 'msg_2', client_id: 'client_001', session_id: 'sess_abc', timestamp: getRecentDate(0, 0, 10), created_date: getRecentDate(0, 0, 10), channel: 'Web', user_message: 'It is 12345.', ai_response: 'Thank you. Please wait while I retrieve your details.' },
  { id: 'msg_3', client_id: 'client_002', session_id: 'sess_def', timestamp: getRecentDate(2, 1, 0), created_date: getRecentDate(2, 1, 0), channel: 'WhatsApp', user_message: 'Hi, I have a question about my recent invoice.', ai_response: 'Certainly, which invoice number are you referring to?' },
  { id: 'msg_4', client_id: 'client_001', session_id: 'sess_xyz', timestamp: getRecentDate(1, 2, 0), created_date: getRecentDate(1, 2, 0), channel: 'Instagram', user_message: 'How do I reset my password?', ai_response: 'I can help with that. Please provide your username.' },
  { id: 'msg_5', client_id: 'client_001', session_id: 'sess_xyz', timestamp: getRecentDate(1, 2, 5), created_date: getRecentDate(1, 2, 5), channel: 'Instagram', user_message: 'My username is demo_user.', ai_response: 'Thank you. I have sent a password reset link to your registered email.' },
  { id: 'msg_6', client_id: 'client_002', session_id: 'sess_ghi', timestamp: getRecentDate(4, 3, 0), created_date: getRecentDate(4, 3, 0), channel: 'Telegram', user_message: 'Can I get a demo of the new feature?', ai_response: 'Yes, I can schedule a demo for you. What is your preferred time?' },
  { id: 'msg_7', client_id: 'client_001', session_id: 'sess_new1', timestamp: getRecentDate(5, 4, 0), created_date: getRecentDate(5, 4, 0), channel: 'Web', user_message: 'I need support for product X.', ai_response: 'Please describe your issue in more detail.' },
  { id: 'msg_8', client_id: 'client_001', session_id: 'sess_new1', timestamp: getRecentDate(5, 4, 2), created_date: getRecentDate(5, 4, 2), channel: 'Web', user_message: 'The feature Y is not working.', ai_response: 'I see. Have you tried restarting the application?' },
  { id: 'msg_9', client_id: 'client_001', session_id: 'sess_new2', timestamp: getRecentDate(6, 5, 0), created_date: getRecentDate(6, 5, 0), channel: 'WhatsApp', user_message: 'Hello, is anyone there?', ai_response: 'Hi! How can I help you today?' },
  { id: 'msg_10', client_id: 'client_001', session_id: 'sess_new2', timestamp: getRecentDate(6, 5, 1), created_date: getRecentDate(6, 5, 1), channel: 'WhatsApp', user_message: 'I want to know about pricing.', ai_response: 'Our pricing details are available on our website.' },
  { id: 'msg_11', client_id: 'client_001', session_id: 'sess_abc', timestamp: getRecentDate(0, 0, 15), created_date: getRecentDate(0, 0, 15), channel: 'Web', user_message: 'Thanks for your help!', ai_response: 'You\'re welcome!' },
  { id: 'msg_12', client_id: 'client_001', session_id: 'sess_new3', timestamp: getRecentDate(7, 6, 0), created_date: getRecentDate(7, 6, 0), channel: 'Telegram', user_message: 'I have a new question.', ai_response: 'How can I assist you?' },
  { id: 'msg_13', client_id: 'client_001', session_id: 'sess_new3', timestamp: getRecentDate(7, 6, 5), created_date: getRecentDate(7, 6, 5), channel: 'Telegram', user_message: 'It is about billing.', ai_response: 'Please provide your invoice number.' },
  { id: 'msg_14', client_id: 'client_002', session_id: 'sess_def', timestamp: getRecentDate(2, 1, 2), created_date: getRecentDate(2, 1, 2), channel: 'WhatsApp', user_message: 'Invoice INV-2024-002.', ai_response: 'Checking details for INV-2024-002.' },
  { id: 'msg_15', client_id: 'client_002', session_id: 'sess_def', timestamp: getRecentDate(2, 1, 5), created_date: getRecentDate(2, 1, 5), channel: 'WhatsApp', user_message: 'It seems correct now.', ai_response: 'Glad to hear that!' },
  // Adding more recent messages for client_001 to ensure data for last 30 days
  { id: 'msg_16', client_id: 'client_001', session_id: 'sess_recent_1', timestamp: getRecentDate(0, 0, 1), created_date: getRecentDate(0, 0, 1), channel: 'Web', user_message: 'Latest web message.', ai_response: 'Acknowledged.' },
  { id: 'msg_17', client_id: 'client_001', session_id: 'sess_recent_1', timestamp: getRecentDate(0, 0, 2), created_date: getRecentDate(0, 0, 2), channel: 'Web', user_message: 'Another web message.', ai_response: 'Understood.' },
  { id: 'msg_18', client_id: 'client_001', session_id: 'sess_recent_2', timestamp: getRecentDate(0, 1, 0), created_date: getRecentDate(0, 1, 0), channel: 'WhatsApp', user_message: 'Latest WhatsApp message.', ai_response: 'Got it.' },
  { id: 'msg_19', client_id: 'client_001', session_id: 'sess_recent_3', timestamp: getRecentDate(0, 2, 0), created_date: getRecentDate(0, 2, 0), channel: 'Instagram', user_message: 'Latest Instagram message.', ai_response: 'Received.' },
  { id: 'msg_20', client_id: 'client_001', session_id: 'sess_recent_4', timestamp: getRecentDate(0, 3, 0), created_date: getRecentDate(0, 3, 0), channel: 'Telegram', user_message: 'Latest Telegram message.', ai_response: 'Processing.' },
  { id: 'msg_21', client_id: 'client_001', session_id: 'sess_recent_5', timestamp: getRecentDate(1, 0, 0), created_date: getRecentDate(1, 0, 0), channel: 'Web', user_message: 'Another web message from yesterday.', ai_response: 'Okay.' },
  { id: 'msg_22', client_id: 'client_001', session_id: 'sess_recent_6', timestamp: getRecentDate(1, 1, 0), created_date: getRecentDate(1, 1, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from yesterday.', ai_response: 'Understood.' },
  { id: 'msg_23', client_id: 'client_001', session_id: 'sess_recent_7', timestamp: getRecentDate(2, 0, 0), created_date: getRecentDate(2, 0, 0), channel: 'Web', user_message: 'Web message from 2 days ago.', ai_response: 'Confirmed.' },
  { id: 'msg_24', client_id: 'client_001', session_id: 'sess_recent_8', timestamp: getRecentDate(2, 1, 0), created_date: getRecentDate(2, 1, 0), channel: 'Instagram', user_message: 'Instagram message from 2 days ago.', ai_response: 'Acknowledged.' },
  { id: 'msg_25', client_id: 'client_001', session_id: 'sess_recent_9', timestamp: getRecentDate(3, 0, 0), created_date: getRecentDate(3, 0, 0), channel: 'Web', user_message: 'Web message from 3 days ago.', ai_response: 'Got it.' },
  { id: 'msg_26', client_id: 'client_001', session_id: 'sess_recent_10', timestamp: getRecentDate(4, 0, 0), created_date: getRecentDate(4, 0, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 4 days ago.', ai_response: 'Okay.' },
  { id: 'msg_27', client_id: 'client_001', session_id: 'sess_recent_11', timestamp: getRecentDate(5, 0, 0), created_date: getRecentDate(5, 0, 0), channel: 'Web', user_message: 'Web message from 5 days ago.', ai_response: 'Understood.' },
  { id: 'msg_28', client_id: 'client_001', session_id: 'sess_recent_12', timestamp: getRecentDate(6, 0, 0), created_date: getRecentDate(6, 0, 0), channel: 'Instagram', user_message: 'Instagram message from 6 days ago.', ai_response: 'Confirmed.' },
  { id: 'msg_29', client_id: 'client_001', session_id: 'sess_recent_13', timestamp: getRecentDate(7, 0, 0), created_date: getRecentDate(7, 0, 0), channel: 'Web', user_message: 'Web message from 7 days ago.', ai_response: 'Acknowledged.' },
  { id: 'msg_30', client_id: 'client_001', session_id: 'sess_recent_14', timestamp: getRecentDate(8, 0, 0), created_date: getRecentDate(8, 0, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 8 days ago.', ai_response: 'Got it.' },
  { id: 'msg_31', client_id: 'client_001', session_id: 'sess_recent_15', timestamp: getRecentDate(9, 0, 0), created_date: getRecentDate(9, 0, 0), channel: 'Web', user_message: 'Web message from 9 days ago.', ai_response: 'Okay.' },
  { id: 'msg_32', client_id: 'client_001', session_id: 'sess_recent_16', timestamp: getRecentDate(10, 0, 0), created_date: getRecentDate(10, 0, 0), channel: 'Instagram', user_message: 'Instagram message from 10 days ago.', ai_response: 'Understood.' },
  { id: 'msg_33', client_id: 'client_001', session_id: 'sess_recent_17', timestamp: getRecentDate(11, 0, 0), created_date: getRecentDate(11, 0, 0), channel: 'Web', user_message: 'Web message from 11 days ago.', ai_response: 'Confirmed.' },
  { id: 'msg_34', client_id: 'client_001', session_id: 'sess_recent_18', timestamp: getRecentDate(12, 0, 0), created_date: getRecentDate(12, 0, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 12 days ago.', ai_response: 'Acknowledged.' },
  { id: 'msg_35', client_id: 'client_001', session_id: 'sess_recent_19', timestamp: getRecentDate(13, 0, 0), created_date: getRecentDate(13, 0, 0), channel: 'Web', user_message: 'Web message from 13 days ago.', ai_response: 'Got it.' },
  { id: 'msg_36', client_id: 'client_001', session_id: 'sess_recent_20', timestamp: getRecentDate(14, 0, 0), created_date: getRecentDate(14, 0, 0), channel: 'Instagram', user_message: 'Instagram message from 14 days ago.', ai_response: 'Okay.' },
  { id: 'msg_37', client_id: 'client_001', session_id: 'sess_recent_21', timestamp: getRecentDate(15, 0, 0), created_date: getRecentDate(15, 0, 0), channel: 'Web', user_message: 'Web message from 15 days ago.', ai_response: 'Understood.' },
  { id: 'msg_38', client_id: 'client_001', session_id: 'sess_recent_22', timestamp: getRecentDate(16, 0, 0), created_date: getRecentDate(16, 0, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 16 days ago.', ai_response: 'Confirmed.' },
  { id: 'msg_39', client_id: 'client_001', session_id: 'sess_recent_23', timestamp: getRecentDate(17, 0, 0), created_date: getRecentDate(17, 0, 0), channel: 'Web', user_message: 'Web message from 17 days ago.', ai_response: 'Acknowledged.' },
  { id: 'msg_40', client_id: 'client_001', session_id: 'sess_recent_24', timestamp: getRecentDate(18, 0, 0), created_date: getRecentDate(18, 0, 0), channel: 'Instagram', user_message: 'Instagram message from 18 days ago.', ai_response: 'Got it.' },
  { id: 'msg_41', client_id: 'client_001', session_id: 'sess_recent_25', timestamp: getRecentDate(19, 0, 0), created_date: getRecentDate(19, 0, 0), channel: 'Web', user_message: 'Web message from 19 days ago.', ai_response: 'Okay.' },
  { id: 'msg_42', client_id: 'client_001', session_id: 'sess_recent_26', timestamp: getRecentDate(20, 0, 0), created_date: getRecentDate(20, 0, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 20 days ago.', ai_response: 'Understood.' },
  { id: 'msg_43', client_id: 'client_001', session_id: 'sess_recent_27', timestamp: getRecentDate(21, 0, 0), created_date: getRecentDate(21, 0, 0), channel: 'Web', user_message: 'Web message from 21 days ago.', ai_response: 'Confirmed.' },
  { id: 'msg_44', client_id: 'client_001', session_id: 'sess_recent_28', timestamp: getRecentDate(22, 0, 0), created_date: getRecentDate(22, 0, 0), channel: 'Instagram', user_message: 'Instagram message from 22 days ago.', ai_response: 'Acknowledged.' },
  { id: 'msg_45', client_id: 'client_001', session_id: 'sess_recent_29', timestamp: getRecentDate(23, 0, 0), created_date: getRecentDate(23, 0, 0), channel: 'Web', user_message: 'Web message from 23 days ago.', ai_response: 'Got it.' },
  { id: 'msg_46', client_id: 'client_001', session_id: 'sess_recent_30', timestamp: getRecentDate(24, 0, 0), created_date: getRecentDate(24, 0, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 24 days ago.', ai_response: 'Okay.' },
  { id: 'msg_47', client_id: 'client_001', session_id: 'sess_recent_31', timestamp: getRecentDate(25, 0, 0), created_date: getRecentDate(25, 0, 0), channel: 'Web', user_message: 'Web message from 25 days ago.', ai_response: 'Understood.' },
  { id: 'msg_48', client_id: 'client_001', session_id: 'sess_recent_32', timestamp: getRecentDate(26, 0, 0), created_date: getRecentDate(26, 0, 0), channel: 'Instagram', user_message: 'Instagram message from 26 days ago.', ai_response: 'Confirmed.' },
  { id: 'msg_49', client_id: 'client_001', session_id: 'sess_recent_33', timestamp: getRecentDate(27, 0, 0), created_date: getRecentDate(27, 0, 0), channel: 'Web', user_message: 'Web message from 27 days ago.', ai_response: 'Acknowledged.' },
  { id: 'msg_50', client_id: 'client_001', session_id: 'sess_recent_34', timestamp: getRecentDate(28, 0, 0), created_date: getRecentDate(28, 0, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 28 days ago.', ai_response: 'Got it.' },
  { id: 'msg_51', client_id: 'client_001', session_id: 'sess_recent_35', timestamp: getRecentDate(29, 0, 0), created_date: getRecentDate(29, 0, 0), channel: 'Web', user_message: 'Web message from 29 days ago.', ai_response: 'Okay.' },
  { id: 'msg_52', client_id: 'client_001', session_id: 'sess_recent_36', timestamp: getRecentDate(30, 0, 0), created_date: getRecentDate(30, 0, 0), channel: 'Instagram', user_message: 'Instagram message from 30 days ago.', ai_response: 'Understood.' },
  // Add more messages for client_001 with various channels within the last 30 days
  { id: 'msg_53', client_id: 'client_001', session_id: 'sess_recent_37', timestamp: getRecentDate(0, 1, 0), created_date: getRecentDate(0, 1, 0), channel: 'WhatsApp', user_message: 'New WhatsApp message today.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_54', client_id: 'client_001', session_id: 'sess_recent_38', timestamp: getRecentDate(0, 2, 0), created_date: getRecentDate(0, 2, 0), channel: 'Instagram', user_message: 'New Instagram message today.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_55', client_id: 'client_001', session_id: 'sess_recent_39', timestamp: getRecentDate(0, 3, 0), created_date: getRecentDate(0, 3, 0), channel: 'Telegram', user_message: 'New Telegram message today.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_56', client_id: 'client_001', session_id: 'sess_recent_40', timestamp: getRecentDate(1, 4, 0), created_date: getRecentDate(1, 4, 0), channel: 'Web', user_message: 'Web message from yesterday.', ai_response: 'Reply from Web.' },
  { id: 'msg_57', client_id: 'client_001', session_id: 'sess_recent_41', timestamp: getRecentDate(2, 5, 0), created_date: getRecentDate(2, 5, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 2 days ago.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_58', client_id: 'client_001', session_id: 'sess_recent_42', timestamp: getRecentDate(3, 6, 0), created_date: getRecentDate(3, 6, 0), channel: 'Instagram', user_message: 'Instagram message from 3 days ago.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_59', client_id: 'client_001', session_id: 'sess_recent_43', timestamp: getRecentDate(4, 7, 0), created_date: getRecentDate(4, 7, 0), channel: 'Telegram', user_message: 'Telegram message from 4 days ago.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_60', client_id: 'client_001', session_id: 'sess_recent_44', timestamp: getRecentDate(5, 8, 0), created_date: getRecentDate(5, 8, 0), channel: 'Web', user_message: 'Web message from 5 days ago.', ai_response: 'Reply from Web.' },
  { id: 'msg_61', client_id: 'client_001', session_id: 'sess_recent_45', timestamp: getRecentDate(6, 9, 0), created_date: getRecentDate(6, 9, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 6 days ago.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_62', client_id: 'client_001', session_id: 'sess_recent_46', timestamp: getRecentDate(7, 10, 0), created_date: getRecentDate(7, 10, 0), channel: 'Instagram', user_message: 'Instagram message from 7 days ago.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_63', client_id: 'client_001', session_id: 'sess_recent_47', timestamp: getRecentDate(8, 11, 0), created_date: getRecentDate(8, 11, 0), channel: 'Telegram', user_message: 'Telegram message from 8 days ago.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_64', client_id: 'client_001', session_id: 'sess_recent_48', timestamp: getRecentDate(9, 12, 0), created_date: getRecentDate(9, 12, 0), channel: 'Web', user_message: 'Web message from 9 days ago.', ai_response: 'Reply from Web.' },
  { id: 'msg_65', client_id: 'client_001', session_id: 'sess_recent_49', timestamp: getRecentDate(10, 13, 0), created_date: getRecentDate(10, 13, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 10 days ago.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_66', client_id: 'client_001', session_id: 'sess_recent_50', timestamp: getRecentDate(11, 14, 0), created_date: getRecentDate(11, 14, 0), channel: 'Instagram', user_message: 'Instagram message from 11 days ago.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_67', client_id: 'client_001', session_id: 'sess_recent_51', timestamp: getRecentDate(12, 15, 0), created_date: getRecentDate(12, 15, 0), channel: 'Telegram', user_message: 'Telegram message from 12 days ago.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_68', client_id: 'client_001', session_id: 'sess_recent_52', timestamp: getRecentDate(13, 16, 0), created_date: getRecentDate(13, 16, 0), channel: 'Web', user_message: 'Web message from 13 days ago.', ai_response: 'Reply from Web.' },
  { id: 'msg_69', client_id: 'client_001', session_id: 'sess_recent_53', timestamp: getRecentDate(14, 17, 0), created_date: getRecentDate(14, 17, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 14 days ago.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_70', client_id: 'client_001', session_id: 'sess_recent_54', timestamp: getRecentDate(15, 18, 0), created_date: getRecentDate(15, 18, 0), channel: 'Instagram', user_message: 'Instagram message from 15 days ago.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_71', client_id: 'client_001', session_id: 'sess_recent_55', timestamp: getRecentDate(16, 19, 0), created_date: getRecentDate(16, 19, 0), channel: 'Telegram', user_message: 'Telegram message from 16 days ago.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_72', client_id: 'client_001', session_id: 'sess_recent_56', timestamp: getRecentDate(17, 20, 0), created_date: getRecentDate(17, 20, 0), channel: 'Web', user_message: 'Web message from 17 days ago.', ai_response: 'Reply from Web.' },
  { id: 'msg_73', client_id: 'client_001', session_id: 'sess_recent_57', timestamp: getRecentDate(18, 21, 0), created_date: getRecentDate(18, 21, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 18 days ago.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_74', client_id: 'client_001', session_id: 'sess_recent_58', timestamp: getRecentDate(19, 22, 0), created_date: getRecentDate(19, 22, 0), channel: 'Instagram', user_message: 'Instagram message from 19 days ago.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_75', client_id: 'client_001', session_id: 'sess_recent_59', timestamp: getRecentDate(20, 23, 0), created_date: getRecentDate(20, 23, 0), channel: 'Telegram', user_message: 'Telegram message from 20 days ago.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_76', client_id: 'client_001', session_id: 'sess_recent_60', timestamp: getRecentDate(21, 0, 0), created_date: getRecentDate(21, 0, 0), channel: 'Web', user_message: 'Web message from 21 days ago.', ai_response: 'Reply from Web.' },
  { id: 'msg_77', client_id: 'client_001', session_id: 'sess_recent_61', timestamp: getRecentDate(22, 1, 0), created_date: getRecentDate(22, 1, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 22 days ago.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_78', client_id: 'client_001', session_id: 'sess_recent_62', timestamp: getRecentDate(23, 2, 0), created_date: getRecentDate(23, 2, 0), channel: 'Instagram', user_message: 'Instagram message from 23 days ago.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_79', client_id: 'client_001', session_id: 'sess_recent_63', timestamp: getRecentDate(24, 3, 0), created_date: getRecentDate(24, 3, 0), channel: 'Telegram', user_message: 'Telegram message from 24 days ago.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_80', client_id: 'client_001', session_id: 'sess_recent_64', timestamp: getRecentDate(25, 4, 0), created_date: getRecentDate(25, 4, 0), channel: 'Web', user_message: 'Web message from 25 days ago.', ai_response: 'Reply from Web.' },
  { id: 'msg_81', client_id: 'client_001', session_id: 'sess_recent_65', timestamp: getRecentDate(26, 5, 0), created_date: getRecentDate(26, 5, 0), channel: 'WhatsApp', user_message: 'WhatsApp message from 26 days ago.', ai_response: 'Reply from WhatsApp.' },
  { id: 'msg_82', client_id: 'client_001', session_id: 'sess_recent_66', timestamp: getRecentDate(27, 6, 0), created_date: getRecentDate(27, 6, 0), channel: 'Instagram', user_message: 'Instagram message from 27 days ago.', ai_response: 'Reply from Instagram.' },
  { id: 'msg_83', client_id: 'client_001', session_id: 'sess_recent_67', timestamp: getRecentDate(28, 7, 0), created_date: getRecentDate(28, 7, 0), channel: 'Telegram', user_message: 'Telegram message from 28 days ago.', ai_response: 'Reply from Telegram.' },
  { id: 'msg_84', client_id: 'client_001', session_id: 'sess_recent_68', timestamp: getRecentDate(29, 8, 0), created_date: getRecentDate(29, 8, 0), channel: 'Web', user_message: 'Web message from 29 days ago.', ai_response: 'Reply from Web.' },
];

let mockCalls = [
  { id: 'call_1', client_id: 'client_001', date: getRecentDate(1, 0, 20), created_date: getRecentDate(1, 0, 20), duration: 120, duration_minutes: 2, summary: 'Customer inquired about service upgrade.', details: 'The customer called to ask about upgrading their current service plan. They were interested in the premium features and asked about pricing. Agent provided details and offered to send a proposal.' },
  { id: 'call_2', client_id: 'client_002', date: getRecentDate(2, 1, 10), created_date: getRecentDate(2, 1, 10), duration: 300, duration_minutes: 5, summary: 'Support call regarding a technical issue.', details: 'Customer reported an issue with their dashboard not loading correctly. Agent guided them through troubleshooting steps, which resolved the problem. Customer was satisfied.' },
  { id: 'call_3', client_id: 'client_001', date: getRecentDate(3, 2, 15), created_date: getRecentDate(3, 2, 15), duration: 60, duration_minutes: 1, summary: 'Quick follow-up on a previous proposal.', details: 'Short call to follow up on the proposal sent last week. Customer confirmed receipt and said they would review it by end of day.' },
  { id: 'call_4', client_id: 'client_001', date: getRecentDate(4, 3, 0), created_date: getRecentDate(4, 3, 0), duration: 180, duration_minutes: 3, summary: 'New client onboarding call.', details: 'Onboarding call with a new client to explain dashboard features and initial setup. Covered data import and user management.' },
  { id: 'call_5', client_id: 'client_002', date: getRecentDate(5, 4, 0), created_date: getRecentDate(5, 4, 0), duration: 90, duration_minutes: 1.5, summary: 'Billing inquiry.', details: 'Client called to clarify a charge on their latest invoice. Explained the breakdown of services and charges.' },
  { id: 'call_6', client_id: 'client_001', date: getRecentDate(6, 5, 0), created_date: getRecentDate(6, 5, 0), duration: 240, duration_minutes: 4, summary: 'Product demo and Q&A.', details: 'Provided a detailed demo of Product Z and answered all client questions regarding its features and benefits.' },
  { id: 'call_7', client_id: 'client_001', date: getRecentDate(7, 6, 0), created_date: getRecentDate(7, 6, 0), duration: 150, duration_minutes: 2.5, summary: 'Technical support for integration.', details: 'Assisted client with integrating our API. Troubleshooted connection issues and guided them through the setup process.' },
  // Adding more recent calls for client_001
  { id: 'call_8', client_id: 'client_001', date: getRecentDate(0, 0, 3), created_date: getRecentDate(0, 0, 3), duration: 90, duration_minutes: 1.5, summary: 'Follow-up on recent inquiry.', details: 'Customer called to confirm details about their recent inquiry. All questions answered.' },
  { id: 'call_9', client_id: 'client_001', date: getRecentDate(0, 1, 3), created_date: getRecentDate(0, 1, 3), duration: 180, duration_minutes: 3, summary: 'New feature discussion.', details: 'Discussed upcoming features and gathered feedback from the client.' },
  { id: 'call_10', client_id: 'client_001', date: getRecentDate(1, 0, 0), created_date: getRecentDate(1, 0, 0), duration: 60, duration_minutes: 1, summary: 'Quick check-in.', details: 'Brief call to check on service satisfaction.' },
  { id: 'call_11', client_id: 'client_001', date: getRecentDate(2, 0, 0), created_date: getRecentDate(2, 0, 0), duration: 120, duration_minutes: 2, summary: 'Support for new integration.', details: 'Assisted with setting up a new integration.' },
  { id: 'call_12', client_id: 'client_001', date: getRecentDate(3, 0, 0), created_date: getRecentDate(3, 0, 0), duration: 300, duration_minutes: 5, summary: 'Detailed product walkthrough.', details: 'Provided a comprehensive walkthrough of product features.' },
  { id: 'call_13', client_id: 'client_001', date: getRecentDate(4, 0, 0), created_date: getRecentDate(4, 0, 0), duration: 90, duration_minutes: 1.5, summary: 'Billing clarification.', details: 'Clarified recent billing statement.' },
  { id: 'call_14', client_id: 'client_001', date: getRecentDate(5, 0, 0), created_date: getRecentDate(5, 0, 0), duration: 180, duration_minutes: 3, summary: 'Feature request discussion.', details: 'Discussed potential new features based on client needs.' },
  { id: 'call_15', client_id: 'client_001', date: getRecentDate(6, 0, 0), created_date: getRecentDate(6, 0, 0), duration: 60, duration_minutes: 1, summary: 'Quick update call.', details: 'Provided a brief update on ongoing tasks.' },
  { id: 'call_16', client_id: 'client_001', date: getRecentDate(7, 0, 0), created_date: getRecentDate(7, 0, 0), duration: 120, duration_minutes: 2, summary: 'Technical support.', details: 'Resolved a minor technical issue.' },
  { id: 'call_17', client_id: 'client_001', date: getRecentDate(8, 0, 0), created_date: getRecentDate(8, 0, 0), duration: 300, duration_minutes: 5, summary: 'Strategic planning session.', details: 'Discussed long-term strategy and how our services can support it.' },
  { id: 'call_18', client_id: 'client_001', date: getRecentDate(9, 0, 0), created_date: getRecentDate(9, 0, 0), duration: 90, duration_minutes: 1.5, summary: 'Follow-up on proposal.', details: 'Followed up on the recently sent proposal.' },
  { id: 'call_19', client_id: 'client_001', date: getRecentDate(10, 0, 0), created_date: getRecentDate(10, 0, 0), duration: 180, duration_minutes: 3, summary: 'New project kickoff.', details: 'Kicked off a new project with the client.' },
  { id: 'call_20', client_id: 'client_001', date: getRecentDate(11, 0, 0), created_date: getRecentDate(11, 0, 0), duration: 60, duration_minutes: 1, summary: 'Account review.', details: 'Reviewed account performance and usage.' },
  { id: 'call_21', client_id: 'client_001', date: getRecentDate(12, 0, 0), created_date: getRecentDate(12, 0, 0), duration: 120, duration_minutes: 2, summary: 'Training session.', details: 'Provided a training session on new dashboard features.' },
  { id: 'call_22', client_id: 'client_001', date: getRecentDate(13, 0, 0), created_date: getRecentDate(13, 0, 0), duration: 300, duration_minutes: 5, summary: 'Deep dive into analytics.', details: 'Explored analytics data and insights with the client.' },
  { id: 'call_23', client_id: 'client_001', date: getRecentDate(14, 0, 0), created_date: getRecentDate(14, 0, 0), duration: 90, duration_minutes: 1.5, summary: 'Feedback session.', details: 'Collected feedback on recent service delivery.' },
  { id: 'call_24', client_id: 'client_001', date: getRecentDate(15, 0, 0), created_date: getRecentDate(15, 0, 0), duration: 180, duration_minutes: 3, summary: 'Quarterly business review.', details: 'Conducted a quarterly review of business objectives.' },
  { id: 'call_25', client_id: 'client_001', date: getRecentDate(16, 0, 0), created_date: getRecentDate(16, 0, 0), duration: 60, duration_minutes: 1, summary: 'Quick question.', details: 'Answered a quick question about a report.' },
  { id: 'call_26', client_id: 'client_001', date: getRecentDate(17, 0, 0), created_date: getRecentDate(17, 0, 0), duration: 120, duration_minutes: 2, summary: 'Technical consultation.', details: 'Provided technical consultation on a new project idea.' },
  { id: 'call_27', client_id: 'client_001', date: getRecentDate(18, 0, 0), created_date: getRecentDate(18, 0, 0), duration: 300, duration_minutes: 5, summary: 'Partnership discussion.', details: 'Explored potential partnership opportunities.' },
  { id: 'call_28', client_id: 'client_001', date: getRecentDate(19, 0, 0), created_date: getRecentDate(19, 0, 0), duration: 90, duration_minutes: 1.5, summary: 'Service inquiry.', details: 'Customer inquired about additional services.' },
  { id: 'call_29', client_id: 'client_001', date: getRecentDate(20, 0, 0), created_date: getRecentDate(20, 0, 0), duration: 180, duration_minutes: 3, summary: 'Project update meeting.', details: 'Provided an update on the current project status.' },
  { id: 'call_30', client_id: 'client_001', date: getRecentDate(21, 0, 0), created_date: getRecentDate(21, 0, 0), duration: 60, duration_minutes: 1, summary: 'Follow-up on support ticket.', details: 'Followed up on a recently closed support ticket.' },
  { id: 'call_31', client_id: 'client_001', date: getRecentDate(22, 0, 0), created_date: getRecentDate(22, 0, 0), duration: 120, duration_minutes: 2, summary: 'New client introduction.', details: 'Introduced a new team member to the client.' },
  { id: 'call_32', client_id: 'client_001', date: getRecentDate(23, 0, 0), created_date: getRecentDate(23, 0, 0), duration: 300, duration_minutes: 5, summary: 'Deep dive into new feature.', details: 'Provided a deep dive into a newly released feature.' },
  { id: 'call_33', client_id: 'client_001', date: getRecentDate(24, 0, 0), created_date: getRecentDate(24, 0, 0), duration: 90, duration_minutes: 1.5, summary: 'Account optimization tips.', details: 'Provided tips for optimizing account usage.' },
  { id: 'call_34', client_id: 'client_001', date: getRecentDate(25, 0, 0), created_date: getRecentDate(25, 0, 0), duration: 180, duration_minutes: 3, summary: 'Annual review planning.', details: 'Planned the agenda for the annual client review.' },
  { id: 'call_35', client_id: 'client_001', date: getRecentDate(26, 0, 0), created_date: getRecentDate(26, 0, 0), duration: 60, duration_minutes: 1, summary: 'Quick question about billing.', details: 'Answered a quick question about their latest bill.' },
  { id: 'call_36', client_id: 'client_001', date: getRecentDate(27, 0, 0), created_date: getRecentDate(27, 0, 0), duration: 120, duration_minutes: 2, summary: 'Technical support for API.', details: 'Assisted with API integration issues.' },
  { id: 'call_37', client_id: 'client_001', date: getRecentDate(28, 0, 0), created_date: getRecentDate(28, 0, 0), duration: 300, duration_minutes: 5, summary: 'New service consultation.', details: 'Consulted on potential new services for their business.' },
  { id: 'call_38', client_id: 'client_001', date: getRecentDate(29, 0, 0), created_date: getRecentDate(29, 0, 0), duration: 90, duration_minutes: 1.5, summary: 'Follow-up on new lead.', details: 'Followed up on a new lead generated last week.' },
  { id: 'call_39', client_id: 'client_001', date: getRecentDate(30, 0, 0), created_date: getRecentDate(30, 0, 0), duration: 180, duration_minutes: 3, summary: 'Initial consultation for new client.', details: 'First consultation with a potential new client.' },
];

let mockDashboardLogs = [
  { id: 'log_1', client_id: 'client_001', date: getRecentDate(30), created_date: getRecentDate(30), message_count: 50, call_count: 5, avg_response_time: 1.2 },
  { id: 'log_2', client_id: 'client_001', date: getRecentDate(29), created_date: getRecentDate(29), message_count: 60, call_count: 7, avg_response_time: 1.1 },
  { id: 'log_3', client_id: 'client_001', date: getRecentDate(28), created_date: getRecentDate(28), message_count: 55, call_count: 6, avg_response_time: 1.3 },
  { id: 'log_4', client_id: 'client_001', date: getRecentDate(27), created_date: getRecentDate(27), message_count: 70, call_count: 8, avg_response_time: 1.0 },
  { id: 'log_5', client_id: 'client_001', date: getRecentDate(26), created_date: getRecentDate(26), message_count: 65, call_count: 7, avg_response_time: 1.2 },
  { id: 'log_6', client_id: 'client_001', date: getRecentDate(25), created_date: getRecentDate(25), message_count: 75, call_count: 9, avg_response_time: 0.9 },
  { id: 'log_7', client_id: 'client_001', date: getRecentDate(24), created_date: getRecentDate(24), message_count: 80, call_count: 10, avg_response_time: 0.8 },
  { id: 'log_8', client_id: 'client_001', date: getRecentDate(23), created_date: getRecentDate(23), message_count: 85, call_count: 11, avg_response_time: 0.9 },
  { id: 'log_9', client_id: 'client_001', date: getRecentDate(22), created_date: getRecentDate(22), message_count: 90, call_count: 12, avg_response_time: 0.85 },
  { id: 'log_10', client_id: 'client_001', date: getRecentDate(21), created_date: getRecentDate(21), message_count: 95, call_count: 13, avg_response_time: 0.95 },
  { id: 'log_11', client_id: 'client_001', date: getRecentDate(20), created_date: getRecentDate(20), message_count: 100, call_count: 14, avg_response_time: 0.9 },
  { id: 'log_12', client_id: 'client_001', date: getRecentDate(19), created_date: getRecentDate(19), message_count: 105, call_count: 15, avg_response_time: 0.8 },
  { id: 'log_13', client_id: 'client_002', date: getRecentDate(18), created_date: getRecentDate(18), message_count: 30, call_count: 2, avg_response_time: 1.5 },
  { id: 'log_14', client_id: 'client_002', date: getRecentDate(17), created_date: getRecentDate(17), message_count: 35, call_count: 3, avg_response_time: 1.4 },
  // Adding more recent dashboard logs for client_001
  { id: 'log_15', client_id: 'client_001', date: getRecentDate(0), created_date: getRecentDate(0), message_count: 120, call_count: 18, avg_response_time: 0.7 },
  { id: 'log_16', client_id: 'client_001', date: getRecentDate(1), created_date: getRecentDate(1), message_count: 110, call_count: 16, avg_response_time: 0.75 },
  { id: 'log_17', client_id: 'client_001', date: getRecentDate(2), created_date: getRecentDate(2), message_count: 100, call_count: 15, avg_response_time: 0.8 },
];

let mockLeads = [
  { id: 'lead_1', client_id: 'client_001', name: 'John Doe', email: 'john@example.com', phone: '111-222-3333', interest: 'Product A', timestamp: getRecentDate(1, 0, 30), created_date: getRecentDate(1, 0, 30) },
  { id: 'lead_2', client_id: 'client_001', name: 'Jane Smith', email: 'jane@example.com', phone: '444-555-6666', interest: 'Service B', timestamp: getRecentDate(2, 1, 0), created_date: getRecentDate(2, 1, 0) },
  { id: 'lead_3', client_id: 'client_002', name: 'Peter Jones', email: 'peter@example.com', phone: '777-888-9999', interest: 'Product C', timestamp: getRecentDate(3, 2, 0), created_date: getRecentDate(3, 2, 0) },
  { id: 'lead_4', client_id: 'client_001', name: 'Alice Brown', email: 'alice@example.com', phone: '123-456-7890', interest: 'Service A', timestamp: getRecentDate(4, 3, 0), created_date: getRecentDate(4, 3, 0) },
  { id: 'lead_5', client_id: 'client_001', name: 'Bob White', email: 'bob@example.com', phone: '987-654-3210', interest: 'Product B', timestamp: getRecentDate(5, 4, 0), created_date: getRecentDate(5, 4, 0) },
  { id: 'lead_6', client_id: 'client_001', name: 'Charlie Green', email: 'charlie@example.2com', phone: '555-123-4567', interest: 'Product A', timestamp: getRecentDate(6, 5, 0), created_date: getRecentDate(6, 5, 0) },
  { id: 'lead_7', client_id: 'client_001', name: 'Diana Prince', email: 'diana@example.com', phone: '555-987-6543', interest: 'Service B', timestamp: getRecentDate(7, 6, 0), created_date: getRecentDate(7, 6, 0) },
  { id: 'lead_8', client_id: 'client_002', name: 'Eve Adams', email: 'eve@example.com', phone: '555-111-2222', interest: 'Product C', timestamp: getRecentDate(8, 7, 0), created_date: getRecentDate(8, 7, 0) },
  // Adding more recent leads for client_001
  { id: 'lead_9', client_id: 'client_001', name: 'Frank Black', email: 'frank@example.com', phone: '111-111-1111', interest: 'Product A', timestamp: getRecentDate(0, 0, 10), created_date: getRecentDate(0, 0, 10) },
  { id: 'lead_10', client_id: 'client_001', name: 'Grace Kelly', email: 'grace@example.com', phone: '222-222-2222', interest: 'Service C', timestamp: getRecentDate(0, 1, 10), created_date: getRecentDate(0, 1, 10) },
  { id: 'lead_11', client_id: 'client_001', name: 'Henry Ford', email: 'henry@example.com', phone: '333-333-3333', interest: 'Product B', timestamp: getRecentDate(1, 0, 0), created_date: getRecentDate(1, 0, 0) },
  { id: 'lead_12', client_id: 'client_001', name: 'Ivy Queen', email: 'ivy@example.com', phone: '444-444-4444', interest: 'Service A', timestamp: getRecentDate(2, 0, 0), created_date: getRecentDate(2, 0, 0) },
  { id: 'lead_13', client_id: 'client_001', name: 'Jack Sparrow', email: 'jack@example.com', phone: '555-555-5555', interest: 'Product C', timestamp: getRecentDate(3, 0, 0), created_date: getRecentDate(3, 0, 0) },
  { id: 'lead_14', client_id: 'client_001', name: 'Karen Smith', email: 'karen@example.com', phone: '666-666-6666', interest: 'Product A', timestamp: getRecentDate(4, 0, 0), created_date: getRecentDate(4, 0, 0) },
  { id: 'lead_15', client_id: 'client_001', name: 'Liam Neeson', email: 'liam@example.com', phone: '777-777-7777', interest: 'Service B', timestamp: getRecentDate(5, 0, 0), created_date: getRecentDate(5, 0, 0) },
  { id: 'lead_16', client_id: 'client_001', name: 'Mia Khalifa', email: 'mia@example.com', phone: '888-888-8888', interest: 'Product B', timestamp: getRecentDate(6, 0, 0), created_date: getRecentDate(6, 0, 0) },
  { id: 'lead_17', client_id: 'client_001', name: 'Noah Centineo', email: 'noah@example.com', phone: '999-999-9999', interest: 'Service C', timestamp: getRecentDate(7, 0, 0), created_date: getRecentDate(7, 0, 0) },
  { id: 'lead_18', client_id: 'client_001', name: 'Olivia Rodrigo', email: 'olivia@example.com', phone: '000-000-0000', interest: 'Product A', timestamp: getRecentDate(8, 0, 0), created_date: getRecentDate(8, 0, 0) },
  { id: 'lead_19', client_id: 'client_001', name: 'Peter Parker', email: 'peterp@example.com', phone: '123-123-1234', interest: 'Service B', timestamp: getRecentDate(9, 0, 0), created_date: getRecentDate(9, 0, 0) },
  { id: 'lead_20', client_id: 'client_001', name: 'Quinn Fabray', email: 'quinn@example.com', phone: '456-456-4567', interest: 'Product C', timestamp: getRecentDate(10, 0, 0), created_date: getRecentDate(10, 0, 0) },
  { id: 'lead_21', client_id: 'client_001', name: 'Ryan Reynolds', email: 'ryan@example.com', phone: '789-789-7890', interest: 'Product A', timestamp: getRecentDate(11, 0, 0), created_date: getRecentDate(11, 0, 0) },
  { id: 'lead_22', client_id: 'client_001', name: 'Sophia Loren', email: 'sophia@example.com', phone: '101-101-1010', interest: 'Service A', timestamp: getRecentDate(12, 0, 0), created_date: getRecentDate(12, 0, 0) },
  { id: 'lead_23', client_id: 'client_001', name: 'Tom Hanks', email: 'tom@example.com', phone: '202-202-2020', interest: 'Product B', timestamp: getRecentDate(13, 0, 0), created_date: getRecentDate(13, 0, 0) },
  { id: 'lead_24', client_id: 'client_001', name: 'Uma Thurman', email: 'uma@example.com', phone: '303-303-3030', interest: 'Service C', timestamp: getRecentDate(14, 0, 0), created_date: getRecentDate(14, 0, 0) },
  { id: 'lead_25', client_id: 'client_001', name: 'Will Smith', email: 'will@example.com', phone: '404-404-4040', interest: 'Product A', timestamp: getRecentDate(15, 0, 0), created_date: getRecentDate(15, 0, 0) },
  { id: 'lead_26', client_id: 'client_001', name: 'Xavier Woods', email: 'xavier@example.com', phone: '505-505-5050', interest: 'Service B', timestamp: getRecentDate(16, 0, 0), created_date: getRecentDate(16, 0, 0) },
  { id: 'lead_27', client_id: 'client_001', name: 'Yara Shahidi', email: 'yara@example.com', phone: '606-606-6060', interest: 'Product C', timestamp: getRecentDate(17, 0, 0), created_date: getRecentDate(17, 0, 0) },
  { id: 'lead_28', client_id: 'client_001', name: 'Zoe Saldana', email: 'zoe@example.com', phone: '707-707-7070', interest: 'Product A', timestamp: getRecentDate(18, 0, 0), created_date: getRecentDate(18, 0, 0) },
  { id: 'lead_29', client_id: 'client_001', name: 'Adam Driver', email: 'adam@example.com', phone: '808-808-8080', interest: 'Service A', timestamp: getRecentDate(19, 0, 0), created_date: getRecentDate(19, 0, 0) },
  { id: 'lead_30', client_id: 'client_001', name: 'Bella Hadid', email: 'bella@example.com', phone: '909-909-9090', interest: 'Product B', timestamp: getRecentDate(20, 0, 0), created_date: getRecentDate(20, 0, 0) },
];

let mockPayments = [
  { id: 'pay_1', client_id: 'client_001', invoice_id: 'inv_2', amount: 500.00, status: 'completed', payment_date: getRecentDate(10, 0, 0), created_date: getRecentDate(10, 0, 0) },
  { id: 'pay_2', client_id: 'client_002', invoice_id: 'inv_1', amount: 1200.00, status: 'completed', payment_date: getRecentDate(12, 0, 0), created_date: getRecentDate(12, 0, 0) },
  { id: 'pay_3', client_id: 'client_001', invoice_id: 'inv_19', amount: 1999.00, status: 'completed', payment_date: getRecentDate(5, 0, 0), created_date: getRecentDate(5, 0, 0) },
  { id: 'pay_4', client_id: 'client_001', invoice_id: 'inv_20', amount: 39.00, status: 'completed', payment_date: getRecentDate(4, 0, 0), created_date: getRecentDate(4, 0, 0) },
  { id: 'pay_5', client_id: 'client_001', invoice_id: 'inv_21', amount: 299.00, status: 'completed', payment_date: getRecentDate(3, 0, 0), created_date: getRecentDate(3, 0, 0) },
];

// Updated mockNotifications with mixed statuses
let mockNotifications = [
  { id: 'notif_1', client_id: 'client_001', type: 'lead', title: 'Yeni lead oluşturuldu', description: 'Facebook üzerinden yeni bir lead toplandı.', status: 'unread', created_date: getRecentDate(0, 0, 1), link: '/leads', priority: 'normal', source_id: 'lead_1' },
  { id: 'notif_2', client_id: 'client_001', type: 'call', title: 'Çağrı tamamlandı', description: '3 dakikalık bir çağrı görüşmesi sona erdi.', status: 'read', created_date: getRecentDate(0, 0, 10), link: '/calls', priority: 'low', source_id: 'call_1' },
  { id: 'notif_3', client_id: 'client_001', type: 'offer', title: 'Yeni teklif hazırlandı', description: 'Domates hattı projesi için teklif sunuldu.', status: 'unread', created_date: getRecentDate(1, 0, 0), link: '/proposals', priority: 'high', source_id: 'off_3' },
  { id: 'notif_4', client_id: 'client_001', type: 'invoice', title: 'Yeni fatura oluşturuldu', description: 'INV-2024-001 numaralı fatura oluşturuldu.', status: 'read', created_date: getRecentDate(1, 1, 0), link: '/invoices', priority: 'normal', source_id: 'inv_1' },
  { id: 'notif_5', client_id: 'client_001', type: 'system', title: 'Sistem Bakımı', description: 'Planlı sistem bakımı bu gece 02:00-04:00 arası yapılacaktır.', status: 'unread', created_date: getRecentDate(2, 0, 0), link: '#', priority: 'high', source_id: 'sys_1' },
  { id: 'notif_6', client_id: 'client_001', type: 'lead', title: 'Yeni lead', description: 'Web sitesinden yeni bir lead geldi.', status: 'read', created_date: getRecentDate(2, 2, 0), link: '/leads', priority: 'normal', source_id: 'lead_2' },
];


const generateUniqueId = (prefix) => {
  return prefix + '_' + Math.random().toString(36).substr(2, 9);
};

export const mockFetch = async (tableName, clientId = null, options = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

  let collection;
  switch (tableName) {
    case 'users': collection = mockUsers; break;
    case 'offers': collection = mockOffers; break;
    case 'invoices': collection = mockInvoices; break;
    case 'messages': collection = mockMessages; break; // THIS IS THE TARGET TABLE
    case 'calls': collection = mockCalls; break;
    case 'dashboard_logs': collection = mockDashboardLogs; break;
    case 'leads': collection = mockLeads; break;
    case 'payments': collection = mockPayments; break;
    case 'notifications': collection = mockNotifications; break;
    case 'admins': return [{ email: 'admin@example.com', password_hash: 'adminpass' }]; // Mock admin credentials
    default: return [];
  }

  console.log(`[mockFetch] Initial collection for ${tableName}: ${collection.length} items.`);

  let filteredCollection = collection;

  // Apply client_id filter first if present
  if (clientId) {
    filteredCollection = filteredCollection.filter(item => item.client_id === clientId);
    console.log(`[mockFetch] After client_id filter (${clientId}): ${filteredCollection.length} items.`); // ADDED LOG
  }

  // Apply date range filter
  if (options.startDate && options.endDate) {
    const startDateObj = new Date(options.startDate);
    const endDateObj = new Date(options.endDate);

    filteredCollection = filteredCollection.filter(item => {
      // Use 'created_date' for filtering if available, fallback to 'timestamp' or 'date'
      const itemDateRaw = item.created_date || item.timestamp || item.date;
      const itemDate = new Date(itemDateRaw); // This will parse ISO strings correctly

      // Convert all to UTC midnight for consistent comparison
      const itemDateUTC = Date.UTC(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const startDateUTC = Date.UTC(startDateObj.getFullYear(), startDateObj.getMonth(), startDateObj.getDate());
      const endDateUTC = Date.UTC(endDateObj.getFullYear(), endDateObj.getMonth(), endDateObj.getDate());

      const isWithinRange = itemDateUTC >= startDateUTC && itemDateUTC <= endDateUTC;
      // console.log(`[mockFetch] Item: ${item.id}, Date: ${itemDate.toISOString()}, Start: ${startDateObj.toISOString()}, End: ${endDateObj.toISOString()}, Within Range: ${isWithinRange}`); // Keep this for detailed debugging if needed
      return isWithinRange;
    });
    console.log(`[mockFetch] After date range filter (${options.startDate} to ${options.endDate}): ${filteredCollection.length} items.`); // ADDED LOG
  }

  // Apply generic 'where' clause for filtering (more robust parsing)
  if (options.where) {
    const conditions = options.where.split('~and'); // Split by '~and' for multiple conditions
    for (const condition of conditions) {
      const match = condition.match(/\(([^,]+),([^,]+),([^)]+)\)/); // Regex to extract field, operator, value
      if (match) {
        const [, field, operator, value] = match;
        // Remove 'exactDate,' prefix if present in value (for date filters)
        const cleanValue = value.startsWith('exactDate,') ? value.substring('exactDate,'.length) : value;

        if (operator === 'eq') {
          filteredCollection = filteredCollection.filter(item => String(item[field]) === cleanValue);
        } else if (operator === 'ge') { // Greater than or equal
          filteredCollection = filteredCollection.filter(item => {
            const itemDate = new Date(item[field]);
            const filterDate = new Date(cleanValue);
            return itemDate >= filterDate;
          });
        } else if (operator === 'le') { // Less than or equal
          filteredCollection = filteredCollection.filter(item => {
            const itemDate = new Date(item[field]);
            const filterDate = new Date(cleanValue);
            return itemDate <= filterDate;
          });
        }
        // Add more operators if needed (e.g., 'gt', 'lt', 'ne', 'like')
        console.log(`[mockFetch] After '${field}' ${operator} '${cleanValue}' filter: ${filteredCollection.length} items.`); // ADDED LOG
      }
    }
  }

  return filteredCollection;
};

export const mockCreate = async (tableName, data) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  const newItem = { id: generateUniqueId(tableName.slice(0, 3)), created_date: formatMockDateToISO(new Date()), ...data };
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
