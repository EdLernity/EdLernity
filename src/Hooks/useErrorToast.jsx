import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useErrorToast = (error) => {
  useEffect(() => {
    if (error) {
      toast.error('Something went wrong!', {
        position: 'bottom-center',
        autoClose: 5000,
      });
    }
  }, [error]);
};

export default useErrorToast;

// import { useEffect } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const customToastStyle = {
//   position: 'absolute',
//   bottom: '20px',
//   left: '50%',
//   transform: 'translateX(-50%)',
// };

// const useErrorToast = (error) => {
//   useEffect(() => {
//     if (error) {
//       toast.error(error?.response?.data?.error, {
//         position: 'bottom-center',
//         autoClose: 5000,
//         toastStyle: customToastStyle,
//       });
//     }
//   }, [error]);
// };

// export default useErrorToast;

