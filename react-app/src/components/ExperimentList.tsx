import axios from "axios";
import { Link } from "react-router-dom";
import { serverUrl } from "../constants/constants";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface Props {
    items: any[];
}

function ExperimentList(props: Props) {
    const { t } = useTranslation();

    const returnPath = "/Experiments";

    return <div className="list-group w-75">

        {props.items.map(experiment =>
            <div key={experiment._id} className="list-group-item list-group-item-action mb-2 border-top bg-light" aria-current="true">
                <input type="hidden"/>
                <div className="d-flex flex-row align-items-center">
                    <Link to={"/Experiments/" + experiment.name} state={{ experiment }} className="d-flex justify-content-start w-25 border-end">
                        <h6 className="mb-1 text-start">{experiment.name}</h6>
                    </Link>
                    <Link to={"/Experiments/" + experiment.name} state={{ experiment }} className="d-flex border-end p-2 text-decoration-none text-reset" style={{ width: '52%' }}>
                        <small className="mb-1">{experiment.description}</small>
                    </Link>
                    <Link to={"/Experiments/" + experiment.name} state={{ experiment }} className="d-flex border-end p-2 text-decoration-none text-reset text-end" style={{ width: '13%' }}>
                        <span>{dayjs(experiment.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                    </Link>
                    <div className="d-flex flex-row justify-content-center align-items-center" style={{ width: '7rem' }}>
                        <Link to={ "/Experiments/" + experiment.name + "/Edit"} state={{ returnPath, experiment }} className="m-auto p-2" aria-label={t('edit')}>
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
                </div>
            </div>
        )}
    </div>

}

export default ExperimentList;