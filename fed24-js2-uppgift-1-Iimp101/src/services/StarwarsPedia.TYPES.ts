export interface Person {
    id: number;
    name: string;
    birth_year: string;
    height: string;
    mass: string;
    skin_color: string;
    wiki_link: string;
    image_url?: string;
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