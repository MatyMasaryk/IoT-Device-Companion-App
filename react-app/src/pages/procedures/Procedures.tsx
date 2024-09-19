import { Link } from "react-router-dom";
import ReceiveData from "../../components/ReceiveData";
import ProcedureList from "../../components/ProcedureList";
import { useTranslation } from "react-i18next";

const resource = '/procedures';

function Procedures() {
    const { t } = useTranslation();

    let procedures = ReceiveData(resource);

    return <div className="text-center d-flex flex-column justify-content-center align-items-center vw-100">
        <h1>{t('procedures')}</h1>
        <button type="button" className="btn btn-primary vw-10 mb-4">
            <Link className="text-reset text-decoration-none" to="/Procedures/New">{t('add_procedure')}</Link>
        </button>

        <ProcedureList items={procedures}/>

    </div>
}

export default Procedures;