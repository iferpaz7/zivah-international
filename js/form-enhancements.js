// Form Enhancements for ZIVAH International
document.addEventListener('DOMContentLoaded', function () {

    // Mejorar validación del formulario
    const form = document.getElementById('quote-form');
    if (form) {
        enhanceFormValidation(form);
    }

    // Agregar animaciones a los campos del formulario
    enhanceFormAnimations();

    // Mejorar la experiencia del dropdown de productos
    enhanceProductDropdown();
});

function enhanceFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        // Validación en tiempo real
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Validación al enviar
    form.addEventListener('submit', function (e) {
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            showFormError('Por favor, completa todos los campos requeridos correctamente.');
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Limpiar errores previos
    clearFieldError(field);

    // Validar campos requeridos
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    }

    // Validaciones específicas
    if (value && fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
    }

    if (value && fieldType === 'tel') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');

    // Crear o actualizar mensaje de error
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function showFormError(message) {
    // Crear notificación de error
    const notification = document.createElement('div');
    notification.className = 'form-notification error';
    notification.innerHTML = `
    <span class="notification-icon">⚠️</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentNode.remove()">×</button>
  `;

    // Insertar al inicio del formulario
    const form = document.getElementById('quote-form');
    form.insertBefore(notification, form.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function enhanceFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach((group, index) => {
        // Animación de entrada escalonada
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('animate-in');

        const input = group.querySelector('input, select, textarea');
        if (input) {
            // Efecto de enfoque mejorado
            input.addEventListener('focus', function () {
                group.classList.add('focused');
            });

            input.addEventListener('blur', function () {
                group.classList.remove('focused');
            });
        }
    });
}

function enhanceProductDropdown() {
    const productSelect = document.getElementById('product');
    if (!productSelect) return;

    // Los productos ya están definidos en el HTML con optgroups
    // Solo agregar funcionalidad adicional si es necesario
    console.log('Product dropdown enhanced with existing options');

    // Agregar evento para logging (opcional)
    productSelect.addEventListener('change', function () {
        if (this.value) {
            console.log('Producto seleccionado:', this.value);
        }
    });
}

// Función para mostrar notificación de éxito
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'form-notification success';
    notification.innerHTML = `
    <span class="notification-icon">✅</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentNode.remove()">×</button>
  `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Función para formatear número de teléfono
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 10) {
        if (value.startsWith('1')) {
            value = value.substring(1);
        }
        value = value.substring(0, 10);
        value = `+1 (${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    }

    input.value = value;
}

// Agregar formato automático al campo de teléfono
document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            formatPhoneNumber(this);
        });
    }
});