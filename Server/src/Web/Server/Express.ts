import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

import { SaveServer } from "@spt-aki/servers/SaveServer";
import { IAkiProfile } from '@spt-aki/models/eft/profile/IAkiProfile';
import { ReadFileContent } from '../../Controllers/Reader/FileReader';
import CompileCoreData from '../../Controllers/PostRaid/CompileCoreData';

const app: Express = express();
const port = 7829;

import { getSessiondata } from '../../mod';
import CompileRaidData from '../../Controllers/PostRaid/CompileRaidData';
import CompileRaidPositionalData from '../../Controllers/PostRaid/CompileRaidPositionalData';

function StartWebServer(saveServer: SaveServer) {

  app.use(cors())

  const publicFolder = path.join(__dirname, '/public/');
  app.use(express.static(publicFolder));

  app.get('/', (req: Request, res: Response) => {
    return res.sendFile(path.join(__dirname, '/public/index.html'));
  });
  
  app.get('/api/profile/active', (req: Request, res: Response) => {
    let { session_id, profile_id } = getSessiondata();

    if (!session_id && !profile_id) return res.json({ profileId: null, sessionId: session_id });

    return res.json({ profileId: profile_id, sessionId: session_id  });
  });

  app.get('/api/profile/all', (req: Request, res: Response) => {
    const profiles = saveServer.getProfiles() as Record<string, IAkiProfile>;
    return res.json(profiles);
  });

  app.get('/api/profile/:profileId', (req: Request, res: Response) => {
    const profiles = saveServer.getProfiles() as Record<string, IAkiProfile>;
    return res.json(profiles[req.params.profileId]);
  });

  app.get('/api/profile/:profileId/compile_core', async (req: Request, res: Response) => {
    CompileCoreData(req.params.profileId);
  });

  app.get('/api/profile/:profileId/raids/all', (req: Request, res: Response) => {
    let { profileId } = req.params;
    let profileRaidData = ReadFileContent(profileId, '', 'core', 'core.json');
    res.json(profileRaidData);
  })

  app.get('/api/profile/:profileId/raids/:raidId', (req: Request, res: Response) => {
    let { profileId, raidId } = req.params;
    let raidData = ReadFileContent(profileId, 'raids', raidId, `${raidId}_data.json`);
    res.json(raidData);
  })

  app.get('/api/profile/:profileId/raids/:raidId', (req: Request, res: Response) => {
    let { profileId, raidId } = req.params;
    let raidData = ReadFileContent(profileId, 'raids', raidId, `${raidId}_data.json`);
    res.json(raidData);
  })

  app.get('/api/profile/:profileId/raids/:raidId/positions', (req: Request, res: Response) => {
    let { profileId, raidId } = req.params;
    let positionalData = ReadFileContent(profileId, 'raids', raidId, `${raidId}_positions.json`);
    res.json(positionalData);
  })

  app.get('/api/profile/:profileId/raids/:raidId/compile', async (req: Request, res: Response) => {
    CompileRaidData(req.params.profileId, req.params.raidId);
    CompileRaidPositionalData(req.params.profileId, req.params.raidId);
  });

  app.get('*', (req: Request, res: Response) => {
    return res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  app.listen(port, () => {
    return console.log(`[STATS] Web Server is running at 'http://127.0.0.1:${port}'`);
  });

}

export default StartWebServer;