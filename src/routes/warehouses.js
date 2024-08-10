import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerWarehouse = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const warehousesFilePath = path.join(_dirname, './../../data/warehouses.json');

const readWarehousesFs = async () => {
    try{
        const warehouses = await fs.readFile(warehousesFilePath);
        return JSON.parse(warehouses);
    }
    catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
}

const writeWarehousesFs = async (warehouses) => {
    await fs.writeFile(warehousesFilePath, JSON.stringify(warehouses, null, 2));
};

routerWarehouse.post('/', async (req, res) => {
    const warehouses = await readWarehousesFs();
    const newWarehouse = {
        id: warehouses.length + 1,
        name: req.body.name,
        location: req.body.location
    };

    warehouses.push(newWarehouse);
    await writeWarehousesFs(warehouses);
    res.status(201).json({message: "Warehouse created successfully", warehouse: newWarehouse });
});

routerWarehouse.get('/', async (req, res) => {
    const warehouses = await readWarehousesFs();
    res.json({ warehouses });
});

routerWarehouse.get('/:id', async (req, res) => {
    const warehouses = await readWarehousesFs();
    const warehouse = warehouses.find(w => w.id === parseInt(req.params.id));
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    res.json({ warehouse });
});

routerWarehouse.put('/:id', async (req, res) => {
    const warehouses = await readWarehousesFs();
    const indexWarehouse = warehouses.findIndex(w => w.id === parseInt(req.params.id));
    if (indexWarehouse === -1) return res.status(404).json({ message: 'Warehouse not found' });
    const updateWarehouse = {
        ...warehouses[indexWarehouse],
        name: req.body.name,
        location: req.body.location
    };

    warehouses[indexWarehouse] = updateWarehouse;
    await writeWarehousesFs(warehouses);
    res.json({ message: 'Warehouse updated successfully', warehouse: updateWarehouse });
});

routerWarehouse.delete('/:id', async (req, res) => {
    const warehouses = await readWarehousesFs();
    const indexWarehouse = warehouses.findIndex(w => w.id === parseInt(req.params.id));
    if (indexWarehouse === -1) return res.status(404).json({ message: 'Warehouse not found' });
    warehouses.splice(indexWarehouse, 1);
    await writeWarehousesFs(warehouses);
    res.json({ message: 'Warehouse deleted successfully' });
});

export default routerWarehouse;