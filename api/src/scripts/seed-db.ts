import CustomerService from '../models/customer/CustomerService';
import defaultWorkspaceTemplate from '../models/templates/defaultWorkspaceTemplate';
import prisma from '../config/prisma';

// Create workspace!

(async () => {
  try {
    CustomerService.createWorkspace({
      name: defaultWorkspaceTemplate.title,
      primaryColour: defaultWorkspaceTemplate.primaryColor,
      slug: defaultWorkspaceTemplate.slug,
      isSeed: true,
      logo: '',
      willGenerateFakeData: false,
    }).catch((err) => console.log(err)).then(() => console.log('Okay done'));
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  console.log('Disconnected from prisma');

  process.exit();
})();
