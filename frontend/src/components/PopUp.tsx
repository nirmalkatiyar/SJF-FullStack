import InputText from "./Input";
import { PopUpProps } from "../types/types";
import { ButtonPopUp, CloseButton, FormContainer, FormPopupBg } from "../skins";

const PopUpForm = (props: PopUpProps) => {
  const { closeForm, onClickAddJob, headerText, onChangePrimaryField, onChangeSecondaryField, primaryField, secondaryField, primaryFieldValue, secondaryFieldValue, btnText} = props;
  return (
    <>
      <FormPopupBg>
        <FormContainer>
          <h1>{headerText}</h1>
          <CloseButton id="btnCloseForm" onClick={closeForm}>
            X
          </CloseButton>
          <div>
            <InputText
              value={primaryFieldValue}
              fieldType={primaryField}
              onChange={onChangePrimaryField}
            />
            {onChangeSecondaryField && (
              <InputText
                value={secondaryFieldValue!}
                fieldType={secondaryField!}
                onChange={onChangeSecondaryField}
              />
            )}
          </div>
          <ButtonPopUp onClick={onClickAddJob}>{btnText}</ButtonPopUp>
        </FormContainer>
      </FormPopupBg>
    </>
  );
};

export default PopUpForm;
