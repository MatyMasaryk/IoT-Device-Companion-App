import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  items: any[];
  addInstruction: () => void; // Function to add a new instruction
  updateInstruction: (index: number, updatedInstruction: any) => void; // Function to update an instruction
  swapInstruction: (index: number, targetIndex: number) => void;
  moveInstruction: (index: number, targetIndex: number) => void;
  deleteInstruction: (index: number) => void;
}

function InstructionList(props: Props) {
  const { t } = useTranslation();
  const { items, addInstruction, updateInstruction, swapInstruction, moveInstruction, deleteInstruction } = props;
  const [isMoving, setIsMoving] = useState([false]);
  const [moveIndex, setMoveIndex] = useState([NaN]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    updateInstruction(index, { type: e.target.value, delay: '', duration: '', relayId: '', status: '', volume: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, index: number) => {
    const updatedInstruction = { ...items[index], [fieldName]: e.target.value };
    updateInstruction(index, updatedInstruction);
  };

  const handleStatusSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, fieldName: string, index: number) => {
    const updatedInstruction = { ...items[index], [fieldName]: e.target.value };
    updateInstruction(index, updatedInstruction);
  };

  const handleSwapClick = (index: number, targetIndex: number) => {
    swapInstruction(index, targetIndex);
  };

  const handleDeleteClick = (index: number) => {
    deleteInstruction(index);
  };

  const setTargetIndex = (index: number, targetIndex: number) => {
    const updatedArray: number[] = [...moveIndex];
    updatedArray[index] = targetIndex;
    setMoveIndex(updatedArray);
  };

  const confirmMoveInstruction = (index: number) => {
    if (!Number.isNaN(moveIndex[index]) && moveIndex[index] != undefined) {
      moveInstruction(index, moveIndex[index]);
    }
    updateIsMoving(index, false);
    setTargetIndex(index, NaN);
  };

  const updateIsMoving = (index: number, val: boolean) => {
    const updatedArray: boolean[] = [...isMoving];
    updatedArray[index] = val;
    setIsMoving(updatedArray);
  };

  return (
    <div className="list-group d-flex flex-column align-items-center">
      {items.map((instruction: any, index: number) => (
        <div className="input-group form-control d-flex align-items-center justify-content-between" key={index}>

          <div className="d-flex align-items-center">
            {!isMoving[index] && (
              <input
                onClick={() => updateIsMoving(index, true)}
                type="text"
                className="form-control me-1"
                name="indexReadonly"
                id={"indexReadonlyInput" + index}
                value={index}
                style={{ maxWidth: '3rem', cursor: 'pointer' }}
                readOnly
              />
            )}
            {isMoving[index] && (
              <>
                <input
                  type="number"
                  min={0}
                  className="form-control me-1"
                  name="index"
                  id={"indexInput" + index}
                  defaultValue={index}
                  style={{ maxWidth: '4rem' }}
                  onChange={(e) => setTargetIndex(index, parseInt(e.target.value))}
                  required
                />

                <div className="link-primary" onClick={() => confirmMoveInstruction(index)} style={{ cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                  </svg>
                </div>
              </>
            )}
          </div>

          <select
            className="form-select"
            name="type"
            value={instruction.type}
            onChange={(e) => handleSelectChange(e, index)}
            style={{ maxWidth: '11rem', width: '11rem' }}
            required
          >
            <option value="">{t('select_instruction')}</option>
            <option value="measurementCycle">{t('measurement')}</option>
            <option value="relaySwitch">{t('relay_switch')}</option>
            <option value="relaySwitchManual">{t('relay_switch_manual')}</option>
            <option value="dosing">{t('dosing')}</option>
            <option value="pause">{t('pause')}</option>
          </select>

          {instruction.type === 'measurementCycle' && (
            <div className="d-flex align-items-center">
              <label htmlFor={"durationInput" + index} style={{ width: '5rem' }}>{t('duration')}:</label>
              <input
                type="number"
                min={1}
                className="form-control ms-1"
                name="duration"
                id={"durationInput" + index}
                value={instruction.duration}
                style={{ maxWidth: '11rem' }}
                onChange={(e) => handleInputChange(e, 'duration', index)}
                placeholder={t('tooltip_seconds')}
                required
              />
              <label htmlFor={"delayInput" + index} style={{ width: '5rem' }}>{t('delay')}:</label>
              <input
                type="number"
                min={1}
                className="form-control ms-1"
                name="delay"
                id={"delayInput" + index}
                value={instruction.delay}
                style={{ maxWidth: '11rem' }}
                onChange={(e) => handleInputChange(e, 'delay', index)}
                placeholder={t('tooltip_seconds')}
                required
              />
            </div>
          )}

          {instruction.type === 'relaySwitch' && (
            <div className="d-flex align-items-center">
              <label htmlFor={"relayIdInput" + index} style={{ width: '5rem' }}>{t('relay_id')}:</label>
              <select
                className="form-select"
                name="relayId"
                id={"relayIdInput" + index}
                value={instruction.relayId}
                onChange={(e) => handleStatusSelectChange(e, 'relayId', index)}
                style={{ maxWidth: '11rem', width: '11rem' }}
                required
              >
                <option value="">{t('select_action')}</option>
                <option value="4">{t('relay_4')}</option>
                <option value="26">{t('relay_26')}</option>
              </select>
              <label htmlFor={"statusInput" + index} style={{ width: '5rem' }}>{t('status')}:</label>
              <select
                className="form-select ms-1"
                name="status"
                id={"statusInput" + index}
                value={instruction.status}
                onChange={(e) => handleStatusSelectChange(e, 'status', index)}
                style={{ maxWidth: '11rem', width: '11rem' }}
                required
              >
                <option value="">{t('select_status')}</option>
                <option value="on">{t('on')}</option>
                <option value="off">{t('off')}</option>
              </select>
            </div>
          )}

          {instruction.type === 'relaySwitchManual' && (
            <div className="d-flex align-items-center">
              <label htmlFor={"relayIdInputManual" + index} style={{ width: '5rem' }}>{t('pin_id')}:</label>
              <input
                type="string"
                className="form-control ms-2"
                name="relayId"
                id={"relayIdInputManual" + index}
                value={instruction.relayId}
                style={{ maxWidth: '11rem' }}
                onChange={(e) => handleInputChange(e, 'relayId', index)}
                placeholder={t('tooltip_pin_id')}
                required
              />
              <label htmlFor={"statusInputManual" + index} style={{ width: '5rem' }}>{t('status')}:</label>
              <select
                className="form-select ms-1"
                name="status"
                id={"statusInputManual" + index}
                value={instruction.status}
                onChange={(e) => handleStatusSelectChange(e, 'status', index)}
                style={{ maxWidth: '11rem', width: '11rem' }}
                required
              >
                <option value="">{t('select_status')}</option>
                <option value="on">{t('on')}</option>
                <option value="off">{t('off')}</option>
              </select>
            </div>
          )}

          {instruction.type === 'pause' && (
            <div className="d-flex align-items-center">
              <label htmlFor={"durationInput" + index} style={{ width: '5rem' }}>{t('duration')}:</label>
              <input
                type="number"
                min={1}
                className="form-control ms-1"
                name="duration"
                id={"durationInput" + index}
                value={instruction.duration}
                style={{ maxWidth: '11rem', width: '11rem' }}
                onChange={(e) => handleInputChange(e, 'duration', index)}
                placeholder={t('tooltip_seconds')}
                required
              />
              <div style={{ width: '5rem' }}></div>
              <div className="ms-1" style={{ maxWidth: '11rem', width: '11rem', height: '1.5rem' }}></div>
            </div>
          )}

          {instruction.type === 'dosing' && (
            <div className="d-flex align-items-center">
              <label htmlFor={"volumeInput" + index} style={{ width: '5rem' }}>{t('volume')}:</label>
              <input
                type="text"
                maxLength={17}
                className="form-control ms-1"
                name="volume"
                id={"volumeInput" + index}
                value={instruction.volume}
                style={{ maxWidth: '11rem', width: '11rem' }}
                onChange={(e) => handleInputChange(e, 'volume', index)}
                placeholder={t('tooltip_optional')}
              />
              <div style={{ width: '5rem' }}></div>
              <div className="ms-1" style={{ maxWidth: '11rem', width: '11rem', height: '1.5rem' }}></div>
            </div>
          )}

          <div className="d-flex align-items-center">
            <div className="link-primary p-1" onClick={() => handleSwapClick(index, index - 1)} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5" />
              </svg>
            </div>
            <div className="link-primary p-1" onClick={() => handleSwapClick(index, index + 1)} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
              </svg>
            </div>
            <div className="link-primary p-1" onClick={() => handleDeleteClick(index)} style={{ cursor: "pointer" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </div>
          </div>

        </div>
      ))}
      <div className="link-primary mt-3" style={{ cursor: "pointer" }} onClick={addInstruction}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
      </div>
    </div>
  );
}

export default InstructionList;
