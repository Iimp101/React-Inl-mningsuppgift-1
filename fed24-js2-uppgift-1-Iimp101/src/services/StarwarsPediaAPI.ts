import axios from "axios";
import type {
    Person,
    Film, Planet,
    Species, Starship,
    Vehicle,
    SWAPIListResponse
} from "./StarwarsPedia.types";

const instance = axios.create({
    baseURL: "https://swapi.thehiveresistance.com/api",
    timeout: 10000,
    headers: {
        accept: "application/json",
        "content-type": "application/json"
    },
});

const get = async <T>(endpoint: string): Promise<T> => {
	const res = await instance.get<T>(endpoint);
	return res.data;
};

export const getList = async <T>(resource: string, page = 1, searchQuery = "") => {
	let endpoint = `/${resource}/?page=${page}`;
	if (searchQuery.trim()) {
		endpoint += `&search=${searchQuery}`;
	}
	return get<SWAPIListResponse<T>>(endpoint);
};

// People(s)
export const getPersonList = (page?: number, search?: string) => 
    getList<Person>("people", page, search);

export const getPersonById = (id: number) =>
	get<Person>(`/people/${id}`);

// Film(s)
export const getFilmList = (page?: number, search?: string) =>
	getList<Film>("films", page, search);

export const getFilmById = (id: number) =>
	get<Film>(`/films/${id}`);

// Planet(s)
export const getPlanetList = (page?: number, search?: string) =>
	getList<Planet>("planets", page, search);

export const getPlanetById = (id: number) =>
	get<Planet>(`/planets/${id}`);

// Specie(s)
export const getSpeciesList = (page?: number, search?: string) =>
	getList<Species>("species", page, search);

export const getSpeciesById = (id: number) =>
	get<Species>(`/species/${id}`);

// Starship(s)
export const getStarshipList = (page?: number, search?: string) =>
	getList<Starship>("starships", page, search);

export const getStarshipById = (id: number) =>
	get<Starship>(`/starships/${id}`);

// Vehicle(s)
export const getVehicleList = (page?: number, search?: string) =>
	getList<Vehicle>("vehicles", page, search);

export const getVehicleById = (id: number) =>
	get<Vehicle>(`/vehicles/${id}`);