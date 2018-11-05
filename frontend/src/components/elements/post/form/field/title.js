import React from 'react';

import { Label } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

export default class PostFormFieldTitle extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        values: {}
      };
      this.handleFuel = this.handleFuel.bind(this);
      this.isChecked = this.isChecked.bind(this);
    }
    handleFuel(name, event){
      let checkbox = event.target.checked;
      //let nValues = _.clone(this.state.values);
     // nValues.type = name;
       var active = checkbox;
      this.setState({ values: active });
    }
isChecked(){
return this.state.values;
}


   

  render() {
    const { value } = this.props
    return (
      <Form.Field>
        <Form.Input
          name="title"
          label="Post Title"
          required
          defaultValue={value}
          placeholder='What should this post be titled?'
          validationErrors={{
            isDefaultRequiredValue: 'A title is required'
          }}
          errorLabel={<Label color="red" pointing/>}
        />
      
        <Form.Input
          name="evergreen"
        type="hidden"  
	label=""
                                onChange={(event) => this.handleFuel(name, event)}
                      checked={this.isChecked()}

          
          placeholder='Should this post be re-posted every 7 days?'
          
          errorLabel={<Label color="red" pointing/>}
        />
      </Form.Field>
    )
  }
}
