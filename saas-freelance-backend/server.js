require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "chave_secreta_padrao";

app.use(express.json());
app.use(cors());

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return strongPasswordRegex.test(password);
}

app.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;
  if (!validatePassword(password)) return res.status(400).json({ error: "Senha fraca." });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email já existe." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, userType, password: hashedPassword },
    });
    const { password: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Credenciais inválidas." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Credenciais inválidas." });

    const token = jwt.sign({ id: user.id, userType: user.userType }, SECRET_KEY, { expiresIn: '1d' });
    return res.json({ user: { id: user.id, name: user.name, userType: user.userType }, token });
  } catch (error) {
    return res.status(500).json({ error: "Erro no login." });
  }
});

app.get('/services', async (req, res) => {
  const services = await prisma.serviceRequest.findMany({
    where: { 
      OR: [
        { status: 'ABERTO' },
        { status: 'ANALISE' }
      ]
    },
    include: { client: { select: { name: true } } }
  });
  return res.json(services);
});

app.post('/services', async (req, res) => {
  const { title, description, budget, clientId, address } = req.body;

  try {
    const service = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        budget: parseFloat(budget),
        status: 'ABERTO',
        clientId: parseInt(clientId),
        address: address || "Endereço não informado",
        latitude: null,
        longitude: null
      }
    });
    return res.json(service);
  } catch (error) {
    console.error("Erro ao criar:", error);
    return res.status(500).json({ error: "Erro ao criar serviço." });
  }
});

app.patch('/services/:id/accept', async (req, res) => {
  const { id } = req.params;
  const { providerId } = req.body;

  try {
    const service = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: {
        status: 'EM_ANDAMENTO',
        providerId: parseInt(providerId)
      }
    });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao aceitar serviço." });
  }
});

app.patch('/services/:id/offer', async (req, res) => {
  const { id } = req.params;
  const { providerId, newPrice } = req.body;

  try {
    const service = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: {
        status: 'ANALISE',
        providerId: parseInt(providerId),
        budget: parseFloat(newPrice)
      }
    });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao enviar proposta." });
  }
});

app.get('/my-projects/:providerId', async (req, res) => {
  const { providerId } = req.params;
  try {
    const services = await prisma.serviceRequest.findMany({
      where: { 
        providerId: parseInt(providerId),
        OR: [
          { status: 'EM_ANDAMENTO' },
          { status: 'CONCLUIDO' }
        ]
      },
      include: { client: { select: { name: true } } }
    });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar projetos." });
  }
});

app.patch('/services/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: { status: 'EM_ANDAMENTO' }
    });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao aprovar proposta." });
  }
});

app.patch('/services/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'ABERTO',   
        providerId: null
      }
    });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao recusar proposta." });
  }
});

app.patch('/services/:id/finish', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: { status: 'CONCLUIDO' }
    });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao concluir serviço." });
  }
});

app.get('/earnings/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const completedServices = await prisma.serviceRequest.findMany({
      where: { 
        providerId: parseInt(userId),
        status: 'CONCLUIDO' 
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalEarnings = completedServices.reduce((acc, curr) => acc + curr.budget, 0);

    return res.json({
      total: totalEarnings,
      count: completedServices.length,
      history: completedServices
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao calcular ganhos." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Backend Seguro rodando em http://localhost:${port}`);
});