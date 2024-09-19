import { Link, useLocation } from "react-router-dom";
import ExperimentNavTabs from "../../../../components/ExperimentNavTabs";
import axios from "axios";
import { serverUrl } from "../../../../constants/constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function ExperimentProcedure() {
    const { t } = useTranslation();
    const { state } = useLocation();
    const device = state.device;
    const experiment = state.experiment;
    const procedure = state.procedure;
    const instructions = procedure ? JSON.parse(procedure.instructions) : [];

    dayjs.extend(duration);

    const [liveExperiment, setLiveExperiment]: any = useState({});

    const serverApi = serverUrl + '/experiments/' + experiment._id;
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(serverApi);
            const jsonResult = await result.json();

            setLiveExperiment(jsonResult.data);
        }
        fetchData();
    }, [liveExperiment]);

    const startProcedure = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const resource = '/experiments/' + experiment._id + '/start';
        const serverApi = serverUrl + resource;
        axios.put(serverApi, formData);
    }

    const stopProcedure = (e: any) => {
        e.preventDefault();
        const resource = '/experiments/' + experiment._id + '/stop';
        const serverApi = serverUrl + resource;
        axios.put(serverApi);
    }

    const finishDosing = () => {
        const resource = '/experiments/' + experiment._id + '/dosing/end';
        const serverApi = serverUrl + resource;
        axios.put(serverApi);
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

        <ExperimentNavTabs device={device} experiment={experiment} procedure={procedure} path="/Procedure" />

        <h5 className="mt-3">{t('procedure')}: <b>{procedure?.name}</b></h5>
        {procedure?._id && (
            <>
                <div className="d-flex">
                    <Link to={"/Procedures/" + procedure.name + "/Edit"} state={{ device, experiment, procedure }} className="m-auto p-2" aria-label={t('edit')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </Link>
                    <form onSubmit={startProcedure}>
                        <button type="submit" className="btn btn-primary ms-2" style={{ width: 'fit-content' }} >{t('start_procedure')}</button>
                        <input type="hidden" name="procedureId" value={procedure._id} />
                        <input type="hidden" name="deviceIp" value={device.ip} />
                    </form>
                    <form onSubmit={stopProcedure}>
                        <button type="submit" className="btn btn-primary ms-2" style={{ width: 'fit-content' }} >{t('stop_procedure')}</button>
                    </form>
                </div>

                <div className="d-flex flex-column align-items-center mb-3">
                    <h5 className="mt-3">{t('progress')}:</h5>
                    {liveExperiment.startedAt && (
                        <span>{t('started')}: {dayjs(liveExperiment.startedAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                    )}
                    
                    {liveExperiment.startedAt && !liveExperiment.endedAt && (
                        <span>{t('elapsed')}: {dayjs.duration(dayjs().diff(dayjs(liveExperiment.startedAt))).format('HH:mm:ss')}</span>
                    )}
                    {liveExperiment.endedAt && (
                        <span>{t('elapsed')}: {dayjs.duration(dayjs(liveExperiment.endedAt).diff(dayjs(liveExperiment.startedAt))).format('HH:mm:ss')}</span>
                    )}

                    {liveExperiment.endedAt && (
                        <span>{t('finished')}: {dayjs(liveExperiment.endedAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                    )}

                    {instructions.map((instruction: any, index: number) =>
                        <div className="input-group form-control d-flex align-items-center justify-content-between mt-3" key={index}>

                            {instruction.type === 'measurementCycle' && (
                                <div className="d-flex align-items-center">
                                    <span style={{ maxWidth: '3rem', width: '3rem' }} className="form-control">
                                        {index}
                                    </span>
                                    <span style={{ maxWidth: '11rem', width: '11rem' }}>
                                        {t('measurement')}
                                    </span>

                                    <label htmlFor={"durationInput" + index} style={{ width: '4rem' }}>{t('duration')}:</label>
                                    <input
                                        type="text"
                                        min={1}
                                        className="form-control ms-2 me-2"
                                        name="duration"
                                        id={"durationInput" + index}
                                        value={instruction.duration + 's'}
                                        style={{ maxWidth: '10rem' }}
                                        readOnly
                                    />
                                    <label htmlFor={"delayInput" + index} style={{ width: '4rem' }}>{t('delay')}:</label>
                                    <input
                                        type="text"
                                        min={5}
                                        className="form-control ms-2"
                                        name="delay"
                                        id={"delayInput" + index}
                                        value={instruction.delay + 's'}
                                        style={{ maxWidth: '10rem' }}
                                        readOnly
                                    />

                                    <div className="ms-1" style={{ maxWidth: '4rem', width: '4rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <span>{dayjs.duration(dayjs().diff(dayjs(liveExperiment.currentInstructionStart))).format('HH:mm:ss')}</span>
                                        )}
                                    </div>

                                    <div className="ms-1" style={{ color: 'limegreen', maxWidth: '1.5rem', width: '1.5rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            )}

                            {instruction.type === 'relaySwitch' && (
                                <div className="d-flex align-items-center">
                                    <span style={{ maxWidth: '3rem', width: '3rem' }} className="form-control">
                                        {index}
                                    </span>
                                    <span style={{ maxWidth: '11rem', width: '11rem' }}>
                                        {t('relay_switch')}
                                    </span>

                                    <label htmlFor={"relayIdInput" + index} style={{ width: '4rem' }}>{t('relay_id')}:</label>
                                    <input
                                        type="text"
                                        className="form-control ms-2 me-2"
                                        name="relayId"
                                        id={"relayIdInput" + index}
                                        value={t('relay_' + instruction.relayId)}
                                        style={{ maxWidth: '10rem', width: '10rem' }}
                                        readOnly
                                    />
                                    <label htmlFor={"statusInput" + index} style={{ width: '4rem' }}>{t('status')}:</label>
                                    <input
                                        type="text"
                                        className="form-control ms-2"
                                        name="status"
                                        id={"statusInput" + index}
                                        value={t(instruction.status)}
                                        style={{ maxWidth: '10rem', width: '10rem' }}
                                        readOnly
                                    />

                                    <div className="ms-1" style={{ maxWidth: '4rem', width: '4rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <span>{dayjs.duration(dayjs().diff(dayjs(liveExperiment.currentInstructionStart))).format('HH:mm:ss')}</span>
                                        )}
                                    </div>

                                    <div className="ms-1" style={{ color: 'limegreen', maxWidth: '1.5rem', width: '1.5rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            )}

                            {instruction.type === 'relaySwitchManual' && (
                                <div className="d-flex align-items-center">
                                    <span style={{ maxWidth: '3rem', width: '3rem' }} className="form-control">
                                        {index}
                                    </span>
                                    <span style={{ maxWidth: '11rem', width: '11rem' }}>
                                        {t('relay_switch_manual')}
                                    </span>

                                    <label htmlFor={"relayIdInput" + index} style={{ width: '4rem' }}>{t('pin_id')}:</label>
                                    <input
                                        type="text"
                                        className="form-control ms-2 me-2"
                                        name="relayId"
                                        id={"relayIdInput" + index}
                                        value={instruction.relayId}
                                        style={{ maxWidth: '10rem', width: '10rem' }}
                                        readOnly
                                    />
                                    <label htmlFor={"statusInput" + index} style={{ width: '4rem' }}>{t('status')}:</label>
                                    <input
                                        type="text"
                                        className="form-control ms-2"
                                        name="status"
                                        id={"statusInput" + index}
                                        value={t(instruction.status)}
                                        style={{ maxWidth: '10rem', width: '10rem' }}
                                        readOnly
                                    />

                                    <div className="ms-1" style={{ maxWidth: '4rem', width: '4rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <span>{dayjs.duration(dayjs().diff(dayjs(liveExperiment.currentInstructionStart))).format('HH:mm:ss')}</span>
                                        )}
                                    </div>

                                    <div className="ms-1" style={{ color: 'limegreen', maxWidth: '1.5rem', width: '1.5rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            )}

                            {instruction.type === 'pause' && (
                                <div className="d-flex align-items-center">
                                    <span style={{ maxWidth: '3rem', width: '3rem' }} className="form-control">
                                        {index}
                                    </span>
                                    <span style={{ maxWidth: '11rem', width: '11rem' }}>
                                        {t('pause')}
                                    </span>

                                    <label htmlFor={"durationInput" + index} style={{ width: '4rem' }}>{t('duration')}:</label>
                                    <input
                                        type="text"
                                        min={1}
                                        className="form-control ms-2 me-2"
                                        name="duration"
                                        id={"durationInput" + index}
                                        value={instruction.duration + 's'}
                                        style={{ maxWidth: '10rem', width: '10rem' }}
                                        readOnly
                                    />
                                    <div style={{ width: '4rem' }}></div>
                                    <div className="ms-2" style={{ maxWidth: '10rem', width: '10rem', height: '1.5rem' }}></div>

                                    <div className="ms-1" style={{ maxWidth: '4rem', width: '4rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <span>{dayjs.duration(dayjs().diff(dayjs(liveExperiment.currentInstructionStart))).format('HH:mm:ss')}</span>
                                        )}
                                    </div>

                                    <div className="ms-1" style={{ color: 'limegreen', maxWidth: '1.5rem', width: '1.5rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            )}
                            {instruction.type === 'dosing' && (
                                <div className="d-flex align-items-center">
                                    <span style={{ maxWidth: '3rem', width: '3rem' }} className="form-control">
                                        {index}
                                    </span>
                                    <span style={{ maxWidth: '11rem', width: '11rem' }}>
                                        {t('dosing')}
                                    </span>

                                    <label htmlFor={"volumeInput" + index} style={{ width: '4rem' }}>{t('volume')}:</label>
                                    <input
                                        type="text"
                                        className="form-control ms-2 me-2"
                                        name="volume"
                                        id={"volumeInput" + index}
                                        value={instruction.volume}
                                        style={{ maxWidth: '10rem', width: '10rem' }}
                                        placeholder={t('tooltip_optional')}
                                        readOnly
                                    />
                                    <div style={{ width: '4rem' }}>
                                        <span>
                                            {t('done')}:
                                        </span>
                                    </div>
                                    <div className="ms-2 " style={{ maxWidth: '10rem', width: '10rem' }}>
                                        {liveExperiment?.currentInstructionIndex == index && (
                                            <div className="link-primary" style={{ cursor: 'pointer', width: '3rem' }} onClick={() => finishDosing()}>
                                                <button type="button" className="btn btn-primary ms-2" style={{ width: 'fit-content' }} >{t('continue')}</button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ms-1" style={{ maxWidth: '4rem', width: '4rem', height: '1.5rem' }}>
                                        {liveExperiment.currentInstructionIndex == index && !liveExperiment.endedAt && (
                                            <span>{dayjs.duration(dayjs().diff(dayjs(liveExperiment.currentInstructionStart))).format('HH:mm:ss')}</span>
                                        )}
                                    </div>

                                    <div className="ms-1" style={{ color: 'limegreen', maxWidth: '1.5rem', width: '1.5rem', height: '1.5rem' }}>
                                        {liveExperiment?.currentInstructionIndex == index && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            )}


                        </div>
                    )}
                </div>
            </>
        )}
    </div>
}
export default ExperimentProcedure;