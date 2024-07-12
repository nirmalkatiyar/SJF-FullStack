import React from 'react';
import { InputTextProps } from '../types/types';
import { FormField, FormGroup, FormLabel } from '../skins';

const InputText = (props : InputTextProps) => {
  const {value, fieldType, onChange} = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <FormGroup onClick={()=>inputRef.current?.focus()}>
        <FormField ref={inputRef} type="input" className="form__field" value={value} placeholder={fieldType} onChange={(e)=>onChange(e.target.value)}/>
        <FormLabel htmlFor={fieldType} className="form__label">{fieldType}</FormLabel>
      </FormGroup>
    </>
  );
};

export default InputText;
