/*
  url: {
    ios: localhost
    android: {
      android studio: 10.0.2.2,
      genymotion: 10.0.3.2,
      phone via usb: your ip
    }
  }
*/
// const BASE_API = 'http://127.0.0.1:3000';
const BASE_API = 'http://192.168.1.100:3000';


export default {

    checkToken: async (token: string) => {
        const req = await fetch(`${BASE_API}/authentication/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'cookie': `${token}`
            }
        })
        const resp = await req.json(); 
        return { ...resp, status: req.status };
    },
    singIn: async (email: string, password: string) => {
        const req = await fetch(`${BASE_API}/authentication/log-in`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        const token = req.headers.get('Set-Hedaer');
        const resp = await req.json();
        return { ...resp, token};
    }


}