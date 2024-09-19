import { Link, useLocation, useNavigate } from "react-router-dom";
import { serverUrl } from "../../../constants/constants";
import { useTranslation } from "react-i18next";

function EditDevice() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const device = state.device;
    const resource = '/devices/' + device._id;
    const serverApi = serverUrl + resource;

    const edit = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const message = document.querySelector("#message");

        // filter out empty form fields
        const filteredFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            if (value !== '') {
                filteredFormData.append(key, value);
            }
        }

        fetch(serverApi, {
            method: "PUT",
            body: filteredFormData,
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            } else {
                if (message) {
                    message.innerHTML = "Changes saved sucessfully."
                }
                navigate('/Devices');
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
            <h1>{t('edit') + ' ' + device.name}</h1>
            <Link to={state.returnPath} className="ms-2 p-2" state={{device}} aria-label={t('back')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
            </Link>
        </div>
        <form onSubmit={edit} className="w-25">
            <div className="form-group mt-4">
                <label htmlFor="deviceNameInput">{t('name')}</label>
                <input defaultValue={device.name} type="text" className="form-control" name="name" id="deviceNameInput" placeholder={t('tooltip_name')} maxLength={64} />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="deviceMacInput">{t('mac')}</label>
                <input defaultValue={device.mac} type="text" className="form-control" name="mac" id="deviceMacInput" placeholder={t('tooltip_mac')} maxLength={17} />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="deviceIpInput">{t('ip')}</label>
                <input defaultValue={device.ip} type="text" className="form-control" name="ip" id="deviceIpInput" placeholder={t('tooltip_ip')} maxLength={39} />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="deviceDescriptionInput">{t('description')}</label>
                <input defaultValue={device.description} type="text" className="form-control" name="description" id="deviceDescriptionInput" placeholder={t('tooltip_description')} maxLength={128} />
            </div>
            <p className="mt-3">
                <small id="message" className="text-danger">{t('warning_blank_fields')}</small>
            </p>
            <button type="submit" className="btn btn-primary mt-3">{t('submit')}</button>
        </form>
    </div>
}

export default EditDevice;