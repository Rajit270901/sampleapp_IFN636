import React, { createContext, useState, useContext, useEffect } from 'react'; // importing react context and hooks https://www.w3schools.com/react/react_hooks.asp

const AuthContext = createContext(); // creates auth context so user data can be shared https://www.w3schools.com/react/react_usecontext.asp

export const AuthProvider = ({ children }) => { // wraps the app and provides auth data to child components
  const [user, setUser] = useState(null); // stores logged in user data https://www.w3schools.com/react/react_usestate.asp

  useEffect(() => { // runs once when app loads https://www.w3schools.com/react/react_useeffect.asp
    const storedUser = localStorage.getItem('meditrackUser'); // gets saved user from browser storage https://www.w3schools.com/jsref/prop_win_localstorage.asp
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // converts stored string back to object https://www.w3schools.com/js/js_json_parse.asp
    }
  }, []);

  const login = (userData) => {
    setUser(userData); // saves user in react state
    localStorage.setItem('meditrackUser', JSON.stringify(userData)); // stores user in browser so login stays after refresh https://www.w3schools.com/js/js_json_stringify.asp
  };

  const logout = () => {
    setUser(null); // clears user from state
    localStorage.removeItem('meditrackUser'); // removes saved login from browser storage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user, // converts user value into true or false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // custom hook to use auth context in other components https://www.w3schools.com/react/react_usecontext.asp
