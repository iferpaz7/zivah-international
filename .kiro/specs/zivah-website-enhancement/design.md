# Design Document

## Overview

El diseño propuesto transforma el sitio web estático de ZIVAH International en una aplicación web dinámica usando PHP 8.1+, MySQL 8.0, y arquitectura MVC moderna. La solución se optimiza específicamente para cPanel de InterServer, aprovechando sus características nativas como MySQL databases, email accounts, y file manager.

La arquitectura seguirá el patrón MVC (Model-View-Controller) con una capa de abstracción de datos (Repository Pattern) para facilitar el mantenimiento y escalabilidad. Se implementará un sistema de autenticación robusto, panel de administración intuitivo, y API REST para futuras integraciones.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (HTML/CSS/JS) │◄──►│   (PHP MVC)     │◄──►│   (MySQL 8.0)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│   cPanel APIs   │◄─────────────┘
                        │   (Email/Files) │
                        └─────────────────┘
```

### Directory Structure

```
/public_html/
├── index.php                 # Entry point
├── .htaccess                # URL rewriting
├── assets/                  # Static assets
│   ├── css/
│   ├── js/
│   └── images/
├── config/                  # Configuration files
│   ├── database.php
│   ├── app.php
│   └── email.php
├── src/                     # Application source
│   ├── Controllers/
│   ├── Models/
│   ├── Views/
│   ├── Repositories/
│   ├── Services/
│   └── Middleware/
├── admin/                   # Admin panel
│   ├── index.php
│   ├── login.php
│   └── dashboard/
├── api/                     # REST API endpoints
│   ├── products.php
│   ├── quotes.php
│   └── auth.php
└── vendor/                  # Composer dependencies
```

### Technology Stack

- **Backend**: PHP 8.1+ (compatible con cPanel)
- **Database**: MySQL 8.0 (cPanel native)
- **Frontend**: Vanilla JavaScript + existing CSS
- **Email**: cPanel Email API + PHPMailer
- **Authentication**: JWT tokens + PHP sessions
- **Dependency Management**: Composer
- **CSS Framework**: Mantener el diseño actual + Bootstrap 5 para admin
- **File Upload**: cPanel File Manager integration

## Components and Interfaces

### 1. Database Layer (Repository Pattern)

#### Database Schema

```sql
-- Productos
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT,
    description TEXT,
    features JSON,
    price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_active (is_active)
);

-- Categorías de productos
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INT DEFAULT 0
);

-- Cotizaciones
CREATE TABLE quotes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_number VARCHAR(20) UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    company VARCHAR(255),
    country VARCHAR(100),
    message TEXT,
    status ENUM('pending', 'processing', 'sent', 'closed') DEFAULT 'pending',
    total_amount DECIMAL(12,2),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (customer_email),
    INDEX idx_created (created_at)
);

-- Items de cotización
CREATE TABLE quote_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(12,2),
    notes TEXT,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Usuarios administradores
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuración del sitio
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Logs de actividad
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);
```

#### Repository Interfaces

```php
interface ProductRepositoryInterface {
    public function findAll(array $filters = []): array;
    public function findById(int $id): ?Product;
    public function findByCategory(int $categoryId): array;
    public function create(array $data): Product;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function updateStock(int $id, int $quantity): bool;
}

interface QuoteRepositoryInterface {
    public function findAll(array $filters = []): array;
    public function findById(int $id): ?Quote;
    public function create(array $data): Quote;
    public function updateStatus(int $id, string $status): bool;
    public function getStatistics(): array;
}
```

### 2. Controller Layer

#### Main Controllers

```php
class HomeController {
    public function index(): void;
    public function products(): void;
    public function about(): void;
    public function contact(): void;
}

class ProductController {
    public function index(): void;
    public function show(int $id): void;
    public function byCategory(string $slug): void;
}

class QuoteController {
    public function create(): void;
    public function store(array $data): void;
    public function success(): void;
}

class AdminController {
    public function dashboard(): void;
    public function products(): void;
    public function quotes(): void;
    public function settings(): void;
}

class ApiController {
    public function getProducts(): array;
    public function createQuote(array $data): array;
    public function updateProduct(int $id, array $data): array;
}
```

### 3. Service Layer

#### Core Services

```php
class ProductService {
    public function getAllProducts(array $filters = []): array;
    public function getProductById(int $id): ?Product;
    public function createProduct(array $data): Product;
    public function updateProduct(int $id, array $data): bool;
    public function deleteProduct(int $id): bool;
    public function updateStock(int $id, int $quantity): bool;
}

class QuoteService {
    public function createQuote(array $data): Quote;
    public function processQuote(int $id): bool;
    public function sendQuoteEmail(Quote $quote): bool;
    public function generateQuoteNumber(): string;
    public function calculateTotal(array $items): float;
}

class EmailService {
    public function sendQuoteNotification(Quote $quote): bool;
    public function sendQuoteResponse(Quote $quote, string $message): bool;
    public function sendWelcomeEmail(string $email, string $name): bool;
}

class AuthService {
    public function login(string $username, string $password): ?User;
    public function logout(): void;
    public function isAuthenticated(): bool;
    public function getCurrentUser(): ?User;
    public function generateToken(User $user): string;
}
```

### 4. Frontend Components

#### JavaScript Modules

```javascript
// Product Management
class ProductManager {
    async loadProducts(filters = {}) {}
    async createProduct(data) {}
    async updateProduct(id, data) {}
    async deleteProduct(id) {}
}

// Quote System
class QuoteSystem {
    constructor() {
        this.items = [];
        this.total = 0;
    }
    
    addItem(product, quantity) {}
    removeItem(productId) {}
    calculateTotal() {}
    async submitQuote(customerData) {}
}

// Admin Dashboard
class AdminDashboard {
    async loadStatistics() {}
    async loadRecentQuotes() {}
    async loadLowStockProducts() {}
}

// Form Validation
class FormValidator {
    static validateEmail(email) {}
    static validatePhone(phone) {}
    static validateRequired(fields) {}
}
```

## Data Models

### Core Models

```php
class Product {
    private int $id;
    private string $name;
    private int $categoryId;
    private string $description;
    private array $features;
    private float $price;
    private int $stockQuantity;
    private string $imageUrl;
    private bool $isActive;
    private DateTime $createdAt;
    private DateTime $updatedAt;
    
    // Getters, setters, and business logic methods
}

class Quote {
    private int $id;
    private string $quoteNumber;
    private string $customerName;
    private string $customerEmail;
    private string $customerPhone;
    private string $company;
    private string $country;
    private string $message;
    private string $status;
    private float $totalAmount;
    private array $items;
    private DateTime $createdAt;
    
    // Business logic methods
    public function addItem(QuoteItem $item): void;
    public function calculateTotal(): float;
    public function canBeModified(): bool;
}

class Category {
    private int $id;
    private string $name;
    private string $slug;
    private string $description;
    private string $icon;
    private string $color;
    private int $sortOrder;
}
```

## Error Handling

### Exception Hierarchy

```php
abstract class ZivahException extends Exception {}

class DatabaseException extends ZivahException {}
class ValidationException extends ZivahException {}
class AuthenticationException extends ZivahException {}
class AuthorizationException extends ZivahException {}
class EmailException extends ZivahException {}
class FileUploadException extends ZivahException {}
```

### Error Response Format

```php
class ErrorResponse {
    public function __construct(
        private string $message,
        private int $code,
        private array $details = [],
        private ?string $trace = null
    ) {}
    
    public function toArray(): array {
        return [
            'error' => true,
            'message' => $this->message,
            'code' => $this->code,
            'details' => $this->details,
            'timestamp' => date('c')
        ];
    }
}
```

### Global Error Handler

```php
class ErrorHandler {
    public static function handleException(Throwable $e): void;
    public static function handleError(int $errno, string $errstr, string $errfile, int $errline): void;
    public static function logError(string $message, array $context = []): void;
    public static function sendErrorNotification(Throwable $e): void;
}
```

## Testing Strategy

### Unit Testing

- **Models**: Validación de datos, métodos de negocio
- **Repositories**: Operaciones CRUD, consultas complejas
- **Services**: Lógica de negocio, integración entre componentes
- **Controllers**: Manejo de requests, responses

### Integration Testing

- **Database**: Conexiones, transacciones, migraciones
- **Email**: Envío de notificaciones, templates
- **File Upload**: Subida de imágenes, validación de archivos
- **Authentication**: Login, logout, permisos

### End-to-End Testing

- **User Flows**: Solicitud de cotización completa
- **Admin Flows**: Gestión de productos, procesamiento de cotizaciones
- **API Endpoints**: Todas las rutas REST

### Performance Testing

- **Load Testing**: Simulación de tráfico alto
- **Database Performance**: Optimización de consultas
- **Caching**: Efectividad del sistema de caché
- **Mobile Performance**: Tiempos de carga en dispositivos móviles

## Security Considerations

### Authentication & Authorization

- **Password Hashing**: bcrypt con salt
- **Session Management**: Tokens JWT + PHP sessions
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **CSRF Protection**: Tokens en formularios

### Data Protection

- **SQL Injection**: Prepared statements obligatorios
- **XSS Prevention**: Sanitización de inputs y outputs
- **File Upload Security**: Validación de tipos MIME
- **Data Encryption**: Información sensible en base de datos

### Infrastructure Security

- **HTTPS**: Certificado SSL obligatorio
- **File Permissions**: Configuración segura en cPanel
- **Database Access**: Usuarios con permisos mínimos
- **Backup Security**: Encriptación de backups

## Performance Optimization

### Caching Strategy

```php
class CacheManager {
    public function get(string $key): mixed;
    public function set(string $key, mixed $value, int $ttl = 3600): bool;
    public function delete(string $key): bool;
    public function flush(): bool;
    public function tags(array $tags): self;
}
```

### Database Optimization

- **Indexing**: Índices en columnas frecuentemente consultadas
- **Query Optimization**: Análisis de consultas lentas
- **Connection Pooling**: Reutilización de conexiones
- **Pagination**: Limitación de resultados por página

### Frontend Optimization

- **Asset Minification**: CSS y JavaScript comprimidos
- **Image Optimization**: Compresión automática, lazy loading
- **CDN Integration**: Distribución de assets estáticos
- **Progressive Loading**: Carga progresiva de contenido

## Deployment Strategy

### cPanel Integration

1. **Database Setup**: Creación de base de datos MySQL en cPanel
2. **File Upload**: Subida de archivos vía File Manager
3. **Domain Configuration**: Configuración de subdominios si necesario
4. **Email Setup**: Configuración de cuentas de email para notificaciones
5. **SSL Certificate**: Instalación de certificado Let's Encrypt

### Environment Configuration

```php
// config/app.php
return [
    'environment' => $_ENV['APP_ENV'] ?? 'production',
    'debug' => $_ENV['APP_DEBUG'] ?? false,
    'url' => $_ENV['APP_URL'] ?? 'https://zivah.com',
    'timezone' => 'America/Guayaquil',
    'locale' => 'es',
];

// config/database.php
return [
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'database' => $_ENV['DB_DATABASE'] ?? 'zivah_db',
    'username' => $_ENV['DB_USERNAME'],
    'password' => $_ENV['DB_PASSWORD'],
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
];
```

### Migration Strategy

1. **Backup Current Site**: Copia completa del sitio estático
2. **Database Migration**: Creación de esquema y datos iniciales
3. **Content Migration**: Migración de contenido estático a dinámico
4. **Testing Phase**: Pruebas en subdomain de staging
5. **Go Live**: Cambio de DNS y monitoreo

## Monitoring and Maintenance

### Logging Strategy

```php
class Logger {
    public function info(string $message, array $context = []): void;
    public function warning(string $message, array $context = []): void;
    public function error(string $message, array $context = []): void;
    public function debug(string $message, array $context = []): void;
}
```

### Health Checks

- **Database Connectivity**: Verificación de conexión MySQL
- **Email Service**: Test de envío de emails
- **File System**: Verificación de permisos de escritura
- **External APIs**: Monitoreo de servicios externos

### Backup Strategy

- **Daily Database Backups**: Automatización vía cron jobs
- **Weekly Full Backups**: Backup completo de archivos
- **Retention Policy**: 30 días de backups diarios, 12 semanas de backups semanales
- **Recovery Testing**: Pruebas mensuales de restauración