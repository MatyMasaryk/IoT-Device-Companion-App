import { Link, useLocation, useNavigate } from "react-router-dom";
import ExperimentHistory from "../../../components/ExperimentHistory";
import ReceiveData from "../../../components/ReceiveData";
import { serverUrl } from "../../../constants/constants";
import axios from "axios";
import { useTranslation } from "react-i18next";

function DeviceHome() {
    const { t } = useTranslation();

    const { state } = useLocation();
    const device = state.device;

    const navigate = useNavigate();

    const experimentsResource = '/devices/' + device._id + '/experiments'
    let experiments = ReceiveData(experimentsResource);

    const returnPath = "/Devices/" + device.name;

    return <div className="text-center d-flex flex-column align-items-center">
        <div className="d-flex flex-row align-items-center justify-content-between">
            <div className="me-2 p-2">
                <svg width="24" height="24" ></svg>
            </div>
            <h1>{device.name}</h1>
            <Link to={"/Devices/"} className="ms-2 p-2" aria-label={t('back')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
            </Link>
        </div>
        <div className="d-flex flex-row justify-content-center align-items-center" style={{ width: '7rem' }}>
            <Link to={"/Devices/" + device.name + "/Edit"} state={{ returnPath, device }} className="m-auto p-2" aria-label={t('edit')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg>
            </Link>
            <div className="link-primary p-2" onClick={() => {
                if (window.confirm(t('warning_delete') + ' "' + device.name + '"?')) {
                    const deleteResource = '/devices/' + device._id;
                    const deteleServerApi = serverUrl + deleteResource;
                    axios.delete(deteleServerApi)
                        .then(() => {
                            navigate('/Devices');
                        });

                }
            }} style={{ cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                </svg>
            </div>
        </div>

        <span className="mt-2 mb-2">{device.description}</span>
        <span><b>{t('mac')}:</b> {device.mac}</span>
        <span><b>{t('ip')}:</b> {device.ip}</span>

        <h3 className="mt-4">{t('experiments')}</h3>
        <button type="button" className="btn btn-primary vw-10 mb-4">
            <Link className="text-reset text-decoration-none" to={"/Devices/" + device.name + "/Experiments/New"} state={{ device }}>{t('new_experiment')}</Link>
        </button>
        <ExperimentHistory items={experiments} />

    </div>
}
export default DeviceHome;