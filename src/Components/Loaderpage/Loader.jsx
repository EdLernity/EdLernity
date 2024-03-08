// import React from "react";
// import { RingLoader , PacmanLoader ,HashLoader} from "react-spinners";
// const Loader = () => {


//   return (
//     <div className="flex items-center justify-center h-screen">
//       {/* <RingLoader color="#2F35CB" /> */}
//       {/* <PacmanLoader color="#2F35CB" /> */}

//       <HashLoader color="#2F35CB" />
//       <div className="ml-4 text-xl font-semibold text-gray-700">
//         Welcome to EdLernity
//       </div>
//     </div>
//   );
// };

// export default Loader;

import React from "react";
import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        {/* Add your logo image or any other element here */}
        <img
          src="/Image/Logo1.svg"
          alt="Logo"
          className="h-12 w-12 rounded-full"
        />
      </div>
      <HashLoader color="#2F35CB" />
      <div className="mt-4 text-xl font-semibold text-gray-700">
        Welcome to EdLernity
      </div>
    </div>
  );
};

export default Loader;
