import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          //options
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', //JSON format
          },
          body: JSON.stringify(uploadData), //data to be sent
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; //rethrowing or propagating the error so that its caught by the catch block of try that used this function, it rejects the promise that uses getJSON function and is finally logged by the catch block of that place
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; //rethrowing or propagating the error so that its caught by the catch block of try that used this function, it rejects the promise that uses getJSON function and is finally logged by the catch block of that place
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       //options
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json', //JSON format
//       },
//       body: JSON.stringify(uploadData), //data to be sent
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json(); //will return the data we sent back

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; //rethrowing or propagating the error so that its caught by the catch block of try that used this function, it rejects the promise that uses getJSON function and is finally logged by the catch block of that place
//   }
// };
