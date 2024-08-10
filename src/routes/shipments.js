import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerShipment = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const shipmentsFilePath = path.join(_dirname, './../../data/shipments.json');

const readShipmentsFs = async () => {
    try {
        const shipments = await fs.readFile(shipmentsFilePath);
        return JSON.parse(shipments);
    } catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeShipmentsFs = async (shipments) => {
    await fs.writeFile(shipmentsFilePath, JSON.stringify(shipments, null, 2));
};

routerShipment.post('/', async (req, res) => {
    const shipments = await readShipmentsFs();
    const newShipment = {
        id: shipments.length + 1,
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId
    };

    shipments.push(newShipment);
    await writeShipmentsFs(shipments);
    res.status(201).json({ message: "Shipment created successfully", shipment: newShipment });
});

routerShipment.get('/', async (req, res) => {
    const shipments = await readShipmentsFs();
    res.json({ shipments });
});

routerShipment.get('/:id', async (req, res) => {
    const shipments = await readShipmentsFs();
    const shipment = shipments.find(s => s.id === parseInt(req.params.id));
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json({ shipment });
});

routerShipment.put('/:id', async (req, res) => {
    const shipments = await readShipmentsFs();
    const indexShipment = shipments.findIndex(s => s.id === parseInt(req.params.id));
    if (indexShipment === -1) return res.status(404).json({ message: 'Shipment not found' });
    const updateShipment = {
        ...shipments[indexShipment],
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId
    };

    shipments[indexShipment] = updateShipment;
    await writeShipmentsFs(shipments);
    res.json({ message: 'Shipment updated successfully', shipment: updateShipment });
});

routerShipment.delete('/:id', async (req, res) => {
    const shipments = await readShipmentsFs();
    const indexShipment = shipments.findIndex(s => s.id === parseInt(req.params.id));
    if (indexShipment === -1) return res.status(404).json({ message: 'Shipment not found' });
    shipments.splice(indexShipment, 1);
    await writeShipmentsFs(shipments);
    res.json({ message: 'Shipment deleted successfully' });
});

export default routerShipment;