import React, { useEffect, useState }from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import './CheckoutForm.css';

const CheckoutForm = (props) => {
  useEffect(() => {
    fetch("/start-payment")
      .then(res => res.json())
      .then(result => {
        console.log('result>>>', result);
        setClientSecret(result.client_secret);
      })
      .catch(err => {
        console.log('err!!>>>', err);
      })
  }, []);
  const [ cardElement, setCardElement ] = useState(null);
  const [ clientSecret, setClientSecret ] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [complete, setComplete] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const {paymentIntent, error} = await props.stripe.handleCardPayment(
      clientSecret, cardElement, {
        payment_method_data: {
          billing_details: {
            name: "John Tester",
            email: "test@test.com"
          }
        },
        receipt_email: "test@test.com"
      }
    );
    if (error) {
      // Display error.message in your UI.
      console.log('error!!!!!!!', error);
      setErrorMessage('Payment failed');
    } else {
      // The payment has succeeded. Display a success message.
      console.log("Purchase Complete!");
      console.log('paymentIntent!!!!>>', paymentIntent);
      setComplete(true);
    }
    setDisabled(false);
  };

  const handleReady = (element) => {
    setCardElement(element);
  };

  if (complete) return <p>Purchase Complete</p>;

  return (
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <CardElement
        onReady={handleReady}
      />
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
