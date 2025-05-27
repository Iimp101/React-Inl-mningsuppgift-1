export interface Person {
    id: number;
    name: string;
    birth_year: string;
    height: string;
    mass: string;
    skin_color: string;
    wiki_link: string;
    image_url?: string | null;
    affiliations: string[];
    films_count: number;
    species_count: number;
    starships_count: number;
    vehicles_count: number;
    homeworld: {
        id: number;
        name: string;
    }
}

export interface Film {
	id: number;
	title: string;
	episode_id: string;         
	opening_crawl: string;
	director: string;
	producer: string;
	release_date: string;      
	image_url?: string | null;

	characters_count: number;
	planets_count: number;
	starships_count: number;
	vehicles_count: number;
	species_count: number;

	characters: { id: number; name: string }[];
	planets: { id: number; name: string }[];
	species: { id: number; name: string }[];
	starships: { id: number; name: string }[];
	vehicles: { id: number; name: string }[];
}


export interface Planet {
	id: number;
	name: string;
	rotation_period: string;
	orbital_period: string;
	diameter: string;
	climate: string;
	gravity: string;
	terrain: string;
	surface_water: string;
	population: string;
	residents_count: number;
	films_count: number;
}

export interface Species {
	id: number;
	name: string;
	classification: string;
	designation: string;
	average_height: string;
	average_lifespan: string;
	eye_colors: string;
	hair_colors: string;
	skin_colors: string;
	language: string;
	people_count: number;
	films_count: number;

	homeworld: {
		id: number;
		name: string;
	} | null;
}

export interface Starship {
	id: number;
	name: string;
	model: string;
	starship_class: string;
	manufacturer: string;
	cost_in_credits: string;
	length: string;
	crew: string;
	passengers: string;
	max_atmosphering_speed: string;
	hyperdrive_rating: string;
	MGLT: string;
	cargo_capacity: string;
	consumables: string;
	pilots_count: number;
	films_count: number;
}

export interface Vehicle {
	id: number;
	name: string;
	model: string;
	vehicle_class: string;
	manufacturer: string;
	length: string;
	cost_in_credits: string;
	crew: string;
	passengers: string;
	max_atmosphering_speed: string;
	cargo_capacity: string;
	consumables: string;
	pilots_count: number;
	films_count: number;
}

export interface SWAPIListResponse<T> {
	current_page: number;
	data: T[];
	first_page_url: string;
	last_page: number;
	last_page_url: string;
	next_page_url: string | null;
	prev_page_url: string | null;
	per_page: number;
	to: number;
	total: number;
}
