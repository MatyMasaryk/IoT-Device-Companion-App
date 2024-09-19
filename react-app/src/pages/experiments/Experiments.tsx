import ReceiveData from "../../components/ReceiveData";
import { useTranslation } from "react-i18next";
import ExperimentList from "../../components/ExperimentList";

const resource = '/experiments';

function Experiments() {
    const { t } = useTranslation();

    let experiments = ReceiveData(resource);

    return <div className="text-center d-flex flex-column justify-content-center align-items-center vw-100">
        <h1>{t('experiments')}</h1>
        <ExperimentList items={experiments}/>
    </div>
}

export default Experiments;