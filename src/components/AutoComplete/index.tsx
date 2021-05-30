import React, { forwardRef, memo } from 'react';
import Autocomplete, { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';

type Params = {
  value: any;
  onChange: (value: any) => void;
  options: any[];
  style?: any;
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
}

const AutoComplete = forwardRef(({ value, onChange, options, style, renderInput, ...rest }: Params, ref) => {
  return (
    <Autocomplete
      ref={ref}
      value={value}
      onChange={(event, value) => onChange(value)} // It will only be fired when an Item is selected. So, it's not necessary to use debounce
      options={options}
      getOptionSelected={(option, value) => option.title === value.title}
      getOptionLabel={(option: any) => option.title}
      style={style}
      renderInput={renderInput}
      {...rest}
    />
  )
})

export default memo(AutoComplete);