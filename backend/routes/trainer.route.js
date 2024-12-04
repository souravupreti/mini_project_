import express from 'express';
import { createTrainer, getTrainers, updateTrainer, deleteTrainer, buyTrainerService } from '../controllers/trainer.controller.js';

const routersss = express.Router();

// Create a new trainer
routersss.post('/create', createTrainer);

// Get all trainers
routersss.get('/', getTrainers);

// Update a trainer's details
routersss.put('/:id', updateTrainer);

// Delete a trainer
routersss.delete('/:id', deleteTrainer);

// Buy a trainer's services
routersss.post('/buy/:id', buyTrainerService);

export default routersss;
