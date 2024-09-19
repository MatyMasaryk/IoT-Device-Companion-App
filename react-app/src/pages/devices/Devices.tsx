import { Link } from "react-router-dom";
import DeviceList from "../../components/DeviceList";
import ReceiveData from "../../components/ReceiveData";
import { useTranslation } from "react-i18next";

const resource = '/devices';

function Devices() {
    const { t } = useTranslation();

    let devices = ReceiveData(resource);

    return <div className="text-center d-flex flex-column justify-content-center align-items-center vw-100">
        <h1>{t('devices')}</h1>
        <button type="button" className="btn btn-primary vw-10 mb-4">
            <Link className="text-reset text-decoration-none" to="/Devices/New">{t('add_device')}</Link>
        </button>

        <DeviceList items={devices}/>

    </div>
}

export default Devices;