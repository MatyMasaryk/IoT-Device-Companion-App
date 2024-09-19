import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../../../constants/constants";
import InstructionList from "../../../components/InstructionList";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function AddProcedure() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const resource = '/procedures/new';
    const serverApi = serverUrl + resource;
    const [instructions, setInstructions] = useState([{}]);

    const addInstruction = () => {
        setInstructions([...instructions, {type: '', delay: '', duration: '', relayId: '', status: ''}]);
    };

    const updateInstruction = (index: number, updatedInstruction: any) => {
        const updatedInstructions = [...instructions];
        updatedInstructions[index] = updatedInstruction;
        setInstructions(updatedInstructions);
    };

    const deleteInstruction = (index: number) => {
        const updatedInstructions = [...instructions];
        updatedInstructions.splice(index, 1);
        setInstructions(updatedInstructions);
    };

    const swapInstruction = (index: number, targetIndex: number) => {
        if (targetIndex < 0 || targetIndex >= instructions.length) {
            return;
        }
        const updatedInstructions = [...instructions];
        const updatedInstruction = updatedInstructions[index];
        updatedInstructions[index] = updatedInstructions[targetIndex];
        updatedInstructions[targetIndex] = updatedInstruction;
        setInstructions(updatedInstructions);
    };

    const moveInstruction = (index: number, targetIndex: number) => {
        let targetIndexRound: number;
        if (targetIndex < 0) {
            targetIndexRound = 0;
        }
        else if (targetIndex >= instructions.length) {
            targetIndexRound = instructions.length - 1;
        } else {
            targetIndexRound = targetIndex;
        }
        const updatedInstructions = [...instructions];
        const updatedInstruction = updatedInstructions.splice(index, 1)[0];;
        updatedInstructions.splice(targetIndexRound, 0, updatedInstruction);
        setInstructions(updatedInstructions);
    };

    const add = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.append("instructions", JSON.stringify(instructions));

        const message = document.querySelector("#message")

        fetch(serverApi, {
            method: "POST",
            body: formData,
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            } else {
                if (message) {
                    message.innerHTML = "Created procedure successfuly."
                }
                navigate('/Procedures');
            }
        }).catch((err) => {
            if (message) {
                message.innerHTML = "Failed to create procedure."
            }
            console.log(err.message);
        });

    }

    return <div className="text-center d-flex flex-column align-items-center justify-content-center">
        <div className="d-flex flex-row align-items-center justify-content-between">
            <div className="me-2 p-2">
                <svg width="24" height="24" ></svg>
            </div>
            <h1>{t('new_procedure')}</h1>
            <Link to={"/Procedures/"} className="ms-2 p-2" aria-label={t('back')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
            </Link>
        </div>
        <form onSubmit={add} className="d-flex flex-column align-items-center w-100">
            <div className="form-group mt-4 w-25">
                <label htmlFor="deviceNameInput">{t('name')}*</label>
                <input type="text" className="form-control" name="name" id="deviceNameInput" placeholder={t('tooltip_name')} required maxLength={64} />
            </div>
            <div className="form-group mt-3 w-25">
                <label htmlFor="deviceDescriptionInput">{t('description')}</label>
                <input type="text" className="form-control" name="description" id="deviceDescriptionInput" placeholder={t('tooltip_description')} maxLength={128} />
            </div>

            <div className="form-group mt-3 w-75">
                <h4>{t('instructions')}</h4>
                <InstructionList items={instructions} addInstruction={addInstruction} updateInstruction={updateInstruction} swapInstruction={swapInstruction} moveInstruction={moveInstruction} deleteInstruction={deleteInstruction}/>
            </div>

            <p className="mt-3">
                <small id="message" className="text-danger">{t('warning_fill_fields')}</small>
            </p>
            <button type="submit" className="btn btn-primary mt-3 mb-2">{t('submit')}</button>
        </form>
    </div>
}

export default AddProcedure;