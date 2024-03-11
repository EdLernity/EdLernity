import React, { useState } from 'react';

const Paytm = () => {
    const [loading, setLoading] = useState(false);

    function isDate(val) {
      // Cross realm comptatible
      return Object.prototype.toString.call(val) === "[object Date]";
    }
  
    function isObj(val) {
      return typeof val === "object";
    }
  
    function stringifyValue(val) {
      if (isObj(val) && !isDate(val)) {
        return JSON.stringify(val);
      } else {
        return val;
      }
    }
  
    function buildForm({ action, params }) {
      const form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action", action);
  
      Object.keys(params)?.forEach((key) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", stringifyValue(params[key]));
        form.appendChild(input);
      });

      return form
    }
  
    function post(details) {
      const form = buildForm(details);
      document.body.appendChild(form);
      setLoading(false)
      form.submit();
      form.remove();
    }
  
    const getData = (data) => {
      setLoading(false);
      return fetch(`http://3.110.210.79:3001/api/payment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
            response.json()
            console.log(response)
        })
        .catch((err) => console.log(err));
    };
  
    const handlePayment = (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        getData({ amount: 100, email: "nikhilraj@gmail.com" }).then((response) => {
          var information = {
            // for production only
            action: "https://securegw.paytm.in/order/process",
            params: response,
          };
          console.log(response)
          post(information);
        });
      }, 1500);
    };

  return (
    <>
    <div className='main'>
      <img width={300} src="/Image/paytm.png" alt="img" />
      <p>Payment Gateway integration</p>
      <div className='card px-5 py-4 mt-5'>
        <form className='' onSubmit={handlePayment}>
          {!loading ? <div className='col-12 center'>
            <button className='w-100 text-black border px-4' type="submit">Pay Now</button>
          </div>
          :
          <div className='col-12 center'>
            <button className='w-100 text-center text-black px-4' type="submit">
              <div className="spinner-border" role="status">
                <span className="visually-hidden text-black ">Loading...</span>
              </div>
            </button>
          </div>
          }
        </form>
      </div>
    </div>
    </>
  )
}

export default Paytm