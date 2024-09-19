import dayjs from "dayjs";
import { MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    items: any[];
    tableRef: MutableRefObject<null>;
    selectTime: (newTime: string) => void;
}

function ExperimentTable(props: Props) {
    const { t } = useTranslation();
    let rowNum = 1;

    const { selectTime } = props;

    return <div className='table-responsive' style={{ height: '55vh', width: '65vw'}}>
    <table className="table table-bordered table-hover" ref={props.tableRef}>
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">{t('date')}</th>
                <th scope="col">{t('raw_voc')} <b style={{fontWeight: 'normal'}}>(Ticks)</b></th>
                <th scope="col">{t('raw_nox')} <b style={{fontWeight: 'normal'}}>(Ticks)</b></th>
                <th scope="col">{t('temperature')} <b style={{fontWeight: 'normal'}}>(°C)</b></th>
                <th scope="col">{t('humidity')} <b style={{fontWeight: 'normal'}}>(%)</b></th>
                <th scope="col">{t('voc')}</th>
                <th scope="col">{t('nox')}</th>
            </tr>
        </thead>
        <tbody>

            {props.items.map(measurement =>

                <tr key={measurement._id}>
                    <th scope="row">{rowNum++}</th>
                    <td onClick={() => selectTime(measurement.createdAt)} style={{cursor: 'pointer'}} className="link-primary">{dayjs(measurement.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td>{measurement.rawVocTicks}</td>
                    <td>{measurement.rawNoxTicks}</td>
                    <td>{measurement.temperature}</td>
                    <td>{measurement.humidity}</td>
                    <td>{measurement.vocIndex}</td>
                    <td>{measurement.noxIndex}</td>
                </tr>

            )}
        </tbody>
    </table>
    </div>

}

export default ExperimentTable;