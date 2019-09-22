import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import CheckoutFormUpdate from './CheckoutFormUpdate';
import './App.css';


const App = () => {
  return (
    <StripeProvider apiKey="pk_test_2aTYM95z89mk47yuj78Es5sE">
      <div className="example">
        <h2>React Stripe Elements Example 1 - Old Way</h2>
        <Elements>
          <CheckoutForm />
        </Elements>
        <h2>React Stripe Elements Example 2 - New Way with PaymentIntent (SCA ready)</h2>
        <Elements>
          <CheckoutFormUpdate />
        </Elements>
      </div>
    </StripeProvider>
  );
};

export default App;
