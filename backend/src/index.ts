import express from 'express';
import cors from 'cors';
import { rewritePipeline } from './pipeline';
import type { RewriteRequest } from './types';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/rewrite', async (req, res) => {
  try {
    const result = await rewritePipeline(req.body as RewriteRequest);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`ToneSlyder backend listening on ${port}`);
});
