import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import './App.css';


const App = () => {
  return (
    <StripeProvider apiKey="pk_test_2aTYM95z89mk47yuj78Es5sE">
      <div className="example">
        <h1>React Stripe Elements Example</h1>
        <Elements>
          <CheckoutForm />
        </Elements>
      </div>
    </StripeProvider>
  );
};

export default App;
