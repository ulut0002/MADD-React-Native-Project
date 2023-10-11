import { createContext, useContext, useState } from "react";

const AppContext = createContext();

function AppProvider(props) {
  const [gifts, setGifts] = useState([]);

  // add function here

  return (
    <AppContext.Provider>
      value={[gifts]}
      {...props}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("Not inside the Provider");
  return context;
}
export { useApp, AppProvider };
