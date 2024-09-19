import "./App.css";

import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Devices from "./pages/devices/Devices";
import Settings from "./pages/settings/Settings";
import AddDevice from "./pages/devices/add-device/AddDevice";
import DeviceHome from "./pages/devices/device/DeviceHome";
import AddExperiment from "./pages/devices/device/add-experiment/AddExperiment";
import EditDevice from "./pages/devices/edit-device/EditDevice";
import EditExperiment from "./pages/devices/device/edit-experiment/EditExperiment";
import Procedures from "./pages/procedures/Procedures";
import AddProcedure from "./pages/procedures/add-procedure/AddProcedure";
import EditProcedure from "./pages/procedures/edit-procedure/EditProcedure";
import ExperimentManage from "./pages/devices/device/experiment/ExperimentManage";
import ExperimentGraph from "./pages/devices/device/experiment/ExperimentGraph";
import ExperimentMeasurements from "./pages/devices/device/experiment/ExperimentMeasurements";
import ExperimentProcedure from "./pages/devices/device/experiment/ExperimentProcedure";
import Experiments from "./pages/experiments/Experiments";

function App() {
  return <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/Devices" element={<Devices />} />
      <Route path="/Devices/New" element={<AddDevice />} />
      <Route path="/Devices/:deviceName" element={<DeviceHome />} />
      <Route path="/Devices/:deviceName/Edit" element={<EditDevice />} />
      <Route path="/Devices/:deviceName/Experiments/New" element={<AddExperiment />} />
      <Route path="/Devices/:deviceName/Experiments/:experimentName" element={<ExperimentManage />} />
      <Route path="/Devices/:deviceName/Experiments/:experimentName/Edit" element={<EditExperiment />} />

      <Route path="/Devices/:deviceName/Experiments/:experimentName/Manage" element={<ExperimentManage />} />
      <Route path="/Devices/:deviceName/Experiments/:experimentName/Procedure" element={<ExperimentProcedure />} />
      <Route path="/Devices/:deviceName/Experiments/:experimentName/Graph" element={<ExperimentGraph />} />
      <Route path="/Devices/:deviceName/Experiments/:experimentName/Measurements" element={<ExperimentMeasurements />} />

      <Route path="/Experiments" element={<Experiments />} />
      <Route path="/Experiments/:experimentName" element={<ExperimentManage />} />
      <Route path="/Experiments/:experimentName/Edit" element={<EditExperiment />} />

      <Route path="/Procedures" element={<Procedures />} />
      <Route path="/Procedures/New" element={<AddProcedure />} />
      <Route path="/Procedures/:procedureName/Edit" element={<EditProcedure />} />

      <Route path="/Settings" element={<Settings />} />
    </Routes>
  </>
}
export default App;
