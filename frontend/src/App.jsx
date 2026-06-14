import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import KaamSetuLoader from "./components/Loader/fullLoader";
import { useEffect, useState } from "react";

function App() {

   const [loading, setLoading] = useState(true);
    
    useEffect(() => {
    const initializeApp = async () => {
      try {
        // Future me auth check kar sakte ho

      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);



  if (loading) {
    return <KaamSetuLoader />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
