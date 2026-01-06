require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const app = express();
const prisma = new PrismaClient();

// Configurações básicas
app.use(express.json());
app.use(cors());

// --- Configuração do Cloudinary ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'freehub-uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// --- ROTAS ---

// Rota de Teste (para saber se o servidor está vivo)
app.get('/', (req, res) => {
  res.send('API do FreeHub está rodando! 🚀');
});

// 1. REGISTRO DE USUÁRIO (Com Log de Erro para Debug)
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verifica se usuário já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no Banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'client', // Padrão é cliente se não vier nada
      },
    });

    // Remove a senha antes de devolver os dados
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    // AQUI ESTÁ O SEGREDO PARA DESCOBRIRMOS O ERRO NO RENDER
    console.error("❌ ERRO CRÍTICO NO REGISTRO:", error); 
    
    // Retorna o erro 500
    return res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
});

// 2. LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ error: "Usuário não encontrado." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Senha incorreta." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...userData } = user;
    res.json({ user: userData, token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

// 3. CRIAR SERVIÇO (Com Upload de Imagem)
app.post('/services', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, userId } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.path; // URL da imagem no Cloudinary
    }

    const service = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        status: 'open',
        imageUrl: imageUrl,
        userId: parseInt(userId),
      },
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    res.status(500).json({ error: "Erro ao criar serviço." });
  }
});

// 4. LISTAR SERVIÇOS
app.get('/services', async (req, res) => {
  try {
    const services = await prisma.serviceRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(services);
  } catch (error) {
    console.error("Erro ao listar serviços:", error);
    res.status(500).json({ error: "Erro ao buscar serviços." });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});