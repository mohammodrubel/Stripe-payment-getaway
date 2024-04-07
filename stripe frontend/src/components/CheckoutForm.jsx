// CheckoutForm.js
import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

function CheckoutForm({ price }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [procecing, setProcecing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [transectionId, setTransectionId] = useState("");
  const userInfo = {
    name: "md Rubel",
    email: "md.rubel007@hotmail.com",
    address: "Dhaka bangladesh",
  };

  useEffect(() => {
    fetch(`http://localhost:9000/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Changed "content-type" to "Content-Type"
      },
      body: JSON.stringify({ price }), // Stringify the body
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    // create pyment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error);
    } else {
      setError("");
    }

    setProcecing(true);
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: "md rubel",
            email: "niloy@gmail.com",
            phone: "unknown",
          },
        },
      });

    if (confirmError) {
      setError(confirmError);
    }
    setProcecing(false);
    if ( paymentIntent.status === "succeeded") {
      setTransectionId(paymentIntent.id);
      const payment = {
        name: "md rubel",
        transectionId:paymentIntent.id,
        email: "rubel@gmail.com",
        phone: "unknown",
        price,
      };

      await fetch(`http://localhost:9000/payment`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(payment) 
      })
      .then(res => res.json())
      .then(data => console.log(data))
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe | !clientSecret}
        style={{
          background: "tomato",
          color: "white",
        }}
      >
        {procecing ? "Processing" : "Pay"}
      </button>
      {error && (
        <p style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
          {error.message}
        </p>
      )}
      {transectionId && (
        <p style={{ textAlign: "center", color: "green", marginTop: "20px" }}>
          Transaction Complete Transaction id Number : {transectionId}
        </p>
      )}
    </form>
  );
}

export default CheckoutForm;
