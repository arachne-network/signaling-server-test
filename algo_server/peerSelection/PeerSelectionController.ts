import { Request, Response } from 'express';
import { PeerSelectionService } from './PeerSelectionService';

export class PeerSelectionController {
    private peerSelectionService: PeerSelectionService;
    
    constructor() {
        this.peerSelectionService = new PeerSelectionService();
    }

    public post(req: Request, res: Response): void {
        const id = req.params.id;
        const roomId = req.body.roomId;
        console.log(`PeerSelectionController > post | id: ${id}, roomId: ${roomId}`);
        // TODO: ERROR & status handling
        const result = this.peerSelectionService.insert(id, roomId);
        res.send(result);
    }
    public delete(req: Request, res: Response): void {
        const id = req.params.id;
        const roomId = req.body.roomId;
        console.log(`PeerSelectionController > delete | id: ${id}, roomId: ${roomId}`);
        const result = this.peerSelectionService.delete(id, roomId);
        res.send(result);
    }
}