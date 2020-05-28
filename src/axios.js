import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://testing-project-f6c25.firebaseio.com/'
});

export default instance;