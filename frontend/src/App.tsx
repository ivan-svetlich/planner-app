import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";
import AppNavBar from "./components/menu/Menu";
import Calendar from "./components/calendar/Calendar";
import Login from "./components/authManagement/Login";
import Signup from "./components/authManagement/Signup";
import { store } from "./store/store";
import AppBody from "./routes/AppBody";

let persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            {/* <div className="App-body">
              <AppNavBar />
              <Routes>
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </div> */}
            <AppBody />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
