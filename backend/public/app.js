const form = document.getElementById('customerForm');
const search = document.getElementById('search');
const results = document.getElementById('results');
const mapDiv = document.getElementById('map');

let map;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const contact = form.contact.value;
  const latitude = parseFloat(form.latitude.value);
  const longitude = parseFloat(form.longitude.value);

  const res = await fetch('/api/customers', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, contact, latitude, longitude })
  });

  form.reset();
  loadCustomers();
});

search.addEventListener('input', loadCustomers);

async function loadCustomers() {
  const res = await fetch('/api/customers');
  const customers = await res.json();
  const term = search.value.toLowerCase();

  results.innerHTML = '';
  customers
    .filter(c => c.name.toLowerCase().includes(term) || c.contact.toLowerCase().includes(term))
    .forEach(c => {
      const div = document.createElement('div');
      div.textContent = `${c.name} - ${c.contact}`;
      div.onclick = () => showMap(c.latitude, c.longitude, c.name);
      results.appendChild(div);
    });
}

function showMap(lat, lon, name) {
  if (!map) {
    map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  } else {
    map.setView([lat, lon], 13);
  }

  L.marker([lat, lon]).addTo(map).bindPopup(name).openPopup();
}

loadCustomers();
