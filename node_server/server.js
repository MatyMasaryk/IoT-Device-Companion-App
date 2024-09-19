const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
var multer = require('multer');
var bodyParser = require('body-parser');

const Device = require('./models/device');
const Experiment = require('./models/experiment');
const Measurement = require('./models/procedures/measurement');
const Procedure = require('./models/procedures/procedure');

const app = express();
var upload = multer();
const jsonParser = bodyParser.json();
const port = 5000;
const listenUrl = `http://localhost:${port}`;
const dbUri = 'mongodb://<connection-string>';

const runningExperiments = new Map(); // {experimentId: string -- shouldContinue: boolean}
const dosingPromises = new Map(); // {experimentId: string -- {resolve: function, timerId: SetTimer} }


/* AUXILLIARY FUNCTIONS */
const runProcedure = async (experimentId, deviceIp, procedure) => {
  experimentSetRunning(experimentId, true);
  const instructions = JSON.parse(procedure.instructions);
  const deviceUrl = 'http://' + deviceIp;
  let currentIndex = 0;
  for (const instruction of instructions) {
    if (!runningExperiments.get(experimentId)) {
      await instructionRelaySwitch(experimentId, deviceUrl, '26', 'off');
      await instructionRelaySwitch(experimentId, deviceUrl, '4', 'off');
      break;
    }

    Experiment.updateOne({ _id: experimentId }, { currentInstructionIndex: currentIndex, currentInstructionStart: Date.now() })
      .then(() => {
        console.log(experimentId, '|', currentIndex++, instruction);
      });
    switch (instruction.type) {
      case 'measurementCycle':
        await instructionMeasurementCycle(experimentId, deviceUrl, parseInt(instruction.delay), parseInt(instruction.duration));
        break;
      case 'relaySwitch':
        await instructionRelaySwitch(experimentId, deviceUrl, instruction.relayId, instruction.status);
        break;
      case 'relaySwitchManual':
        await instructionRelaySwitch(experimentId, deviceUrl, instruction.relayId, instruction.status);
        break;
      case 'pause':
        await instructionPause(parseInt(instruction.duration));
        break;
      case 'dosing':
        await instructionDosing(experimentId, 3600);
        break;
      default:
        console.log(`Unknown instruction type: ${instruction.type}`);
    }
  }
}
const instructionMeasurementCycle = async (experimentId, deviceIp, delay, duration) => {
  makeMeasurement(experimentId, deviceIp);
  return new Promise(resolve => {
    const interval = setInterval(() => {
      makeMeasurement(experimentId, deviceIp);
    }, delay * 1000);

    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, duration * 1000);
  });
}
const instructionPause = (duration) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration * 1000);
  });
}
const instructionDosing = (experimentId, maxDuration) => {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve();
    }, maxDuration * 1000);

    dosingPromises.set(experimentId, { resolve, timeoutId });
  });
};
const instructionRelaySwitch = async (experimentId, deviceIp, relayId, status) => {
  await axios.get(deviceIp + '/relays1?relay=' + relayId + '&&state=' + status)
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      console.error(`${experimentId} | Relay switch error ${err.message}`);
      return false;
    })
}
const makeMeasurement = async (experimentId, deviceIp) => {
  // request measurement data from device
  await axios.get(deviceIp + "/status")
    .then((response) => {
      const data = Object.assign({}, { deviceIp, experimentId }, response.data);
      console.log(data);
      // save data to db
      const measurement = new Measurement(data);
      measurement.save()
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.error(`${experimentId} | Measurement error ${err.message}`);
          return false;
        });
    })
    .catch((err) => {
      console.error(`${experimentId} | Device did not reply ${err.message}`);
      return false;
    });
  return true;
}
const experimentSetRunning = (experimentId, isRunning) => {
  const message = isRunning ? 'Experiment set to start.' : 'Experiment set to stop.';
  runningExperiments.set(experimentId, isRunning);
  console.log(`${experimentId} | ${message}`);
}

/* APP SETUP */
// allow cors
app.use(cors());
// use body parser for FormData
app.use(upload.array());
app.use(express.static('public'));
// compress text to optimize performance
app.use(compression());

// connect to db
mongoose.connect(dbUri)
  .then(() => {
    console.log('Connected to database');
    app.listen(port, () => console.log(listenUrl));
  })
  .catch((err) => {
    console.log(err.message);
  });


/* RESTful Services API */
/* DEVICES */
// add new device
app.post("/devices/new", async (req, res) => {
  const saveDevice = (body) => {
    const device = new Device(body);
    device.save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
  try {
    const body = req.body;

    if (!body.mac || body.mac == '') {
      const deviceUrl = 'http://' + body.ip;
      axios.get(deviceUrl + '/MAC')
        .then(resp => {
          body.mac = resp.data.MAC;
          console.log('Found MAC: ' + body.mac);
          saveDevice(body);
        })
        .catch(err => {
          console.error('MAC not found from IP ' + err.message);
          saveDevice(body);
        })
    } else {
      saveDevice(body);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update device
app.put("/devices/:deviceId", async (req, res) => {
  try {
    await Device.updateOne({ _id: req.params.deviceId }, req.body)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// delete device
app.delete("/devices/:deviceId", async (req, res) => {
  try {
    await Device.deleteOne({ _id: req.params.deviceId })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get all devices
app.get("/devices", async (_, res) => {
  Device.find()
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// get device by Id
app.get("/devices/:deviceId", async (req, res) => {
  Device.findById(req.params.deviceId)
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// get mac address from device IP
app.get("/devices/:deviceIp/mac", async (req, res) => {
  try {
    await axios.get(req.params.deviceIp + '/mac')
      .then((resp) => {
        res.status(200).send(resp.data);
      })

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* EXPERIMENTS */
// add new experiment
app.post("/experiments/new", async (req, res) => {
  try {
    const body = req.body;

    const experiment = new Experiment(body);
    experiment.save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// start experiment procedure
app.put("/experiments/:experimentId/start", async (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    await Procedure.findById(req.body.procedureId)
      .then((procedure) => {
        Experiment.updateOne({ _id: experimentId }, { startedAt: Date.now(), endedAt: '' })
          .then((result) => {
            runProcedure(experimentId, req.body.deviceIp, procedure)
              .then(() => {
                Experiment.updateOne({ _id: experimentId }, { endedAt: Date.now() })
                  .then(() => {
                    console.log(experimentId, '| Experiment finished.');
                  })
                  .catch((err) => {
                    console.error(`Error updating end time: ${err.message}`);
                  })
              })
              .catch((err) => {
                console.error(`Error executing instructions: ${err.message}`);
              })
            res.status(200).json({ result, experimentId });
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// stop experiment
app.put("/experiments/:experimentId/stop", (req, res) => {
  const experimentId = req.params.experimentId;
  experimentSetRunning(experimentId, false);
  res.status(200).json({ message: 'Experiment ' + experimentId + ' set to stop.' });
});
// finish the dosing istruction
app.put("/experiments/:experimentId/dosing/end", (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    if (dosingPromises.has(experimentId)) {
      const { resolve, timeoutId } = dosingPromises.get(experimentId);
      clearTimeout(timeoutId); // Clear the timeout
      resolve(); // Resolving the promise
      dosingPromises.delete(experimentId); // Clean up
      res.status(200).json({ message: 'Finished dosing for experiment ' + experimentId });
    }
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update experiment
app.put("/experiments/:experimentId", async (req, res) => {
  try {
    await Experiment.updateOne({ _id: req.params.experimentId }, req.body)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// delete experiment
app.delete("/experiments/:experimentId", async (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    await Experiment.deleteOne({ _id: experimentId })
      .then((result) => {
        Measurement.deleteMany({ experimentId: experimentId })
          .then((resMeasurements) => {
            res.status(200).json(result + '\n' + resMeasurements);
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get all experiments
app.get("/experiments", async (_, res) => {
  Experiment.find()
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// get experiments on a device
app.get("/devices/:deviceId/experiments", async (req, res) => {
  Experiment.find({ deviceId: req.params.deviceId })
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// get experiment with ID
app.get("/experiments/:experimentId", async (req, res) => {
  await Experiment.findById(req.params.experimentId)
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// calculate degradation speed result
app.put("/experiments/:experimentId/result", async (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    const body = req.body;

    const t0 = body.t0;
    const t1 = body.t1;

    // console.log(experimentId, dbody.t0);

    await Measurement.findOne({ experimentId: experimentId, createdAt: t0 })
      .then(async (measurement0) => {

        await Measurement.findOne({ experimentId: experimentId, createdAt: t1 })
          .then(async (measurement1) => {

            // console.log(measurement0, measurement1);
            const r0 = measurement0.rawVocTicks;
            const r1 = measurement1.rawVocTicks;

            const a = parseFloat(body.a);
            const b = parseFloat(body.b);

            const t0Value = new Date(t0).valueOf();
            const t1Value = new Date(t1).valueOf();

            // c = ar + b
            const c0 = a * r0 + b;
            const c1 = a * r1 + b;
            const deltaT = Math.abs(t0Value - t1Value) / 60000; // to minutes
            const deltaC = c0 - c1;
            const deltaR = r0 - r1;
            const resultC = deltaC / deltaT;
            const resultR = deltaR / deltaT;
            const degradationResult = { a, b, t0, t1, r0, r1, c0, c1, resultC, resultR };
            console.log(degradationResult);

            await Experiment.updateOne({ _id: experimentId }, { degradationResult: JSON.stringify(degradationResult) })
              .then(() => {
                res.status(200).json({ data: degradationResult });
              })
          })
      });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

/* MEASUREMENTS */
// add new measurement
app.post("/measurements/new", async (req, res) => {
  try {
    const deviceIp = req.body.deviceIp;
    // request measurement data from device
    const response = await axios.get(deviceIp + "/status")
    console.log(`Received data from ${deviceIp}`);

    const data = Object.assign({}, req.body, response.data);

    // save data to db and send it to API
    const measurement = new Measurement(data);
    measurement.save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get all measurements
app.get("/measurements", async (_, res) => {
  Measurement.find()
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// get measurements made during an experiment
app.get("/experiments/:experimentId/measurements", async (req, res) => {
  Measurement.find({ experimentId: req.params.experimentId })
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// get measurement with ID
app.get("/measurements/:measurementId", async (req, res) => {
  await Measurement.findById(req.params.measurementId)
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// remove one measurement
app.delete("/measurements/:measurementId", async (req, res) => {
  try {
    await Measurement.deleteOne({ _id: req.params.measurementId })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// wipe all measurements from db
app.delete("/measurements/deleteAll", async (req, res) => {
  try {
    await Measurement.deleteMany({})
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update measurement
app.put("/measurements/:measurementId", async (req, res) => {
  try {
    await Measurement.updateOne({ _id: req.params.measurementId }, req.body)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* PROCEDURES */
// add new procedure
app.post("/procedures/new", async (req, res) => {
  try {
    const body = req.body;

    const procedure = new Procedure(body);
    procedure.save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update procedure
app.put("/procedures/:procedureId", async (req, res) => {
  try {
    await Procedure.updateOne({ _id: req.params.procedureId }, req.body)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// delete procedure
app.delete("/procedures/:procedureId", async (req, res) => {
  try {
    await Procedure.deleteOne({ _id: req.params.procedureId })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get all procedures
app.get("/procedures", async (_, res) => {
  Procedure.find()
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});
// get procedure by id
app.get("/procedures/:procedureId", async (req, res) => {
  Procedure.findById(req.params.procedureId)
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    })
});

/* RELAYS */
// switch relay
app.post("/relays/switch", jsonParser, async (req, res) => {
  try {
    const body = req.body;
    await axios.get(body.deviceIp + '/relays1?relay=' + body.relayId + '&&state=' + body.state)
      .then((resp) => {
        res.status(200).send(resp.data);
      })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// temporarty resource
app.get("/relays/:id/:state", async (req, res) => {
  try {
    await axios.get(lumboxIp + '/relays1?relay=' + req.params.id + '&&state=' + req.params.state)
      .then((resp) => {
        console.log(resp.data);
        res.status(200).send(resp.data);
      })

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get relay status on device
app.get("devices/:deviceIp/relays/:relayId", async (req, res) => {
  try {
    await axios.get(req.params.deviceIp + '/relay/status?relay=' + req.params.relayId)
      .then((resp) => {
        console.log(resp.data);
        res.status(200).send({ data: resp.data });
      })

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* LUMBOX */
// lumbox sanity check
app.get("/lumbox", async (_, res) => {
  try {
    let response;
    await axios.get(lumboxIp)
      .then((resp) => {
        response = resp;
        console.log(response.data);
        res.status(200).send(response.data)
      })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
