const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKvKZv-zizzPB8BMhqPQme5WwzhhYgScgZLv3bmU5RMjoYsoCy8Z3VFBowb8AgtEVSxOdB6yQ05QpR/pub?gid=0&single=true&output=csv';

// Map countries to ISO 3166-1 alpha-2 codes for flag images
const FLAG_MAP = {
    'Colombia': 'co',
    'Argentina': 'ar',
    'Cuba': 'cu',
    'Bolivia': 'bo',
    'Brasil': 'br',
    'Brazil': 'br',
    'Ecuador': 'ec',
    'Filipinas': 'ph',
    'Guatemala': 'gt',
    'Honduras': 'hn',
    'Indonesia': 'id',
    'Paraguay': 'py',
    'Rep Dominicana': 'do',
    'Republica Dominicana': 'do',
    'Rep. Dominicana': 'do',
    'Venezuela': 've',
    'Peru': 'pe',
    'Perú': 'pe',
    'Mexico': 'mx',
    'México': 'mx',
    'Chile': 'cl',
    'Uruguay': 'uy',
    'Nicaragua': 'ni',
    'El Salvador': 'sv',
    'Panama': 'pa',
    'Panamá': 'pa',
    'Costa Rica': 'cr',
    'España': 'es',
    'USA': 'us',
    'Estados Unidos': 'us'
};

const CURRENCY_MAP = {
    'Colombia': 'COP',
    'Argentina': 'ARS',
    'Cuba': 'CUP',
    'Bolivia': 'BOB',
    'Brasil': 'BRL',
    'Brazil': 'BRL',
    'Ecuador': 'USD',
    'Filipinas': 'PHP',
    'Guatemala': 'GTQ',
    'Honduras': 'HNL',
    'Indonesia': 'IDR',
    'Paraguay': 'PYG',
    'Rep Dominicana': 'DOP',
    'Republica Dominicana': 'DOP',
    'Rep. Dominicana': 'DOP',
    'Venezuela': 'VES',
    'Peru': 'PEN',
    'Perú': 'PEN'
};

/* Attempt to fetch logic */
async function fetchData() {
    console.log('Fetching data...');
    // Add cache busting to the request itself to ensure fresh data from Google
    const uniqueUrl = SHEET_URL + '&t=' + new Date().getTime();

    Papa.parse(uniqueUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log('Data received:', results);
            processAndRender(results.data);
        },
        error: function (err) {
            console.error('Error parsing CSV:', err);
            const grid = document.getElementById('rates-grid');
            if (grid) grid.innerHTML = '<div class="loading">Reconectando...</div>';
        }
    });
}

function getFlag(countryName) {
    if (!countryName) return '<img src="https://flagcdn.com/w80/xx.png" alt="🌐" class="flag-img">';

    // Direct match
    if (FLAG_MAP[countryName]) {
        const code = FLAG_MAP[countryName];
        return `<img src="https://flagcdn.com/w80/${code}.png" alt="${countryName}" class="flag-img">`;
    }

    // Normalized match (case insensitive, trim)
    const normalized = countryName.trim();
    for (const key in FLAG_MAP) {
        if (key.toLowerCase() === normalized.toLowerCase()) {
            const code = FLAG_MAP[key];
            return `<img src="https://flagcdn.com/w80/${code}.png" alt="${countryName}" class="flag-img">`;
        }
    }

    // Fallback for known patterns
    if (normalized.includes('Dominic')) {
        return '<img src="https://flagcdn.com/w80/do.png" alt="República Dominicana" class="flag-img">';
    }

    // Default globe (using a generic world flag or placeholder)
    return '<img src="https://flagcdn.com/w80/un.png" alt="🌐" class="flag-img">';
}

function processAndRender(rawData) {
    const grid = document.getElementById('rates-grid');
    const lastUpdatedLabel = document.getElementById('last-updated');
    grid.innerHTML = '';

    let validItems = [];
    let foundDate = null;

    // Filter and normalize data
    rawData.forEach(row => {
        const country = row['Pais'];
        const rate = row['Tasa'];
        const date = row['dia'];

        if (date) foundDate = date;

        if (country && rate && rate.trim() !== '') {
            validItems.push({
                country: country.trim(),
                rate: rate.trim(),
                currency: CURRENCY_MAP[country] || ''
            });
        }
    });

    // SORT ALPHABETICALLY
    validItems.sort((a, b) => a.country.localeCompare(b.country, 'es', { sensitivity: 'base' }));

    // Adjust Grid columns based on count to keep it looking good
    // Default in CSS is 5 columns. 
    // If we have few items (e.g. < 10), maybe 3 or 4 columns is better.
    // If we have many (> 15), 5 or 6 columns.
    const count = validItems.length;
    if (count <= 9) {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (count <= 12) {
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)'; // Perfect for 12 items (4x3)
    } else {
        grid.style.gridTemplateColumns = 'repeat(5, 1fr)'; // Good for 13+
    }

    let containerFragment = document.createDocumentFragment();

    validItems.forEach(item => {
        const flag = getFlag(item.country);

        const card = document.createElement('div');
        card.className = 'rate-card';
        card.innerHTML = `
            <div class="country-flag">${flag}</div>
            <div class="country-name">${item.country}</div>
            <div class="rate-value">${item.rate}</div>
            <div class="rate-currency">${item.currency}</div>
        `;
        containerFragment.appendChild(card);
    });

    if (validItems.length === 0) {
        grid.innerHTML = '<div class="loading">No hay tasas para mostrar.</div>';
    } else {
        grid.appendChild(containerFragment);
    }

    if (foundDate) {
        const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        lastUpdatedLabel.textContent = `Actualizado: ${foundDate} - ${time}`;
    } else {
        const now = new Date();
        const date = now.toLocaleDateString('es-ES');
        const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        lastUpdatedLabel.textContent = `Fecha: ${date} - ${time}`;
    }
}

// Initial fetch
fetchData();

// Refresh every 5 minutes
setInterval(fetchData, 300000);
