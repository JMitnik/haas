// Note: This will add to the existing server
import { prisma } from '../generated/prisma-client'

async function main() {
    const newUser = await prisma.createUser({
        name: 'Jonathan'
    });

    const allUsers = await prisma.users();
    console.log(allUsers);
}

main().then(() => {
    console.log('Done!');
});