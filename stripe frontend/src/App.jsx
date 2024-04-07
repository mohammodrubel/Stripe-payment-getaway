// App.js
import React from 'react';
import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51P1kt4F28zhW1wrko8P8Uqvs0Xcc6qaPxpt8RgFVfOwCAediCKlQdQ9kW7DhY20oupVF6CuDQs28NL2SrqN4anpP00gubJXodu');

function App() {
  const price = 20
  return (
    <>
      <h3 style={{ textAlign: 'center' }}>Payments</h3>
      <div style={{width:'50%',margin:'0 auto'}}>
      <Elements stripe={stripePromise}>
        <CheckoutForm price={price} />
      </Elements>
      </div>
    </>
  );
}

export default App;
