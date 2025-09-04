// Enhanced Country Dropdown with Search and Better Styling
class EnhancedCountryDropdown {
  constructor(selectElement) {
    this.originalSelect = selectElement;
    this.isOpen = false;
    this.selectedCountry = null;
    this.filteredCountries = [...ECUADOR_EXPORT_COUNTRIES];
    
    this.init();
  }

  init() {
    this.createCustomDropdown();
    this.bindEvents();
    this.populateOriginalSelect();
  }

  createCustomDropdown() {
    // Crear contenedor principal
    this.container = document.createElement('div');
    this.container.className = 'enhanced-dropdown-container';
    
    // Crear el botón principal
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'enhanced-dropdown-button';
    this.button.innerHTML = `
      <span class="dropdown-text">Selecciona país</span>
      <span class="dropdown-arrow">▼</span>
    `;
    
    // Crear el panel desplegable
    this.panel = document.createElement('div');
    this.panel.className = 'enhanced-dropdown-panel';
    
    // Crear campo de búsqueda
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.className = 'dropdown-search';
    this.searchInput.placeholder = 'Buscar país...';
    
    // Crear lista de opciones
    this.optionsList = document.createElement('div');
    this.optionsList.className = 'dropdown-options';
    
    // Ensamblar el panel
    this.panel.appendChild(this.searchInput);
    this.panel.appendChild(this.optionsList);
    
    // Ensamblar el contenedor
    this.container.appendChild(this.button);
    this.container.appendChild(this.panel);
    
    // Reemplazar el select original
    this.originalSelect.style.display = 'none';
    this.originalSelect.parentNode.insertBefore(this.container, this.originalSelect);
    
    this.renderOptions();
  }

  renderOptions() {
    this.optionsList.innerHTML = '';
    
    // Agrupar por región
    const regions = getCountriesByRegion();
    
    Object.keys(regions).forEach(regionName => {
      const regionCountries = regions[regionName].filter(country => 
        this.filteredCountries.includes(country)
      );
      
      if (regionCountries.length === 0) return;
      
      // Crear encabezado de región
      const regionHeader = document.createElement('div');
      regionHeader.className = 'dropdown-region-header';
      regionHeader.textContent = regionName;
      this.optionsList.appendChild(regionHeader);
      
      // Crear opciones de países
      regionCountries.forEach(country => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.dataset.value = country.code;
        option.innerHTML = `
          <span class="country-flag">${country.flag}</span>
          <span class="country-name">${country.name}</span>
          <span class="country-code">${country.code}</span>
        `;
        
        option.addEventListener('click', () => this.selectCountry(country));
        this.optionsList.appendChild(option);
      });
    });
  }

  bindEvents() {
    // Toggle dropdown
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    
    // Búsqueda
    this.searchInput.addEventListener('input', (e) => {
      this.filterCountries(e.target.value);
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });
    
    // Navegación con teclado
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  filterCountries(query) {
    if (!query.trim()) {
      this.filteredCountries = [...ECUADOR_EXPORT_COUNTRIES];
    } else {
      this.filteredCountries = searchCountries(query);
    }
    this.renderOptions();
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.button.querySelector('.dropdown-text').innerHTML = `
      <span class="selected-flag">${country.flag}</span>
      <span class="selected-name">${country.name}</span>
    `;
    
    // Actualizar select original
    this.originalSelect.value = country.code;
    
    // Disparar evento change
    const event = new Event('change', { bubbles: true });
    this.originalSelect.dispatchEvent(event);
    
    this.close();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.container.classList.add('open');
    this.searchInput.focus();
    this.searchInput.value = '';
    this.filteredCountries = [...ECUADOR_EXPORT_COUNTRIES];
    this.renderOptions();
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('open');
  }

  populateOriginalSelect() {
    // No sobrescribir las opciones existentes, solo mejorar la funcionalidad
    // Las opciones ya están definidas en el HTML
    console.log('Enhanced dropdown initialized with existing options');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const countrySelect = document.getElementById('country');
  if (countrySelect) {
    new EnhancedCountryDropdown(countrySelect);
  }
});