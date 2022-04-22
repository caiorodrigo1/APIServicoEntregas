import { prisma } from "../../../database/prismaClient"
import { compare } from "bcrypt"
import { sign} from "jsonwebtoken"

interface IAuthenticateDeliveryman {
    username: string;
    password: string;
}

export class AuthenticateDeliverymanUseCase {
    async execute({ username, password }: IAuthenticateDeliveryman) {
        // Receber username, password, 

        // Verificar se username cadastrado
        const deliveryman = await prisma.deliveryman.findFirst({
            where: {
                username
            }
        })

        if(!deliveryman) {
            throw new Error("Invalid usernsame or password")
        }

        // Verificar se senha corresponde ao username
        const passwordMatch = await compare(password, deliveryman.password);

        if(!passwordMatch) {
            throw new Error("Invalid usernsame or password")
        }

        // Gerar o token
        const token = sign({username}, "44d8c1b86c246fcecf9822f0015c0904", {
            subject: deliveryman.id,
            expiresIn: "1d"
        });

        return token;
    }
}