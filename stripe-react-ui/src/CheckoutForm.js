import React, { useState }from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import './CheckoutForm.css';

const CheckoutForm = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [complete, setComplete] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const {token} = await props.stripe.createToken({name: "Example guy"});
    if (token) {
      setDisabled(true);
      const response = await fetch("/charge", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: token.id
      });
      if (response.ok) {
        console.log("Purchase Complete!");
        setComplete(true);
        setDisabled(true);
      }
    }
  };

  if (complete) return <h1>Purchase Complete</h1>;

  return (
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <CardElement />
      {
        disabled
          ? <p>Processing ... </p>
          : <button onClick={onSubmit} disabled={disabled}>Send</button>
      }
    </div>
  );
};


export default injectStripe(CheckoutForm);
