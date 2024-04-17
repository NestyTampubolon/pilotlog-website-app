import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.234.154:8080';
axios.defaults.headers.post["Content-Type"] = "application/json";


export const IMAGE_BASE_URL = `${axios.defaults.baseURL}/api/v1/images/`;

export const getAuthToken = () => {
    return window.localStorage.getItem("auth_token");
};

export const setAuthToken = (token) => {
    window.localStorage.setItem("auth_token", token);
};

export const removeAuthToken = () => {
    window.localStorage.removeItem("auth_token");
};



export const getRefreshToken = () => {
    return window.localStorage.getItem("refresh_token");
};

export const setRefreshToken = (token) => {
    window.localStorage.setItem("refresh_token", token);
};

export const removeRefreshToken = () => {
    window.localStorage.removeItem("refresh_token");
};

export const getUsersInfo = () => {
    const usersString = window.localStorage.getItem("users");
    if (usersString) {
        return JSON.parse(usersString);
    }
    return null; // Mengembalikan null jika tidak ada data pengguna
};


export const setUsersInfo = (users) => {
    const usersString = JSON.stringify(users); // Mengonversi objek menjadi string JSON
    window.localStorage.setItem("users", usersString); // Menyimpan string JSON ke dalam local storage
};

export const removeUsersInfo = () => {
    window.localStorage.removeItem("users");
};

// export const request = (method, url, data) => {
//     let headers = {};
//     if (getAuthToken() !== null && getAuthToken() !== "null" && getAuthToken() !== "") {
//         headers = { Authorization: `Bearer ${getAuthToken()}` };
//     }

//     if (data instanceof File) {
//         headers['Content-Type'] = 'multipart/form-data';
//     }

//     return axios({
//         method: method,
//         url: url,
//         data: data,
//         headers: headers
//     });
// };


export const request = (method, url, data, contentType = 'application/json') => {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null" && getAuthToken() !== "") {
        headers = { Authorization: `Bearer ${getAuthToken()}` };
    }

    if (contentType === 'multipart/form-data') {
        const formData = new FormData();
        const appendFormData = (prefix, obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                const prefixedKey = prefix ? `${prefix}.${key}` : key;
                if (value instanceof File || value instanceof Blob) {
                    formData.set(prefixedKey, value);
                } else if (typeof value === 'object') {
                    appendFormData(prefixedKey, value);
                } else {
                    formData.set(prefixedKey, value);
                }
            });
        };
        appendFormData('', data);
        console.log(formData);
        return axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                ...headers,
                'Content-Type': contentType
            }
        });
    }

    return axios({
        method: method,
        url: url,
        data: data,
        headers: headers
    });
};


axios.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // Cek apakah error terkait dengan token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Ambil refresh token dari penyimpanan lokal
                const refreshToken = getRefreshToken();

                // Kirim permintaan untuk refresh token
                const response = await axios.post('/api/v1/auth/refresh', { refreshToken });

                // Simpan token baru
                setAuthToken(response.data.accessToken);

                // Ulangi permintaan dengan token yang diperbarui
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                // Tangani kesalahan pembaruan token
                console.error('Failed to refresh token:', refreshError);
                // Lakukan sesuatu seperti me-redirect ke halaman login
                // atau menampilkan pesan kepada pengguna
                throw refreshError;
            }
        }

        // Throw error jika tidak terkait dengan token
        return Promise.reject(error);
    }
);
