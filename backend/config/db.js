/**
 * Configuración de conexión a MongoDB Local
 * Conecta a instancia local de MongoDB o MongoDB Atlas
 */

import mongoose from 'mongoose';

/**
 * Establece conexión con base de datos MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`💾 Los datos persisten en disco`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    console.error('💡 Asegúrate de que MongoDB esté corriendo y el .env esté configurado');
    process.exit(1); // Terminar proceso si falla la conexión
  }
};

/**
 * Cierra conexión a MongoDB
 * Útil para shutdown graceful
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB desconectado');
  } catch (error) {
    console.error('Error al desconectar MongoDB:', error);
  }
};

export default connectDB;
