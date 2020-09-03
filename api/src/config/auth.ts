import { allow, and, deny, not, or, rule, shield } from 'graphql-shield';

const isLoggedIn = rule({ cache: 'strict' })(
  async (parent, args, ctx, info) => ctx.user !== null,
);

const isSuperAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => ctx.user.globalPermissions.includes('CAN_ACCESS_ADMIN_PANEL'),
);

const belongsToCustomer = rule({ cache: 'strict' })(
  async (parent, args, ctx) => !!ctx.user.customers.find((customer: any) => customer.customerId === parent.id),
);

const authShield = shield({
  Query: {
    customers: isLoggedIn,
  },
  Customer: or(belongsToCustomer, isSuperAdmin),
}, { fallbackRule: deny });

export default authShield;
