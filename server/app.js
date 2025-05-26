/**
 * ========================================
 * SERVIDOR BACKEND - PORTFOLIO PROFESIONAL
 * ========================================
 * API RESTful con Node.js, Express y mejores prácticas
 * Incluye: Validación, Seguridad, Logging, Rate Limiting
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
require('dotenv').config();

// ========================================
// CONFIGURACIÓN DEL SERVIDOR
// ========================================
const CONFIG = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuración CORS
  CORS_ORIGINS: process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',') : 
    ['http://localhost:3000', 'http://localhost:8080'],
  
  // Configuración de Email
  EMAIL: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: process.env.SMTP_PORT || 587,
    SECURE: process.env.SMTP_SECURE === 'true',
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
    FROM: process.env.SMTP_FROM || 'noreply@portfolio.com',
    TO: process.env.CONTACT_EMAIL || 'contacto@portfolio.com'
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: 100, // máximo 100 requests por ventana
    MESSAGE: 'Demasiadas solicitudes, intenta más tarde'
  },
  
  // Configuración de archivos
  UPLOADS: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  }
};

// ========================================
// INICIALIZACIÓN DE EXPRESS
// ========================================
const app = express();

// ========================================
// MIDDLEWARES DE SEGURIDAD
// ========================================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configurado
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (CONFIG.CORS_ORIGINS.indexOf(origin) !== -1 || CONFIG.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const msg = 'CORS policy: No permitido por CORS';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.WINDOW_MS,
  max: CONFIG.RATE_LIMIT.MAX_REQUESTS,
  message: {
    error: CONFIG.RATE_LIMIT.MESSAGE,
    retryAfter: Math.ceil(CONFIG.RATE_LIMIT.WINDOW_MS / 60000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting para archivos estáticos en desarrollo
    return CONFIG.NODE_ENV === 'development' && req.url.startsWith('/assets');
  }
});

app.use('/api', limiter);

// Compresión
app.use(compression());

// Logging
if (CONFIG.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Parseo de JSON con límite de tamaño
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// CONFIGURACIÓN DE EMAIL
// ========================================
let transporter = null;

async function initializeEmailTransporter() {
  if (!CONFIG.EMAIL.USER || !CONFIG.EMAIL.PASS) {
    console.warn('⚠️  Credenciales de email no configuradas. El envío de emails estará deshabilitado.');
    return;
  }
  
  try {
    transporter = nodemailer.createTransporter({
      host: CONFIG.EMAIL.HOST,
      port: CONFIG.EMAIL.PORT,
      secure: CONFIG.EMAIL.SECURE,
      auth: {
        user: CONFIG.EMAIL.USER,
        pass: CONFIG.EMAIL.PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Transporter de email configurado correctamente');
  } catch (error) {
    console.error('❌ Error configurando email:', error.message);
    transporter = null;
  }
}

// ========================================
// UTILIDADES DE VALIDACIÓN
// ========================================
const ValidationUtils = {
  /**
   * Validar email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Sanitizar string
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  },
  
  /**
   * Validar longitud
   */
  isValidLength(str, min = 0, max = Infinity) {
    const length = str ? str.length : 0;
    return length >= min && length <= max;
  },
  
  /**
   * Detectar spam básico
   */
  isSpam(data) {
    const spamPatterns = [
      /\b(viagra|casino|lottery|winner|congratulations)\b/i,
      /\b(click here|buy now|act now|limited time)\b/i,
      /(http[s]?:\/\/){2,}/g, // múltiples URLs
      /[A-Z]{10,}/, // demasiadas mayúsculas consecutivas
    ];
    
    const content = `${data.name} ${data.subject} ${data.message}`.toLowerCase();
    return spamPatterns.some(pattern => pattern.test(content));
  }
};

// ========================================
// MIDDLEWARE DE VALIDACIÓN DE CONTACTO
// ========================================
function validateContactForm(req, res, next) {
  const { name, email, subject, message } = req.body;
  const errors = [];
  
  // Validar campos requeridos
  if (!name || !ValidationUtils.isValidLength(name, 2, 100)) {
    errors.push('El nombre debe tener entre 2 y 100 caracteres');
  }
  
  if (!email || !ValidationUtils.isValidEmail(email)) {
    errors.push('El email no es válido');
  }
  
  if (!subject || !ValidationUtils.isValidLength(subject, 5, 200)) {
    errors.push('El asunto debe tener entre 5 y 200 caracteres');
  }
  
  if (!message || !ValidationUtils.isValidLength(message, 10, 2000)) {
    errors.push('El mensaje debe tener entre 10 y 2000 caracteres');
  }
  
  // Detectar spam
  if (ValidationUtils.isSpam({ name, subject, message })) {
    errors.push('Mensaje detectado como spam');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }
  
  // Sanitizar datos
  req.body.name = ValidationUtils.sanitizeString(name);
  req.body.subject = ValidationUtils.sanitizeString(subject);
  req.body.message = ValidationUtils.sanitizeString(message);
  
  next();
}

// ========================================
// RUTAS DE LA API
// ========================================

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: CONFIG.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

/**
 * Información del servidor
 */
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Portfolio API',
      version: '1.0.0',
      environment: CONFIG.NODE_ENV,
      features: {
        email: !!transporter,
        cors: true,
        rateLimit: true,
        compression: true
      }
    }
  });
});

/**
 * Endpoint de contacto
 */
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const { name, email, subject, message, timestamp, userAgent, language } = req.body;
    
    // Datos del contacto
    const contactData = {
      name,
      email,
      subject,
      message,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || req.get('User-Agent'),
      language: language || 'es',
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Guardar en archivo (en producción usar base de datos)
    await saveContactMessage(contactData);
    
    // Enviar email si está configurado
    if (transporter) {
      await sendContactEmail(contactData);
      await sendConfirmationEmail(contactData);
    }
    
    // Log del contacto
    console.log(`📧 Nuevo contacto de ${name} (${email}): ${subject}`);
    
    res.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data: {
        id: generateContactId(),
        timestamp: contactData.timestamp
      }
    });
    
  } catch (error) {
    console.error('❌ Error procesando contacto:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: CONFIG.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Listar mensajes de contacto (solo para desarrollo)
 */
app.get('/api/contacts', async (req, res) => {
  if (CONFIG.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'No autorizado'
    });
  }
  
  try {
    const contacts = await getContactMessages();
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo contactos',
      error: error.message
    });
  }
});

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Guardar mensaje de contacto
 */
async function saveContactMessage(data) {
  const contactsDir = path.join(__dirname, 'data');
  const contactsFile = path.join(contactsDir, 'contacts.json');
  
  try {
    // Crear directorio si no existe
    await fs.mkdir(contactsDir, { recursive: true });
    
    // Leer contactos existentes
    let contacts = [];
    try {
      const existingData = await fs.readFile(contactsFile, 'utf8');
      contacts = JSON.parse(existingData);
    } catch (error) {
      // Archivo no existe, usar array vacío
    }
    
    // Agregar nuevo contacto
    contacts.push({
      id: generateContactId(),
      ...data,
      createdAt: new Date().toISOString()
    });
    
    // Mantener solo los últimos 100 contactos
    if (contacts.length > 100) {
      contacts = contacts.slice(-100);
    }
    
    // Guardar archivo
    await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2));
    
  } catch (error) {
    console.error('Error guardando contacto:', error);
    throw error;
  }
}

/**
 * Obtener mensajes de contacto
 */
async function getContactMessages() {
  const contactsFile = path.join(__dirname, 'data', 'contacts.json');
  
  try {
    const data = await fs.readFile(contactsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

/**
 * Enviar email de contacto
 */
async function sendContactEmail(data) {
  if (!transporter) return;
  
  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: CONFIG.EMAIL.TO,
    subject: `[Portfolio] Nuevo contacto: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nuevo mensaje de contacto</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Asunto:</strong> ${data.subject}</p>
          <p><strong>Fecha:</strong> ${new Date(data.timestamp).toLocaleString('es-ES')}</p>
        </div>
        
        <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3>Mensaje:</h3>
          <p style="line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; font-size: 12px; color: #64748b;">
          <p><strong>Información técnica:</strong></p>
          <p>IP: ${data.ip}</p>
          <p>User Agent: ${data.userAgent}</p>
          <p>Idioma: ${data.language}</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

/**
 * Enviar email de confirmación
 */
async function sendConfirmationEmail(data) {
  if (!transporter) return;
  
  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: data.email,
    subject: 'Confirmación - Mensaje recibido',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">¡Mensaje recibido!</h2>
        
        <p>Hola <strong>${data.name}</strong>,</p>
        
        <p>Hemos recibido tu mensaje y te contactaremos pronto. Aquí tienes un resumen:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Asunto:</strong> ${data.subject}</p>
          <p><strong>Fecha:</strong> ${new Date(data.timestamp).toLocaleString('es-ES')}</p>
        </div>
        
        <p>Normalmente respondemos en un plazo de 24-48 horas.</p>
        
        <p>¡Gracias por tu interés!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #64748b;">
          <p>Este es un email automático, por favor no respondas a esta dirección.</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

/**
 * Generar ID único para contacto
 */
function generateContactId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========================================
// SERVIR ARCHIVOS ESTÁTICOS
// ========================================
const staticPath = path.join(__dirname, '..', 'src');
app.use(express.static(staticPath, {
  maxAge: CONFIG.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Headers de cache para diferentes tipos de archivo
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css)$/)) {
      res.setHeader('Cache-Control', 'max-age=31536000'); // 1 año
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'max-age=2592000'); // 30 días
    }
  }
}));

// Ruta catch-all para SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'Endpoint no encontrado'
    });
  }
  
  res.sendFile(path.join(staticPath, 'index.html'));
});

// ========================================
// MANEJO DE ERRORES
// ========================================

// Error 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado',
    path: req.path
  });
});

// Error handler global
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: CONFIG.NODE_ENV === 'production' ? 
      'Error interno del servidor' : 
      error.message,
    ...(CONFIG.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// ========================================
// INICIALIZACIÓN DEL SERVIDOR
// ========================================
async function startServer() {
  try {
    // Inicializar servicios
    await initializeEmailTransporter();
    
    // Crear directorio de datos
    const dataDir = path.join(__dirname, 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Iniciar servidor
    const server = app.listen(CONFIG.PORT, () => {
      console.log('🚀 Servidor iniciado correctamente');
      console.log(`📍 URL: http://localhost:${CONFIG.PORT}`);
      console.log(`🌍 Entorno: ${CONFIG.NODE_ENV}`);
      console.log(`📧 Email: ${transporter ? 'Habilitado' : 'Deshabilitado'}`);
      console.log('=' .repeat(50));
    });
    
    // Manejo graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🔄 Recibida señal SIGTERM, cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('🔄 Recibida señal SIGINT, cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Inicializar solo si es el archivo principal
if (require.main === module) {
  startServer();
}

module.exports = app;