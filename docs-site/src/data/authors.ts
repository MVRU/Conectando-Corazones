export type Author = {
    id: string;           // clave corta
    name: string;         // nombre visible
    title?: string;       // cargo/rol
    url?: string;         // link a perfil (GitHub, blog author, etc.)
    image_url?: string;   // ruta local o remota a avatar
};

export const AUTHORS: Record<string, Author> = {
    marina: {
        id: "marina",
        name: "Marina Milo",
        title: "Cofundadora y desarrolladora",
        url: "https://github.com/MVRU",
        image_url: "https://github.com/MVRU.png",
    },
    alexis: {
        id: "alexis",
        name: "Alexis Sklate",
        title: "Cofundador y desarrollador",
        url: "https://github.com/AleSklate0807",
        image_url: "https://github.com/AleSklate0807.png",
    },
    tomas: {
        id: "tomas",
        name: "Martín Tomás Álvarez",
        title: "Cofundador y desarrollador",
        url: "https://github.com/TomasAlvarez0",
        image_url: "https://github.com/TomasAlvarez0.png",
    },
};
