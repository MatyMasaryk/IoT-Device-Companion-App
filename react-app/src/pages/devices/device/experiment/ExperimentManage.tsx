import { Link, useLocation, useNavigate } from "react-router-dom";
import { serverUrl } from "../../../../constants/constants";
import axios from "axios";
import ExperimentNavTabs from "../../../../components/ExperimentNavTabs";
import ReceiveData from "../../../../components/ReceiveData";
import ReceiveDataSingle from "../../../../components/ReceiveDataSingle";
import { useTranslation } from "react-i18next";

function ExperimentManage() {
    const { t } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const experiment = state.experiment;
    const device = state.device?._id ? state.device : ReceiveDataSingle('/devices/' + experiment.deviceId);

    const proceduresResource = '/Procedures';
    let procedures = [{ _id: '', name: '' }]
    procedures = ReceiveData(proceduresResource);

    const experimentResource = '/experiments/' + experiment._id;
    const serverApi = serverUrl + experimentResource;

    const procedureResource = '/procedures/' + experiment.procedureId;
    const liveProcedure = ReceiveDataSingle(procedureResource);

    const returnPath = "/Devices/" + device.name + "/Experiments/" + experiment.name + "/Manage";

    const setProcedure = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const message = document.querySelector("#message");

        fetch(serverApi, {
            method: "PUT",
            body: formData,
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            } else {
                if (message) {
                    message.innerHTML = "Changes saved sucessfully."
                }

                navigate('/Devices/' + device.name, { state: { device } });

            }
        }).catch((err) => {
            if (message) {
                message.innerHTML = "Failed to save changes."
            }
            console.log(err.message);
        });
    }

    return <div className="text-center d-flex flex-column align-items-center">
        <div className="d-flex flex-row align-items-center justify-content-between">
            <div className="me-2 p-2">
                <svg width="24" height="24" ></svg>
            </div>
            <h1>{experiment.name}</h1>
            <Link to={"/Devices/" + device.name} state={{ device }} className="ms-2 p-2" aria-label={t('back')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
            </Link>
        </div>

        <ExperimentNavTabs device={device} experiment={experiment} procedure={liveProcedure} path="/Manage" />

        <h5 className="mt-3">{t('manage_experiment')}</h5>

        <div className="d-flex flex-row justify-content-center align-items-center" style={{ width: '7rem' }}>
            <Link to={"/Devices/" + device.name + "/Experiments/" + experiment.name + "/Edit"} state={{ device, experiment, returnPath }} className="m-auto p-2" aria-label={t('edit')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg>
            </Link>
            <div className="link-primary p-2" onClick={() => {
                if (window.confirm(t('warning_delete') + ' "' + experiment.name + '"?')) {
                    const deleteResource = '/experiments/' + experiment._id;
                    const deteleServerApi = serverUrl + deleteResource;
                    axios.delete(deteleServerApi)
                        .then(() => {
                            window.location.reload();
                        });

                }
            }} style={{ cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                </svg>
            </div>
        </div>

        <h5 className="mt-3">{t('manage_procedure')}</h5>

        <form onSubmit={setProcedure}>
            <select
                className="form-select"
                name="procedureId"
                id="procedure_select"
                style={{ maxWidth: '11.5rem', width: '11.5rem' }}
                required>
                <option value="">{t('choose_procedure')}</option>
                {procedures.map(procedure =>
                    <option key={procedure._id} value={procedure._id}>{procedure.name}</option>
                )}
            </select>
            <button type="submit" className="btn btn-primary mt-3">{t('set_procedure')}</button>
        </form>

        <span className="mt-3">{t('selected_procedure')}: <b>{liveProcedure?.name}</b></span>

    </div>
}
export default ExperimentManage;