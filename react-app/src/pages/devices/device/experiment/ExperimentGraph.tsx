import { Link, useLocation } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    Chart,
    ChartEvent,
    LegendItem,
    LegendElement,
    ChartTypeRegistry
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ExperimentNavTabs from "../../../../components/ExperimentNavTabs";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { serverUrl } from "../../../../constants/constants";


function ExperimentGraph() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Colors
    );

    const { t } = useTranslation();
    const { state } = useLocation();
    const device = state.device;
    const experiment = state.experiment;
    const procedure = state.procedure;

    dayjs.extend(duration);

    const chartRef: any = useRef<ChartJS>(null);

    const [liveMeasurements, setLiveMeasurements]: any = useState([]);
    const [liveExperiment, setLiveExperiment]: any = useState({});

    const serverApi = serverUrl + '/experiments/' + experiment._id + '/measurements';
    const serverApiExp = serverUrl + '/experiments/' + experiment._id;
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(serverApi);
            const jsonResult = await result.json();
            setLiveMeasurements(jsonResult.data);

            const resultExp = await fetch(serverApiExp);
            const jsonResultExp = await resultExp.json();
            setLiveExperiment(jsonResultExp.data);
        }
        fetchData();
    }, [liveMeasurements]);

    let chartLabels = liveMeasurements.map((data: any) => ((dayjs(data['createdAt'])).format('HH:mm:ss')));

    // map the live measurement data
    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: t('raw_voc'),
                data: liveMeasurements.map((data: any) => data['rawVocTicks']),
                yAxisID: 'y_raw_voc'
            },
            {
                label: t('raw_nox'),
                data: liveMeasurements.map((data: any) => data['rawNoxTicks']),
                hidden: true,
                yAxisID: 'y_raw_nox'
            },
            {
                label: t('humidity'),
                data: liveMeasurements.map((data: any) => data['humidity']),
                hidden: true,
                yAxisID: 'y_humidity'
            },
            {
                label: t('temperature'),
                data: liveMeasurements.map((data: any) => data['temperature']),
                hidden: true,
                yAxisID: 'y_temperature'
            },
            {
                label: t('voc'),
                data: liveMeasurements.map((data: any) => data['vocIndex']),
                hidden: true,
                yAxisID: 'y_voc'
            },
            {
                label: t('nox'),
                data: liveMeasurements.map((data: any) => data['noxIndex']),
                hidden: true,
                yAxisID: 'y_nox'
            }
        ]
    }

    const defaultLegendClickHandler: any = Chart.defaults.plugins.legend.onClick;

    let left = 1;
    let right = 0;

    const onClickLegend = function (e: ChartEvent, legendItem: LegendItem, legend: LegendElement<keyof ChartTypeRegistry>) {
        const chart = chartRef.current;

        defaultLegendClickHandler(e, legendItem, legend);
        const legendName = legendItem.text;

        const active = legendItem.hidden != undefined ? !legendItem.hidden : false;
        switch (legendName) {
            case t('raw_voc'):
                chartOptions.scales.y_raw_voc.display = active;
                if (active) {
                    if (left > right) {
                        chartOptions.scales.y_raw_voc.position = 'right';
                        right++;
                    } else {
                        chartOptions.scales.y_raw_voc.position = 'left';
                        left++;
                    }
                } else {
                    if (chartOptions.scales.y_raw_voc.position == 'left') {
                        left--;
                    } else {
                        right--;
                    }
                }
                break;
            case t('raw_nox'):
                chartOptions.scales.y_raw_nox.display = active;
                if (active) {
                    if (left > right) {
                        chartOptions.scales.y_raw_nox.position = 'right';
                        right++;
                    } else {
                        chartOptions.scales.y_raw_nox.position = 'left';
                        left++;
                    }
                } else {
                    if (chartOptions.scales.y_raw_nox.position == 'left') {
                        left--;
                    } else {
                        right--;
                    }
                }
                break;
            case t('humidity'):
                chartOptions.scales.y_humidity.display = active;
                if (active) {
                    if (left > right) {
                        chartOptions.scales.y_humidity.position = 'right';
                        right++;
                    } else {
                        chartOptions.scales.y_humidity.position = 'left';
                        left++;
                    }
                } else {
                    if (chartOptions.scales.y_humidity.position == 'left') {
                        left--;
                    } else {
                        right--;
                    }
                }
                break;
            case t('temperature'):
                chartOptions.scales.y_temperature.display = active;
                if (active) {
                    if (left > right) {
                        chartOptions.scales.y_temperature.position = 'right';
                        right++;
                    } else {
                        chartOptions.scales.y_temperature.position = 'left';
                        left++;
                    }
                } else {
                    if (chartOptions.scales.y_temperature.position == 'left') {
                        left--;
                    } else {
                        right--;
                    }
                }
                break;
            case t('voc'):
                chartOptions.scales.y_voc.display = active;
                if (active) {
                    if (left > right) {
                        chartOptions.scales.y_voc.position = 'right';
                        right++;
                    } else {
                        chartOptions.scales.y_voc.position = 'left';
                        left++;
                    }
                } else {
                    if (chartOptions.scales.y_voc.position == 'left') {
                        left--;
                    } else {
                        right--;
                    }
                }
                break;
            case t('nox'):
                chartOptions.scales.y_nox.display = active;
                if (active) {
                    if (left > right) {
                        chartOptions.scales.y_nox.position = 'right';
                        right++;
                    } else {
                        chartOptions.scales.y_nox.position = 'left';
                        left++;
                    }
                } else {
                    if (chartOptions.scales.y_nox.position == 'left') {
                        left--;
                    } else {
                        right--;
                    }
                }
                break;
            default:
                break;
        }
        chart.options = chartOptions;
        chart.update()

    }

    let chartOptions = {
        plugins: {
            legend: {
                onClick: onClickLegend
            },
        },
        scales: {
            y_raw_voc: {
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: t('raw_voc')
                }
            },
            y_raw_nox: {
                display: false,
                position: 'left',
                title: {
                    display: true,
                    text: t('raw_nox')
                }
            },
            y_humidity: {
                display: false,
                position: 'left',
                title: {
                    display: true,
                    text: t('humidity')
                }
            },
            y_temperature: {
                display: false,
                position: 'left',
                title: {
                    display: true,
                    text: t('temperature')
                }
            },
            y_voc: {
                display: false,
                position: 'left',
                title: {
                    display: true,
                    text: t('voc')
                }
            },
            y_nox: {
                display: false,
                position: 'left',
                title: {
                    display: true,
                    text: t('nox')
                }
            },
        }
    };

    const [liveOptions]: any = useState(chartOptions);

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

        <ExperimentNavTabs device={device} experiment={experiment} procedure={procedure} path="/Graph" />

        <div className="mt-3" style={{ width: "65%" }}>
            <h5>{t('measurements_graph')}</h5>
            <Line data={chartData} options={liveOptions} ref={chartRef} />
        </div>

        <div>
            {liveExperiment.startedAt && !liveExperiment.endedAt && (
                <span>{t('elapsed')}: {dayjs.duration(dayjs().diff(dayjs(liveExperiment.startedAt))).format('HH:mm:ss')}</span>
            )}
            {liveExperiment.endedAt && (
                <span>{t('elapsed')}: {dayjs.duration(dayjs(liveExperiment.endedAt).diff(dayjs(liveExperiment.startedAt))).format('HH:mm:ss')}</span>
            )}
        </div>

    </div>
}
export default ExperimentGraph;