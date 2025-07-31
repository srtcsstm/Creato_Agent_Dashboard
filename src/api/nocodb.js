const BASE_URL = 'https://8mb2f662.rcsrv.com/api/v2/tables';
const XC_TOKEN = 'CWtIgT1TMmZ7Wh7cKw4HdN3OFgoAYh8VzdyKKvM8'; // Sağlanan xc-auth token

// Tablo ID'lerini gerçek NocoDB ID'leriyle eşleştiren takma adlar
const TABLE_IDS = {
  invoices: 'my1brc2p01a26u3',
  dashboard_logs: 'mqlted5ya12bbxt',
  calls: 'mev6vip4zognau1',
  leads: 'mksdj4vsk3qdm7f',
  messages: 'mudpsue80hjaj6e',
  offers: 'myrghn1xf4b47vu',
  payments: 'm39e2un4o1csvdf',
  users: 'mibi4jb9jlcmz3p',
  notifications: 'mjlfirm2j2hp7f0', // Yeni bildirimler tablosu ID'si
  admins: 'mfom95vyaoetfxq', // Yeni admin tablosu ID'si
};

// Doğru tablo ID'sini almak için yardımcı fonksiyon
const getTableId = (tableName) => {
  const id = TABLE_IDS[tableName];
  if (!id) {
    console.error(`Yapılandırma Hatası: '${tableName}' tablo adı için tablo ID'si tanımlanmamış. Lütfen src/api/nocodb.js dosyasına eklendiğinden emin olun.`);
    throw new Error(`Yapılandırma Hatası: '${tableName}' tablosu için ID eksik.`);
  }
  return id;
};

export const fetchNocoDBData = async (tableName, clientId = null, options = {}) => {
  const tableId = getTableId(tableName);
  const queryParams = new URLSearchParams();
  let conditions = []; // Koşulları tutacak dizi

  // Client ID koşulu (sadece fetchNocoDBData'nın doğrudan çağrılarında kullanılır)
  if (clientId) {
    conditions.push(`(client_id,eq,${clientId})`);
  }

  // Tarih aralığı koşulu
  const dateFilterField = 'created_date'; 

  if (options.startDate && options.endDate) {
    if (options.selectedDays === 1) {
      conditions.push(`(${dateFilterField},eq,exactDate,${options.startDate})`);
    } else {
      conditions.push(`(${dateFilterField},ge,exactDate,${options.startDate})`);
      conditions.push(`(${dateFilterField},le,exactDate,${options.endDate})`);
    }
  }

  // Options'tan gelen 'where' koşulunu ekle
  if (options.where) {
    conditions.push(options.where);
  }

  // Tüm koşulları '~and' ile birleştirerek tek bir 'where' parametresi oluştur
  if (conditions.length > 0) {
    queryParams.append('where', conditions.join('~and'));
  }

  // Pagination parameters
  queryParams.append('limit', options.limit || 1000); 
  if (options.offset) {
    queryParams.append('offset', options.offset);
  }

  // Diğer parametreleri ekle (örneğin, sıralama)
  for (const key in options) {
    if (key !== 'startDate' && key !== 'endDate' && key !== 'where' && key !== 'selectedDays' && key !== 'limit' && key !== 'offset') {
      queryParams.append(key, options[key]);
    }
  }

  const url = `${BASE_URL}/${tableId}/records?${queryParams.toString()}`;
  console.log(`[NocoDB API] URL'den veri çekiliyor: ${url}`); // Log the full URL

  try {
    const response = await fetch(url, {
      headers: {
        'xc-token': XC_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    console.log(`[NocoDB API] ${tableName} (ID: ${tableId}) için yanıt durumu: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[NocoDB API] ${tableName} veri çekme hatası detayları:`, errorData);
      throw new Error(errorData.msg || `HTTP hatası! durum: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[NocoDB API] ${tableName} (ID: ${tableId}) için alınan veri:`, data.list); // Log the received data list
    return data.list || [];
  } catch (error) {
    console.error(`[NocoDB API] ${tableName} (ID: ${tableId}) tablosundan veri çekilirken hata oluştu:`, error);
    throw error;
  }
};

export const createNocoDBData = async (tableName, data) => {
  const tableId = getTableId(tableName);
  const url = `${BASE_URL}/${tableId}/records`;

  const payload = { ...data };
  if (payload.id === '') {
    delete payload.id;
  }
  console.log(`[NocoDB API] URL'ye oluşturuluyor: ${url} veri ile:`, payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xc-token': XC_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`[NocoDB API] ${tableName} (ID: ${tableId}) oluşturma yanıt durumu: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[NocoDB API] ${tableName} oluşturma hatası detayları:`, errorData);
      throw new Error(errorData.msg || `HTTP hatası! durum: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`[NocoDB API] ${tableName} tablosuna veri oluşturulurken hata oluştu:`, error);
    throw error;
  }
};

export const updateNocoDBData = async (tableName, id, data) => {
  const tableId = getTableId(tableName);
  const url = `${BASE_URL}/${tableId}/records`;
  
  const payload = { Id: id, ...data }; 
  
  console.log(`[NocoDB API] URL'de güncelleniyor: ${url} veri ile:`, payload);

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'xc-token': XC_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`[NocoDB API] ${tableName} (ID: ${tableId}) güncelleme yanıt durumu: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[NocoDB API] ${tableName} güncelleme hatası detayları:`, errorData);
      throw new Error(errorData.msg || `HTTP hatası! durum: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`[NocoDB API] ${tableName} tablosundaki veri güncellenirken hata oluştu:`, error);
    throw error;
  }
};

export const deleteNocoDBData = async (tableName, id) => {
  const tableId = getTableId(tableName);
  const url = `${BASE_URL}/${tableId}/records`;
  const payload = { Id: id }; 

  console.log(`[NocoDB API] URL'den siliniyor: ${url} veri ile:`, payload);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'xc-token': XC_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`[NocoDB API] ${tableName} (ID: ${tableId}) silme yanıt durumu: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[NocoDB API] ${tableName} silme hatası detayları:`, errorData);
      throw new Error(errorData.msg || `HTTP hatası! durum: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`[NocoDB API] ${tableName} tablosundan veri silinirken hata oluştu:`, error);
    throw error;
  }
};

// NocoDB'ye karşı kullanıcı kimlik bilgilerini doğrulamak için yeni fonksiyon
export const verifyUserCredentials = async (clientId, passwordInput) => {
  console.log(`[Auth] Kullanıcı kimlik bilgileri doğrulanıyor: Client ID: ${clientId}`);
  try {
    // Sadece client_id ile kullanıcıyı çek
    const users = await fetchNocoDBData('users', null, {
      where: `(client_id,eq,${clientId})`
    });
    console.log("[Auth] verifyUserCredentials NocoDB yanıtı (client_id ile):", users);

    if (users.length > 0) {
      const user = users[0];
      // Şifre kontrolünü JavaScript tarafında yap
      if (user.password_hash === passwordInput) {
        console.log("[Auth] Kullanıcı şifresi eşleşti.");
        return user;
      } else {
        console.log("[Auth] Kullanıcı şifresi eşleşmedi.");
        return null;
      }
    } else {
      console.log("[Auth] Kullanıcı bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("[Auth] Kullanıcı kimlik bilgileri doğrulanırken hata oluştu:", error);
    return null;
  }
};

// NocoDB'ye karşı yönetici kimlik bilgilerini doğrulamak için yeni fonksiyon
export const verifyAdminCredentials = async (email, passwordInput) => {
  console.log(`[Auth] Yönetici kimlik bilgileri doğrulanıyor: Email: ${email}`);
  try {
    // Sadece email ile yöneticiyi çek
    const admins = await fetchNocoDBData('admins', null, {
      where: `(email,eq,${email})`
    });
    console.log("[Auth] verifyAdminCredentials NocoDB yanıtı (email ile):", admins);

    if (admins.length > 0) {
      const admin = admins[0];
      // Şifre kontrolünü JavaScript tarafında yap
      if (admin.password_hash === passwordInput) {
        console.log("[Auth] Yönetici şifresi eşleşti.");
        return true;
      } else {
        console.log("[Auth] Yönetici şifresi eşleşmedi.");
        return false;
      }
    } else {
      console.log("[Auth] Yönetici bulunamadı.");
      return false;
    }
  } catch (error) {
    console.error("[Auth] Yönetici kimlik bilgileri doğrulanırken hata oluştu:", error);
    return false;
  }
};
