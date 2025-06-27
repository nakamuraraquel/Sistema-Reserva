import { Router } from 'express';
import { criarReserva, listarReservas, atualizarReserva, deletarReserva } from '../controllers/reservaController';

const router = Router();

router.post('/', criarReserva);
router.get('/', listarReservas);
router.put('/:id', atualizarReserva);
router.delete('/:id', deletarReserva);

export default router;
