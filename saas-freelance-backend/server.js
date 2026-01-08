import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;
  console.log('Tentando registrar:', email);

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    const user = await prisma.user.create({
      data: { name, email, password, userType }
    });
    console.log('Usuário criado com sucesso:', user.id);
    res.json(user);
  } catch (error) {
    console.error('ERRO NO REGISTRO:', error);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    res.json(user);
  } catch (error) {
    console.error('ERRO NO LOGIN:', error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

app.post('/services', upload.single('image'), async (req, res) => {
  const { title, description, price, userId, location } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  console.log('Criando serviço para user:', userId);

  try {
    const service = await prisma.service.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        location,
        userId
      }
    });
    res.json(service);
  } catch (error) {
    console.error('ERRO AO CRIAR SERVIÇO:', error);
    res.status(500).json({ error: 'Erro ao criar serviço.' });
  }
});

app.get('/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: { 
        client: true,
        provider: true,
        review: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(services);
  } catch (error) {
    console.error('ERRO AO BUSCAR SERVIÇOS:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços.' });
  }
});

app.patch('/services/:id/accept', async (req, res) => {
  const { id } = req.params;
  const { providerId } = req.body;
  try {
    const service = await prisma.service.update({
      where: { id },
      data: { 
        status: 'accepted',
        providerId: providerId 
      }
    });
    res.json(service);
  } catch (error) {
    console.error('ERRO AO ACEITAR:', error);
    res.status(500).json({ error: 'Erro ao aceitar serviço.' });
  }
});

app.patch('/services/:id/finish', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.service.update({
      where: { id },
      data: { status: 'finished' }
    });
    res.json(service);
  } catch (error) {
    console.error('ERRO AO FINALIZAR:', error);
    res.status(500).json({ error: 'Erro ao finalizar serviço.' });
  }
});

app.get('/services/:id/messages', async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { serviceId: id },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    console.error('ERRO MENSAGENS:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

app.post('/messages', async (req, res) => {
  const { content, serviceId, senderId } = req.body;
  try {
    const message = await prisma.message.create({
      data: { content, serviceId, senderId }
    });
    res.json(message);
  } catch (error) {
    console.error('ERRO AO ENVIAR MENSAGEM:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

app.post('/reviews', async (req, res) => {
  const { rating, comment, serviceId, userId } = req.body;
  try {
    const review = await prisma.review.create({
      data: { 
        rating, 
        comment, 
        service: { connect: { id: serviceId } },
        user: { connect: { id: userId } }
      }
    });
    res.json(review);
  } catch (error) {
    console.error('ERRO AVALIAÇÃO:', error);
    res.status(500).json({ error: 'Erro ao salvar avaliação' });
  }
});

// --- ROTAS DE NEGOCIAÇÃO (ADICIONE ISSO) ---

app.patch('/services/:id/offer', async (req, res) => {
  const { id } = req.params;
  const { newPrice, providerId } = req.body;
  console.log(`Recebendo oferta para serviço ${id}: R$ ${newPrice} do provider ${providerId}`);
  
  try {
    const service = await prisma.service.update({
      where: { id },
      data: { 
        price: String(newPrice), // Atualiza o preço
        providerId: providerId,  // Vincula o prestador temporariamente
        status: 'pending_approval' // Muda status para o cliente aprovar
      }
    });
    res.json(service);
  } catch (error) {
    console.error('ERRO AO ENVIAR PROPOSTA:', error);
    res.status(500).json({ error: 'Erro ao processar proposta.' });
  }
});

app.patch('/services/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.service.update({
      where: { id },
      data: { status: 'accepted' } // Aceita e fecha negócio
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aprovar.' });
  }
});

app.patch('/services/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    // Se rejeitar, volta a ficar "open" e sem dono
    const service = await prisma.service.update({
      where: { id },
      data: { 
        status: 'open',
        providerId: null 
      } 
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao rejeitar.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});