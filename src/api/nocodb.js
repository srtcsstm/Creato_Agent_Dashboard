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

export const fetchNocoDBData = async (tableName, clientId = null, params = {}) => {
  const tableId = getTableId(tableName);
  const queryParams = new URLSearchParams(params);
  if (clientId) {
    queryParams.append('where', `(client_id,eq,${clientId})`);
  }

  const url = `${BASE_URL}/${tableId}/records?${queryParams.toString()}`;
  console.log(`[NocoDB API] URL'den veri çekiliyor: ${url}`);

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
  // Swagger'a göre PATCH endpoint'i ID'yi URL yolunda beklemiyor,
  // bunun yerine ID'yi istek gövdesinde bekliyor.
  const url = `${BASE_URL}/${tableId}/records`;
  
  // Payload, güncellenecek kaydın ID'sini (NocoDB'nin beklediği şekilde 'Id' veya 'id')
  // ve güncellenecek diğer alanları içermelidir.
  // Önceki hatalara dayanarak 'Id' (büyük I) kullanmaya devam ediyoruz.
  const payload = { Id: id, ...data }; 
  
  // Eğer gelen 'data' nesnesinde zaten 'id' veya 'Id' varsa, 
  // payload'a iki kez eklenmemesi için kontrol edilebilir, 
  // ancak mevcut durumda 'Id: id' ile birleştirme yeterli.

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
  const payload = { Id: id }; // NocoDB'nin DELETE için Id beklediği varsayımıyla

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
export const verifyUserCredentials = async (clientId, passwordHash) => {
  try {
    const users = await fetchNocoDBData('users', null, {
      where: `(client_id,eq,${clientId})~and(password_hash,eq,${passwordHash})`
    });
    return users.length > 0 ? users[0] : null; // Bulunursa kullanıcı nesnesini, aksi takdirde null döndür
  } catch (error) {
    console.error("Kullanıcı kimlik bilgileri doğrulanırken hata oluştu:", error);
    return null;
  }
};

// NocoDB'ye karşı yönetici kimlik bilgilerini doğrulamak için yeni fonksiyon
export const verifyAdminCredentials = async (email, passwordHash) => {
  try {
    const admins = await fetchNocoDBData('admins', null, {
      where: `(email,eq,${email})~and(password_hash,eq,${passwordHash})`
    });
    return admins.length > 0; // Yönetici bulunursa true, aksi takdirde false döndür
  } catch (error) {
    console.error("Yönetici kimlik bilgileri doğrulanırken hata oluştu:", error);
    return false;
  }
};
