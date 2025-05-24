import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



  

const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
    
    
    
        try {
            await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
    
            const response = await axios.post(
                'http://127.0.0.1:8000/api/login',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                }
            );
            console.log(response.data);
    
            if (response.data.success) {
                console.log('Đăng nhập thành công!');
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
                return true;
            } else {
                setError('Email hoặc mật khẩu không chính xác!');
                console.log('Email hoặc mật khẩu không chính xác!');
                return false;
            }
        } catch (err) {
            if (err.response) {
                console.log('Chi tiết lỗi:', err.response.data);
                setError(err.response.data.message || 'Đăng nhập thất bại, vui lòng thử lại.');
            } else {
                console.log('Lỗi:', err.message);
                setError('Đăng nhập thất bại, vui lòng thử lại.');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        loading,
        error,
    };
};

export default useLogin;
