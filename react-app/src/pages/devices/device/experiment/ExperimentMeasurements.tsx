import { Link, useLocation } from "react-router-dom";
import ExperimentTable from "../../../../components/ExperimentTable";
import ExperimentNavTabs from "../../../../components/ExperimentNavTabs";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";
import { serverUrl } from "../../../../constants/constants";
import dayjs from "dayjs";
import axios from "axios";

function ExperimentMeasurements() {
    const { t } = useTranslation();
    const { state } = useLocation();
    const device = state.device;
    const experiment = state.experiment;
    const procedure = state.procedure;

    const [selectedT0, setSelectedT0] = useState('');
    const [selectedT1, setSelectedT1] = useState('');

    const [liveMeasurements, setLiveMeasurements]: any = useState([]);
    const serverApi = serverUrl + '/experiments/' + experiment._id + '/measurements';
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(serverApi);
            const jsonResult = await result.json();

            setLiveMeasurements(jsonResult.data);
        }
        fetchData();
    }, [liveMeasurements]);

    const [liveExperiment, setLiveExperiment]: any = useState({});
    const experimentApi = serverUrl + '/experiments/' + experiment._id;
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(experimentApi);
            const jsonResult = await result.json();

            setLiveExperiment(jsonResult.data);
        }
        fetchData();
    }, [liveExperiment]);

    const tableRef: MutableRefObject<null> = useRef(null);

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "LumBox_Experiment_" + experiment._id + "_" + t('measurements'),
        sheet: t('measurements')
    })

    const calculate = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const api = serverUrl + '/experiments/' + experiment._id + '/result';

        axios.put(api, formData)
            .catch((err) => {
                console.log(err.message);
            });

    };

    const [selectFirst, setSelectFirst] = useState(true);
    const selectTime = (newTime: string) => {
        if (selectFirst) {
            setSelectedT0(newTime);
            setSelectFirst(false);
        }
        else {
            setSelectedT1(newTime);
            setSelectFirst(true);
        }
    }

    return <div className="text-center d-flex flex-column align-items-center mb-3">
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

        <ExperimentNavTabs device={device} experiment={experiment} procedure={procedure} path="/Measurements" />

        <div className="mt-3 d-flex flex-column align-items-center">
            <div className="d-flex">
                <h5>{t('measurements_table')}</h5>
                <div className="link-primary ms-2" style={{ cursor: 'pointer' }} onClick={onDownload}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-down" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z" />
                        <path fillRule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z" />
                    </svg>
                </div>
            </div>

            <ExperimentTable items={liveMeasurements} tableRef={tableRef} selectTime={selectTime} />
        </div>

        <div className="mt-3 d-flex flex-column align-items-center">

            <h5 className="mt-1">{t('calculation')}</h5>
            <form className="form-control d-flex flex-column align-items-center w-auto p-3" onSubmit={calculate}>
                <div className="d-flex align-items-center input-group form-control">
                    <label className="me-2" htmlFor={"aInput"}><b>k:</b></label>
                    <input
                        type="number"
                        step={0.0000001}
                        className="form-control me-4"
                        name="a"
                        id={"aInput"}
                        style={{ width: '7.8rem' }}
                        placeholder={t('tooltip_constant')}
                        required
                    />
                    <label className="me-2" htmlFor={"bInput"}><b>q:</b></label>
                    <input
                        type="number"
                        step={0.0000001}
                        className="form-control me-4"
                        name="b"
                        id={"bInput"}
                        style={{ width: '7.8rem' }}
                        placeholder={t('tooltip_constant')}
                        required
                    />
                    <span className="me-2"><b>t<sub>0</sub>:</b></span>
                    <span className="form-control me-4" style={{ width: '11rem' }}>{selectedT0 ? dayjs(selectedT0).format('YYYY-MM-DD HH:mm:ss') : t('tooltip_click_time')}</span>
                    <input
                        type="text"
                        step={1}
                        className=""
                        name={"t0"}
                        id={"t0Input"}
                        value={selectedT0}
                        required
                        readOnly
                        style={{ opacity: 0, width: 0, float: 'left' }}
                    />
                    <span className="me-2"><b>t<sub>1</sub>:</b></span>
                    <span className="form-control" style={{ width: '11rem' }}>{selectedT1 ? dayjs(selectedT1).format('YYYY-MM-DD HH:mm:ss') : t('tooltip_click_time')}</span>
                    <input
                        type="text"
                        step={1}
                        className=""
                        name="t1"
                        id={"t1Input"}
                        value={selectedT1}
                        required
                        readOnly
                        style={{ opacity: 0, width: 0, float: 'left' }}
                    />

                    <button type="submit" className="btn btn-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-calculator-fill" viewBox="0 0 16 16">
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5m0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5z" />
                        </svg>
                    </button>

                </div>

                {liveExperiment?.degradationResult && (
                    <>
                        <div className="mt-3 mb-2 ms-2 me-2">
                            <span className="me-2"><b>k:</b>  {JSON.parse(liveExperiment.degradationResult).a},</span>
                            <span className="me-2"><b>q:</b>  {JSON.parse(liveExperiment.degradationResult).b},</span>
                            <span className="me-2"><b>t<sub>0</sub>:</b>  {dayjs(JSON.parse(liveExperiment.degradationResult).t0).format('HH:mm:ss')},</span>
                            <span className="me-2"><b>t<sub>1</sub>:</b>  {dayjs(JSON.parse(liveExperiment.degradationResult).t1).format('HH:mm:ss')},</span>
                            <span className="me-2"><b>{t('raw_voc')}<sub>0</sub>:</b>  {JSON.parse(liveExperiment.degradationResult).r0},</span>
                            <span><b>{t('raw_voc')}<sub>1</sub>:</b>  {JSON.parse(liveExperiment.degradationResult).r1}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
                        </svg>
                        <div className="mt-3">
                            <span className="me-3"><b>C<sub>0</sub>:</b>  {JSON.parse(liveExperiment.degradationResult).c0.toFixed(2)} ppm</span>
                            <span className="me-3"><b>C<sub>1</sub>:</b>  {JSON.parse(liveExperiment.degradationResult).c1.toFixed(2)} ppm</span>
                            <span><b>{t('degradation_speed')}</b>:  {JSON.parse(liveExperiment.degradationResult).resultC.toFixed(2)} ppm/min</span>
                        </div>
                    </>
                )}
            </form>

        </div>

    </div>
}
export default ExperimentMeasurements;