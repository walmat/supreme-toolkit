import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
// import { Webhook } from 'webhook-discord';

import models, { connectDb } from './models';
import routes from './routes';
// import Task from './task';

const app = express();
app.disable('x-powered-by');

// Application-Level Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models,
  };
  next();
});

// Routes
app.use('/us', routes.us);
// app.use('/eu', routes.eu);
// app.use('/jp', routes.jp);
// app.use('/pooky', routes.pooky);

// Start
// const { ERASE_ON_START } = process.env;
connectDb().then(async () => {
  // if (ERASE_ON_START) {
  //   await Promise.all([
  //     models.US.deleteMany({}),
  //     models.EU.deleteMany({}),
  //     models.JP.deleteMany({}),
  //     models.Pooky.deleteMany({}),
  //   ]);
  // }

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server live on ${process.env.PORT}`);
    // const { USE_SINGLE_REGION, DISCORD_WEBHOOK } = process.env;

    // let webhook;
    // if (DISCORD_WEBHOOK) {
    //   webhook = new Webhook(DISCORD_WEBHOOK);
    // }

    // switch (USE_SINGLE_REGION) {
    //   case 'true':
    //   case true: {
    //     const { SINGLE_REGION } = process.env;
    //     console.warn(`[DEBUG]: Warning! Using single region: ${SINGLE_REGION}!`);

    //     const proxy = process.env[`${SINGLE_REGION}_PROXY`];
    //     const pollRate = process.env[`${SINGLE_REGION}_POLL_RATE`];

    //     if (!proxy) {
    //       console.warn(`[DEBUG]: Warning! Proxy not specified for ${SINGLE_REGION}!`);
    //     }

    //     if (!pollRate) {
    //       console.warn(`[DEBUG]: Warning! No poll rate specified! Using 2500 milliseconds.`);
    //     }
    //     const task = new Task(proxy, webhook);

    //     console.warn(`[DEBUG]: Starting task for Supreme ${SINGLE_REGION}`);
    //     return task.start(pollRate || 2500);
    //   }
    //   default: {
    //     const {
    //       USA_PROXY,
    //       EU_PROXY,
    //       JP_PROXY,
    //       USA_POLL_RATE,
    //       EU_POLL_RATE,
    //       JP_POLL_RATE
    //     } = process.env;

    //     if (!USA_PROXY) {
    //       console.warn(`[DEBUG]: Warning! US Proxy not specified! Form fields may be invalid.`);
    //     }

    //     if (!EU_PROXY) {
    //       console.warn(`[DEBUG]: Warning! EU Proxy not specified! Form fields may be invalid.`);
    //     }

    //     if (!JP_PROXY) {
    //       console.warn(`[DEBUG]: Warning! JP Proxy not specified! Form fields may be invalid.`);
    //     }

    //     const USA = new Task(USA_PROXY, webhook);
    //     const EU = new Task(EU_PROXY, webhook);
    //     const JP = new Task(JP_PROXY, webhook);
    //     return Promise.all([USA.start(USA_POLL_RATE || 2500), EU.start(EU_POLL_RATE || 2500), JP.start(JP_POLL_RATE || 2500)])
    //   }
    // }
  });
});
