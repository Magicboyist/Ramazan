// Turkish cities data with their IDs for Diyanet API
const cities = [
    { id: 500, name: "Adana" },
    { id: 501, name: "Adıyaman" },
    { id: 502, name: "Afyonkarahisar" },
    { id: 503, name: "Ağrı" },
    { id: 504, name: "Amasya" },
    { id: 505, name: "Ankara" },
    { id: 506, name: "Antalya" },
    { id: 507, name: "Artvin" },
    { id: 508, name: "Aydın" },
    { id: 509, name: "Balıkesir" },
    { id: 510, name: "Bilecik" },
    { id: 511, name: "Bingöl" },
    { id: 512, name: "Bitlis" },
    { id: 513, name: "Bolu" },
    { id: 514, name: "Burdur" },
    { id: 515, name: "Bursa" },
    { id: 516, name: "Çanakkale" },
    { id: 517, name: "Çankırı" },
    { id: 518, name: "Çorum" },
    { id: 519, name: "Denizli" },
    { id: 520, name: "Diyarbakır" },
    { id: 521, name: "Edirne" },
    { id: 522, name: "Elazığ" },
    { id: 523, name: "Erzincan" },
    { id: 524, name: "Erzurum" },
    { id: 525, name: "Eskişehir" },
    { id: 526, name: "Gaziantep" },
    { id: 527, name: "Giresun" },
    { id: 528, name: "Gümüşhane" },
    { id: 529, name: "Hakkari" },
    { id: 530, name: "Hatay" },
    { id: 531, name: "Isparta" },
    { id: 532, name: "Mersin" },
    { id: 533, name: "İstanbul" },
    { id: 534, name: "İzmir" },
    { id: 535, name: "Kars" },
    { id: 536, name: "Kastamonu" },
    { id: 537, name: "Kayseri" },
    { id: 538, name: "Kırklareli" },
    { id: 539, name: "Kırşehir" },
    { id: 540, name: "Kocaeli" },
    { id: 541, name: "Konya" },
    { id: 542, name: "Kütahya" },
    { id: 543, name: "Malatya" },
    { id: 544, name: "Manisa" },
    { id: 545, name: "Kahramanmaraş" },
    { id: 546, name: "Mardin" },
    { id: 547, name: "Muğla" },
    { id: 548, name: "Muş" },
    { id: 549, name: "Nevşehir" },
    { id: 550, name: "Niğde" },
    { id: 551, name: "Ordu" },
    { id: 552, name: "Rize" },
    { id: 553, name: "Sakarya" },
    { id: 554, name: "Samsun" },
    { id: 555, name: "Siirt" },
    { id: 556, name: "Sinop" },
    { id: 557, name: "Sivas" },
    { id: 558, name: "Tekirdağ" },
    { id: 559, name: "Tokat" },
    { id: 560, name: "Trabzon" },
    { id: 561, name: "Tunceli" },
    { id: 562, name: "Şanlıurfa" },
    { id: 563, name: "Uşak" },
    { id: 564, name: "Van" },
    { id: 565, name: "Yozgat" },
    { id: 566, name: "Zonguldak" },
    { id: 567, name: "Aksaray" },
    { id: 568, name: "Bayburt" },
    { id: 569, name: "Karaman" },
    { id: 570, name: "Kırıkkale" },
    { id: 571, name: "Batman" },
    { id: 572, name: "Şırnak" },
    { id: 573, name: "Bartın" },
    { id: 574, name: "Ardahan" },
    { id: 575, name: "Iğdır" },
    { id: 576, name: "Yalova" },
    { id: 577, name: "Karabük" },
    { id: 578, name: "Kilis" },
    { id: 579, name: "Osmaniye" },
    { id: 580, name: "Düzce" }
];

// DOM elements
const citySelect = document.getElementById('city-select');
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const iftarTimeElement = document.getElementById('iftar-time');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// Global variables
let prayerTimes = {};
let countdownInterval;
let selectedCity = localStorage.getItem('selectedCity') || '';

// Initialize the application
function init() {
    populateCitySelect();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Set the selected city from localStorage if available
    if (selectedCity) {
        citySelect.value = selectedCity;
        fetchPrayerTimes(selectedCity);
    }
    
    // Add event listener for city selection
    citySelect.addEventListener('change', function() {
        selectedCity = this.value;
        localStorage.setItem('selectedCity', selectedCity);
        fetchPrayerTimes(selectedCity);
    });
}

// Populate city select dropdown
function populateCitySelect() {
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.name;
        citySelect.appendChild(option);
    });
}

// Update current date and time
function updateDateTime() {
    const now = new Date();
    
    // Format date in Turkish
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('tr-TR', options);
    currentDateElement.textContent = dateStr;
    
    // Format time
    const timeStr = now.toLocaleTimeString('tr-TR');
    currentTimeElement.textContent = timeStr;
    
    // Update countdown if prayer times are available
    if (Object.keys(prayerTimes).length > 0) {
        updateCountdown();
    }
}

// Fetch prayer times from Diyanet API
async function fetchPrayerTimes(cityId) {
    if (!cityId) return;
    
    try {
        // Get current date in YYYY-MM-DD format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        // Fetch prayer times from Diyanet API
        const response = await fetch(`https://api.diyanet.gov.tr/vakitler?ilce=${cityId}&tarih=${dateStr}`);
        if (!response.ok) {
            throw new Error('API error');
        }
        const data = await response.json();
        
        // Map API response to expected prayerTimes format
        prayerTimes = {
            Imsak: data.Imsak,
            Gunes: data.Gunes,
            Ogle: data.Ogle,
            Ikindi: data.Ikindi,
            Aksam: data.Aksam,
            Yatsi: data.Yatsi
        };
        
        // Update prayer times
        displayPrayerTimes();
        
        // Start countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
        
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        alert('Namaz vakitleri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
}

// Display iftar time
function displayPrayerTimes() {
    iftarTimeElement.textContent = prayerTimes.Aksam;
}

// Update countdown to iftar (Aksam prayer)
function updateCountdown() {
    if (!prayerTimes || !prayerTimes.Aksam) return;
    
    const now = new Date();
    const [iftarHours, iftarMinutes] = prayerTimes.Aksam.split(':').map(Number);
    const iftarTime = new Date();
    iftarTime.setHours(iftarHours, iftarMinutes, 0, 0);

    // Eğer iftar vakti geçmişse, bir sonraki gün için hesapla
    if (now > iftarTime) {
        iftarTime.setDate(iftarTime.getDate() + 1);
    }

    // Milisaniye cinsinden fark
    const diff = iftarTime - now;

    if (diff <= 0) {
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        return;
    }

    // Saat, dakika ve saniye hesaplama
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Sayacı güncelle
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);