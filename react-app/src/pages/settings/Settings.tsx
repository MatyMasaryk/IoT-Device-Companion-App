import { useTranslation } from "react-i18next";
import { serverUrl, setServerUrl } from "../../constants/constants";

function Settings() {
    const { t, i18n } = useTranslation();

    const onClickLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    const getFlagOpacity = (language: string): string => {
        return i18n.resolvedLanguage === language ? '100%' : '50%';
    };

    const changeAddress = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const entry = formData.get('address')?.toString();
        const newUrl = entry ? entry : '';
        setServerUrl(newUrl);
        localStorage.setItem('serverUrl', newUrl);
    };

    return <div className="text-center d-flex flex-column align-items-center">
        <h1>{t('settings')}</h1>
        <h5 className="mt-1">{t('change_language')}</h5>
        <div className="d-flex">
            <div style={{opacity: getFlagOpacity('sk'), cursor: 'pointer'}} onClick={() => onClickLanguage('sk')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><path fill="#204c9e" d="M1 11H31V21H1z"></path><path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#fff"></path><path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#db362f"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path><path d="M15.65,10.232s.178,1.784,.178,5.353c-.025,3.645-2.751,5.49-4.752,6.46-2.001-.97-4.726-2.815-4.752-6.46,0-3.569,.178-5.353,.178-5.353H15.65Z" fill="#db362f"></path><path d="M10.673,19.945v-4.462c-1.511,0-1.94,.134-2.392,.27,.042-.456,.042-.915,0-1.371,.452,.137,.881,.27,2.392,.27v-1.24c-.477,0-1.135,.019-1.892,.277,.043-.457,.043-.917,0-1.374,.757,.254,1.415,.274,1.892,.274,0-.359-.111-1.132-.251-1.772,.436,.039,.874,.039,1.31,0-.14,.639-.251,1.412-.251,1.772,.477,0,1.135-.019,1.892-.274-.043,.457-.043,.917,0,1.374-.757-.258-1.415-.277-1.892-.277v1.24c1.511,0,1.94-.134,2.392-.27-.042,.456-.042,.915,0,1.371-.452-.137-.881-.27-2.392-.27v4.462h-.808Z" fill="#fff"></path><path d="M15.65,10.232s.178,1.784,.178,5.353c-.025,3.645-2.751,5.49-4.752,6.46-2.001-.97-4.726-2.815-4.752-6.46,0-3.569,.178-5.353,.178-5.353H15.65Z" fill="none"></path><path d="M11.076,22.044c1.241-.602,2.761-1.542,3.742-3.038-.007-.014-.011-.031-.017-.045-.56-1.184-1.576-1.367-2.268-.409-.089-.209-.191-.399-.304-.565-.805-1.181-1.973-.929-2.609,.565-.287-.397-.645-.614-1.014-.614-.518,0-.973,.424-1.268,1.072,.982,1.494,2.499,2.432,3.739,3.034Z" fill="#204c9e"></path><path d="M11.076,22.235l-.075-.036c-1.348-.654-2.385-1.395-3.169-2.266-1.103-1.225-1.668-2.687-1.679-4.347,0-3.537,.177-5.353,.179-5.371l.015-.155H15.806l.015,.155c.002,.018,.179,1.834,.179,5.37-.012,1.661-.577,3.123-1.679,4.348-.785,.871-1.821,1.613-3.169,2.266l-.075,.036ZM6.66,10.404c-.041,.505-.164,2.246-.164,5.181,.011,1.572,.546,2.958,1.591,4.118,.74,.822,1.718,1.526,2.989,2.151,1.271-.625,2.249-1.329,2.989-2.151,1.045-1.16,1.58-2.546,1.591-4.119,0-2.934-.122-4.675-.164-5.18H6.66Z" fill="#fff"></path></svg>
            </div>
            <div style={{opacity: getFlagOpacity('en'), cursor: 'pointer'}} onClick={() => onClickLanguage('en')} className="ms-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
            </div>
        </div>
        <h5 className="mt-4">{t('server_address')}</h5>
        <form onSubmit={changeAddress} className="">
            <div className="form-group">
                <input defaultValue={serverUrl} type="text" className="form-control" name="address" id="addressInput" placeholder={t('tooltip_address')} required maxLength={64} />
            </div>
            <button type="submit" className="btn btn-primary mt-3">{t('change')}</button>
        </form>
 

    </div>
}

export default Settings;