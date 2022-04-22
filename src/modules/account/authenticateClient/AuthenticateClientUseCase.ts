import { prisma } from "../../../database/prismaClient"
import { compare } from "bcrypt"
import { sign} from "jsonwebtoken"

interface IAuthenticateClient {
    username: string;
    password: string;
}

export class AuthenticateClientUseCase {
    async execute({ username, password }: IAuthenticateClient) {
        // Receber username, password, 

        // Verificar se username cadastrado
        const client = await prisma.clients.findFirst({
            where: {
                username
            }
        })

        if(!client) {
            throw new Error("Invalid usernsame or password")
        }

        // Verificar se senha corresponde ao username
        const passwordMatch = await compare(password, client.password);

        if(!passwordMatch) {
            throw new Error("Invalid usernsame or password")
        }

        // Gerar o token
        const token = sign({username}, "33d3d1b86c246fcecf9822f0015c0904", {
            subject: client.id,
            expiresIn: "1d"
        });

        return token;
    }
}