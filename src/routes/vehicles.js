import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerVehicle = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const vehiclesFilePath = path.join(_dirname, './../../data/vehicles.json');

const readVehiclesFs = async () => {
    try {
        const vehicles = await fs.readFile(vehiclesFilePath);
        return JSON.parse(vehicles);
    } catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeVehiclesFs = async (vehicles) => {
    await fs.writeFile(vehiclesFilePath, JSON.stringify(vehicles, null, 2));
};

routerVehicle.post('/', async (req, res) => {
    const vehicles = await readVehiclesFs();
    const newVehicle = {
        id: vehicles.length + 1,
        model: req.body.model,
        year: req.body.year,
        driverId: req.body.driverId
    };

    vehicles.push(newVehicle);
    await writeVehiclesFs(vehicles);
    res.status(201).json({ message: "Vehicle created successfully", vehicle: newVehicle });
});

routerVehicle.get('/', async (req, res) => {
    const vehicles = await readVehiclesFs();
    res.json({ vehicles });
});

routerVehicle.get('/:id', async (req, res) => {
    const vehicles = await readVehiclesFs();
    const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ vehicle });
});

routerVehicle.put('/:id', async (req, res) => {
    const vehicles = await readVehiclesFs();
    const indexVehicle = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (indexVehicle === -1) return res.status(404).json({ message: 'Vehicle not found' });
    const updateVehicle = {
        ...vehicles[indexVehicle],
        model: req.body.model,
        year: req.body.year,
        driverId: req.body.driverId
    };

    vehicles[indexVehicle] = updateVehicle;
    await writeVehiclesFs(vehicles);
    res.json({ message: 'Vehicle updated successfully', vehicle: updateVehicle });
});

routerVehicle.delete('/:id', async (req, res) => {
    const vehicles = await readVehiclesFs();
    const indexVehicle = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (indexVehicle === -1) return res.status(404).json({ message: 'Vehicle not found' });
    vehicles.splice(indexVehicle, 1);
    await writeVehiclesFs(vehicles);
    res.json({ message: 'Vehicle deleted successfully' });
});

export default routerVehicle;