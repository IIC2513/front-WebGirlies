import { useEffect , useState} from "react";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userId, setUserId] = useState(localStorage.getItem('user_id') || null);

    function logout() {
        setToken(null)
        setUserId(null)
        localStorage.removeItem('token');
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem('user_id', userId);
    }, [userId]);

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, logout}}>
            {children}
        </AuthContext.Provider>
    );
    }
export default AuthProvider;