/**
 * Configuración de la base de datos MongoDB
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    // Eventos de la conexión
    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });

    // Cerrar conexión si la app se cierra
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión de MongoDB cerrada');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
