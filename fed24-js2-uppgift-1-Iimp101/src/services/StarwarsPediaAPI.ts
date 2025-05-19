import axios from "axios";

const instance = axios.create({
    baseURL: "https://swapi.thehiveresistance.com/api",
    timeout: 10000,
    headers: {
        accept: "application/json",
        "content-type": "application/json"
    },
});

const get = async <T>(endpoint: string) => {
    const res = instance.get<T>(endpoint);
    return res.data;
}