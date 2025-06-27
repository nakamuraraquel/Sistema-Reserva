import { Request, Response } from 'express';
import Reserva from '../models/Reserva';

export const criarReserva = async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.create(req.body);
    res.status(201).json(reserva);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar reserva' });
  }
};

export const listarReservas = async (req: Request, res: Response) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar reservas' });
  }
};

export const atualizarReserva = async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reserva);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar reserva' });
  }
};

export const deletarReserva = async (req: Request, res: Response) => {
  try {
    await Reserva.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Reserva excluída com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao excluir reserva' });
  }
};
