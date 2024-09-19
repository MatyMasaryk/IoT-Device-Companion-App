import { useTranslation } from "react-i18next";

function Home() {
    const { t } = useTranslation();

    return <div className="d-flex flex-column align-items-center">
        <h1>{t('home')}</h1>
        <h5>{t('home_welcome')}</h5>
        <p className="w-50 form-control">{t('lumbox_intro')}</p>
    </div>
}

export default Home;