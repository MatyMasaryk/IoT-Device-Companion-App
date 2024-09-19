import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  device: any;
  experiment: any;
  path: string;
  procedure?: any;
}

function ExperimentNavTabs(props: Props) {
  const { t } = useTranslation();
  const { device, experiment, procedure, path } = props;
  const pathBase = '/Devices/' + device.name + '/Experiments/' + experiment.name;

    return <ul className="nav nav-tabs">
    <li className="nav-item">
      <Link to={pathBase + '/Manage'} state={{device, experiment, procedure}} className={"nav-link " + (path == '/Manage' ? 'active' : '')}>{t('manage')}</Link>
    </li>
    <li className="nav-item">
      <Link to={pathBase + '/Procedure'} state={{device, experiment, procedure}} className={"nav-link " + (path == '/Procedure' ? 'active' : '')}>{t('procedure')}</Link>
    </li>
    <li className="nav-item">
      <Link to={pathBase + '/Graph'} state={{device, experiment, procedure}} className={"nav-link " + (path == '/Graph' ? 'active' : '')}>{t('graph')}</Link>
    </li>
    <li className="nav-item">
      <Link to={pathBase + '/Measurements'} state={{device, experiment, procedure}} className={"nav-link " + (path == '/Measurements' ? 'active' : '')}>{t('table')}</Link>
    </li>
  </ul>
}

export default ExperimentNavTabs;