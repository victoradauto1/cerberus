import { User } from "commons/models/user";
import axios from "./BaseService";
import ConfigService from "./ConfigService";

const BACKEND_URL = `${ConfigService.BACKEND_URL}/users`;

export async function getUser(identifier: string): Promise<User>{
    const response = await axios.get(`${BACKEND_URL}/${identifier}`);
    return response.data;
}

export async function updateUser(id: string , user: User): Promise<User>{
    const response = await axios.patch(`${BACKEND_URL}/${id}`, user);
    return response.data;
}

export async function payUser(): Promise<User>{
    const response = await axios.post(`${BACKEND_URL}/pay`);
    return response.data;
}

