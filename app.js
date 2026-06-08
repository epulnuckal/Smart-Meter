const firebaseConfig = {
    databaseURL: "https://smart-meter-epul-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dbPath = "/meter_live";

// 1. Fungsi hantar tarif baru ke Firebase (ESP32 akan sedut nilai ini secara auto)
document.getElementById('btn-tariff').addEventListener('click', () => {
    let newTariff = parseFloat(document.getElementById('input-tariff').value);
    if (!isNaN(newTariff) && newTariff > 0) {
        database.ref(dbPath + '/Tariff').set(newTariff)
        .then(() => alert("Tarif dikemaskini! ESP32 akan bertukar ke kadar baru secara automatik."))
        .catch(err => alert("Gagal: " + err));
    }
});

// 2. Baca data real-time dari Firebase (Sebijik ikut variable nama besar-kecil ESP32 kau)
database.ref(dbPath).on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Papar nilai tarif semasa yang aktif dalam database ke kotak input
        if (data.Tariff !== undefined) {
            document.getElementById('input-tariff').value = data.Tariff;
        }

        // Papar bacaan dari litar ESP32
        document.getElementById('val-voltage').innerText = data.Voltage !== undefined ? data.Voltage.toFixed(1) : "0.0";
        document.getElementById('val-current').innerText = data.Current !== undefined ? data.Current.toFixed(2) : "0.00";
        document.getElementById('val-power').innerText = data.Power !== undefined ? data.Power.toFixed(1) : "0.0";
        document.getElementById('val-energy').innerText = data.Energy !== undefined ? data.Energy.toFixed(3) : "0.000";
        document.getElementById('val-cost').innerText = data.Cost !== undefined ? data.Cost.toFixed(2) : "0.00";

        // Update status web jadi hijau
        document.getElementById('status-dot').className = "status-dot online";
        document.getElementById('status-text').innerText = "Berjaya Disambung ke Firebase";
    }
}, (error) => {
    document.getElementById('status-dot').className = "status-dot";
    document.getElementById('status-text').innerText = "Ralat Sambungan Database";
});

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log(err));
    });
}