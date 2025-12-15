/**
 * Script para eliminar todas las imágenes de los productos
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

const removeImages = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/productosDB');
    console.log('✅ Conectado a MongoDB');

    // Obtener todos los productos
    const products = await Product.find({});
    console.log(`📦 Total de productos: ${products.length}`);

    // Contar productos con imagen
    const withImages = products.filter(p => p.imagen);
    console.log(`🖼️  Productos con imagen: ${withImages.length}`);

    if (withImages.length > 0) {
      // Eliminar campo imagen de todos los productos
      const result = await Product.updateMany(
        {}, 
        { $unset: { imagen: 1 } }
      );
      console.log(`✅ Imágenes eliminadas de ${result.modifiedCount} productos`);
    } else {
      console.log('✅ No hay productos con imágenes');
    }

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

removeImages();
