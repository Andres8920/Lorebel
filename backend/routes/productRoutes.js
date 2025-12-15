import express from 'express';
import { body } from 'express-validator';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validaciones
const productValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  body('precio')
    .notEmpty()
    .withMessage('El precio es requerido')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  body('stock')
    .notEmpty()
    .withMessage('El stock es requerido')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('categoria')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isMongoId()
    .withMessage('ID de categoría no válido'),
  body('imagen')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('La imagen debe ser una URL válida')
];

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas CRUD
router.get('/', getProducts);              // GET /api/products
router.get('/:id', getProduct);            // GET /api/products/:id
router.post('/', productValidation, createProduct);       // POST /api/products
router.put('/:id', productValidation, updateProduct);     // PUT /api/products/:id
router.delete('/:id', deleteProduct);      // DELETE /api/products/:id

export default router;
