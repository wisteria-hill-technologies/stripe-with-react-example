import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import './CheckoutForm.css';

class CheckoutForm extends Component {
  state = {
    disabled: false,
    complete: false
  };

  submit = async (ev) => {
    let {token} = await this.props.stripe.createToken({name: "Example guy"});
    if(token) {
      this.setState({
        disabled: true
      });
      let response = await fetch("/charge", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: token.id
      });

      if (response.ok) this.setState({complete: true, disabled: false });
    }
  };

  render() {
    if (this.state.complete) return <h1>Purchase Complete</h1>;

    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        {
          this.state.disabled
          ? <p>Processing ... </p>
          : <button onClick={this.submit} disabled={this.state.disabled}>Send</button>
        }
      </div>
  );
  }
}

export default injectStripe(CheckoutForm);