import React, { useState }from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import './CheckoutForm.css';

const CheckoutForm = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [complete, setComplete] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const {token} = await props.stripe.createToken({name: "Mike Cardman"});
    if (token) {
      const response = await fetch("/charge", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: token.id
      });
      console.log('response>>>>', response);
      if (response.ok) {
        console.log("Purchase Complete!");
        setComplete(true);
      } else {
        setErrorMessage('Payment failed');
      }
    }
    setDisabled(false);
  };

  if (complete) return <p>Purchase Complete</p>;

  return (
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <CardElement />
      {
        errorMessage && (
          <p>{errorMessage}</p>
        )
      }
      {
        disabled
          ? <p>Processing ... </p>
          : <button onClick={onSubmit} disabled={disabled}>Send</button>
      }
    </div>
  );
};


export default injectStripe(CheckoutForm);
