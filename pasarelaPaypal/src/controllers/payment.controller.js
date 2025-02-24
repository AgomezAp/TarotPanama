import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


const { PAYPAL_API_CLIENT, PAYPAL_API_SECRET,PAYPAL_API,HOST,SECRET_KEY } = process.env;


export const createOrder = async (req, res) => {
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "3.00",
          },
        },
      ],
      application_context: {
        brand_name: "Tarot Latinoamerica",
        landing_page: "NO_PREFERENCE",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order`,
        failure_url: `https://cartastarotpanama.com/welcome`,
        cancel_url: `https://cartastarotpanama.com/welcome`,
      },
    };

    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
       "https://api-m.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(access_token);

    // make a request
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data);

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something goes wrong");
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    if (response.data.status === "COMPLETED") {
      const approvalToken = jwt.sign(
        { status: 'approved', timestamp: Date.now() },
        SECRET_KEY,
        { expiresIn: '5m' }
      );
      
      return res.redirect(
        `https://cartastarotpanama.com/descripcion-cartas?status=COMPLETED&token=${approvalToken}`
      );
    } else {
      const rejectToken = jwt.sign(
        { status: 'not_approved', timestamp: Date.now() },
        SECRET_KEY,
        { expiresIn: '5m' }
      );
      
      return res.redirect(
        `https://cartastarotpanama.com/descripcion-cartas?status=NOT_COMPLETED&token=${rejectToken}`
      );
    }
  } catch (error) {
    if (error.response) {
      console.error('Error de PayPal:', error.response.data);
      return res.redirect(`https://cartastarotpanama.com/descripcion-cartas?status=ERROR`);
    }
    console.error('Error desconocido:', error.message);
    return res.redirect(`https://cartastarotpanama.com/descripcion-cartas?status=ERROR`);
  }
};


export const cancelPayment = (req, res) => res.redirect("/");

