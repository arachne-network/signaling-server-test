import { Router } from "express";
import { PeerSelectionController } from "./PeerSelectionController";

const router = Router();
const peerSelectionController = new PeerSelectionController();

router.post('/:id', (req, res) => peerSelectionController.post(req, res));
router.delete('/:id', (req, res) => peerSelectionController.delete(req, res));

export default router;