// TODO: corregir en base a Firebase

export interface ChatInfo {
    id: string;
    name: string;
    owner: string;
}

export interface Message {
    id: string;
    user: string;
    text: string;
    time: string;
}