import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import routerWarehouse from './routes/warehouses.js';
import routeShipment from './routes/shipments.js';
import routeDriver from './routes/drivers.js';
import routeVehicle from './routes/vehicles.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use('/warehouses', routerWarehouse);
app.use('/shipments', routeShipment);
app.use('/drivers', routeDriver);
app.use('/vehicles', routeVehicle);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`El puerto está siendo escuchado correctamente en http://localhost:${PORT}`);
});