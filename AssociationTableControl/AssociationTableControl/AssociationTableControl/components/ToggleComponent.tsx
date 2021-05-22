import * as React from 'react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

interface IToggleProps {
    visible:boolean,
    onChangeResult: (selectedValues:any) => void;
    
  }

  export default class  ToogleControl extends React.Component<IToggleProps> {
    constructor(props:IToggleProps) {
        super(props);
        
     }
     render() { return (
        <Toggle
        label=""
        defaultChecked
        onText="Hide"
        offText="Show"
        onChange={(e, selectedOption) => {
            this.props.onChangeResult(selectedOption)
          }}  
        role="checkbox"
      />
    );
    }
}