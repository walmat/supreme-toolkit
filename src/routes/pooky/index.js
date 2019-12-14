import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const pookyList = await req.context.models.Pooky.find().sort({ _id: -1 }).limit(25);

    if (!pookyList || (pookyList && !pookyList.length)) {
      return res.send([]);
    }

    const pookyData = pookyList.map(p => ({ data: p.data }));
    return res.send(pookyData);
  } catch (err) {
    return res.send([]);
  }

});

export default router;
