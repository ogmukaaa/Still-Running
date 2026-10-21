import { Router } from 'express';
import { atualizar, buscar, criar, listar, remover } from '../controllers/TenisController.js';
import uploadImagem from '../middleware/uploadImagem.js';

const router = Router();

router.get('/', listar);
router.get('/:id', buscar);
router.post('/', uploadImagem, criar);
router.put('/:id', uploadImagem, atualizar);
router.delete('/:id', remover);

export default router;
