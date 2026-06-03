// import React from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';



// const App = () => {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
       
        // </Routes>
//       </BrowserRouter>
//     </>
//   );
// };

// export default App;



import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
