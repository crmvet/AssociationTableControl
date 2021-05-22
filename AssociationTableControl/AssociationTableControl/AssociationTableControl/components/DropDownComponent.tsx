import * as React from 'react';
import { Dropdown, IDropdownStyles, IDropdownOption  } from 'office-ui-fabric-react/lib/Dropdown';
import { ICalloutProps } from 'office-ui-fabric-react/lib/Callout';

interface IDropDownProps {
    label:string,
    placeholder:string,
    dropdownStyles: Partial<IDropdownStyles>,
    options : IDropdownOption [],
    defaultSelectedKeys?: string[] ;
    onChangeResult: (selectedValues:any) => void;
    calloutProps: Partial<ICalloutProps>
  }
  
  export default class  DropDownControl extends React.Component<IDropDownProps> {
    constructor(props:IDropDownProps) {
        super(props);
   debugger;     
     }
   
    render() { return (
      
        <Dropdown
        placeholder= {this.props.placeholder}
        label= {this.props.label}
        multiSelect
        options={this.props.options}
        defaultSelectedKeys={this.props.defaultSelectedKeys}
        styles={this.props.dropdownStyles}
        calloutProps={this.props.calloutProps } 
        onChange={(e, selectedOption) => {
          this.props.onChangeResult(selectedOption)
        }}  
      />
    );
    }

   
};