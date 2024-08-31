import { Request, Response } from 'express';
import { PeerSelectionService } from './PeerSelectionService';

export class PeerSelectionController {
    private peerSelectionService: PeerSelectionService;
    
    constructor() {
        this.peerSelectionService = new PeerSelectionService();
    }

    public post(req: Request, res: Response): void {
        const id = req.body.id;
        const result = this.peerSelectionService.insert(id);
        res.send(result);
    }
    public delete(req: Request, res: Response): void {
        const id = req.params.id;
        const result = this.peerSelectionService.delete(id);
        res.send(result);
    }
}