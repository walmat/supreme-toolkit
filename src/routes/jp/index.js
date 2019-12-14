import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const form = await req.context.models.JP.find().sort({ _id: -1 }).limit(1);

    if (!form || (form && !form.length)) {
      return res.send([]);
    }
  
    const formData = form[0];
    const { data } = formData
    return res.send(data);
  } catch (err) {
    return res.send([]);
  }
});

export default router;