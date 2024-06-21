import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','given_name','family_name','email','password','stripeCustomerId','userRole','accountStatus','createdAt','updatedAt','colorScheme','connectedAccountId','stripeConnectedLinked']);

export const NotificationScalarFieldEnumSchema = z.enum(['id','message','createdAt','userId','isRead']);

export const ListingScalarFieldEnumSchema = z.enum(['id','title','description','imageSrc','createdAt','category','time','bathroomCount','guestCount','locationValue','userId','price','featureOne','featureTwo']);

export const ReservationScalarFieldEnumSchema = z.enum(['id','userId','listingId','startDate','endDate','totalPrice','createdAt','startTime','endTime']);

export const SubscriptionScalarFieldEnumSchema = z.enum(['stripeSubscriptionId','interval','status','planId','planName','currentPeriodStart','currentPeriodEnd','createdAt','updatedAt','userId']);

export const AppConfigScalarFieldEnumSchema = z.enum(['id','maxActiveUser']);

export const ProductScalarFieldEnumSchema = z.enum(['id','name','price','smallDescription','description','images','productFile','category','createdAt','userId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const UserRoleSchema = z.enum(['User','Admin','Support']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const AccountStatusSchema = z.enum(['Pending','Active','Inactive','Password_Reset_Required']);

export type AccountStatusType = `${z.infer<typeof AccountStatusSchema>}`

export const CategoryTypesSchema = z.enum(['template','uikit','icon']);

export type CategoryTypesType = `${z.infer<typeof CategoryTypesSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  userRole: UserRoleSchema,
  accountStatus: AccountStatusSchema,
  id: z.string().uuid(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  colorScheme: z.string(),
  connectedAccountId: z.string().nullable(),
  stripeConnectedLinked: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  isRead: z.boolean(),
})

export type Notification = z.infer<typeof NotificationSchema>

/////////////////////////////////////////
// LISTING SCHEMA
/////////////////////////////////////////

export const ListingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date(),
  category: z.string(),
  time: z.string().nullable(),
  bathroomCount: z.number().int().nullable(),
  guestCount: z.number().int().nullable(),
  locationValue: z.string(),
  userId: z.string(),
  price: z.number().int(),
  featureOne: z.string().nullable(),
  featureTwo: z.string().nullable(),
})

export type Listing = z.infer<typeof ListingSchema>

/////////////////////////////////////////
// RESERVATION SCHEMA
/////////////////////////////////////////

export const ReservationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  listingId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().nullable(),
})

export type Reservation = z.infer<typeof ReservationSchema>

/////////////////////////////////////////
// SUBSCRIPTION SCHEMA
/////////////////////////////////////////

export const SubscriptionSchema = z.object({
  stripeSubscriptionId: z.string(),
  interval: z.string(),
  status: z.string(),
  planId: z.string(),
  planName: z.string().nullable(),
  currentPeriodStart: z.number().int(),
  currentPeriodEnd: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

/////////////////////////////////////////
// APP CONFIG SCHEMA
/////////////////////////////////////////

export const AppConfigSchema = z.object({
  id: z.string().uuid(),
  maxActiveUser: z.number().int(),
})

export type AppConfig = z.infer<typeof AppConfigSchema>

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  category: CategoryTypesSchema,
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().int(),
  smallDescription: z.string(),
  description: JsonValueSchema,
  images: z.string().array(),
  productFile: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string().nullable(),
})

export type Product = z.infer<typeof ProductSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  Subscription: z.union([z.boolean(),z.lazy(() => SubscriptionArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  notifications: z.union([z.boolean(),z.lazy(() => NotificationFindManyArgsSchema)]).optional(),
  listings: z.union([z.boolean(),z.lazy(() => ListingFindManyArgsSchema)]).optional(),
  reservations: z.union([z.boolean(),z.lazy(() => ReservationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  Product: z.boolean().optional(),
  notifications: z.boolean().optional(),
  listings: z.boolean().optional(),
  reservations: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  given_name: z.boolean().optional(),
  family_name: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  stripeCustomerId: z.boolean().optional(),
  userRole: z.boolean().optional(),
  accountStatus: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  colorScheme: z.boolean().optional(),
  connectedAccountId: z.boolean().optional(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.union([z.boolean(),z.lazy(() => SubscriptionArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  notifications: z.union([z.boolean(),z.lazy(() => NotificationFindManyArgsSchema)]).optional(),
  listings: z.union([z.boolean(),z.lazy(() => ListingFindManyArgsSchema)]).optional(),
  reservations: z.union([z.boolean(),z.lazy(() => ReservationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// NOTIFICATION
//------------------------------------------------------

export const NotificationIncludeSchema: z.ZodType<Prisma.NotificationInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const NotificationArgsSchema: z.ZodType<Prisma.NotificationDefaultArgs> = z.object({
  select: z.lazy(() => NotificationSelectSchema).optional(),
  include: z.lazy(() => NotificationIncludeSchema).optional(),
}).strict();

export const NotificationSelectSchema: z.ZodType<Prisma.NotificationSelect> = z.object({
  id: z.boolean().optional(),
  message: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  isRead: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// LISTING
//------------------------------------------------------

export const ListingIncludeSchema: z.ZodType<Prisma.ListingInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  reservations: z.union([z.boolean(),z.lazy(() => ReservationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ListingCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ListingArgsSchema: z.ZodType<Prisma.ListingDefaultArgs> = z.object({
  select: z.lazy(() => ListingSelectSchema).optional(),
  include: z.lazy(() => ListingIncludeSchema).optional(),
}).strict();

export const ListingCountOutputTypeArgsSchema: z.ZodType<Prisma.ListingCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ListingCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ListingCountOutputTypeSelectSchema: z.ZodType<Prisma.ListingCountOutputTypeSelect> = z.object({
  reservations: z.boolean().optional(),
}).strict();

export const ListingSelectSchema: z.ZodType<Prisma.ListingSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  imageSrc: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  category: z.boolean().optional(),
  time: z.boolean().optional(),
  bathroomCount: z.boolean().optional(),
  guestCount: z.boolean().optional(),
  locationValue: z.boolean().optional(),
  userId: z.boolean().optional(),
  price: z.boolean().optional(),
  featureOne: z.boolean().optional(),
  featureTwo: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  reservations: z.union([z.boolean(),z.lazy(() => ReservationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ListingCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RESERVATION
//------------------------------------------------------

export const ReservationIncludeSchema: z.ZodType<Prisma.ReservationInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  listing: z.union([z.boolean(),z.lazy(() => ListingArgsSchema)]).optional(),
}).strict()

export const ReservationArgsSchema: z.ZodType<Prisma.ReservationDefaultArgs> = z.object({
  select: z.lazy(() => ReservationSelectSchema).optional(),
  include: z.lazy(() => ReservationIncludeSchema).optional(),
}).strict();

export const ReservationSelectSchema: z.ZodType<Prisma.ReservationSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  listingId: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  totalPrice: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  listing: z.union([z.boolean(),z.lazy(() => ListingArgsSchema)]).optional(),
}).strict()

// SUBSCRIPTION
//------------------------------------------------------

export const SubscriptionIncludeSchema: z.ZodType<Prisma.SubscriptionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SubscriptionArgsSchema: z.ZodType<Prisma.SubscriptionDefaultArgs> = z.object({
  select: z.lazy(() => SubscriptionSelectSchema).optional(),
  include: z.lazy(() => SubscriptionIncludeSchema).optional(),
}).strict();

export const SubscriptionSelectSchema: z.ZodType<Prisma.SubscriptionSelect> = z.object({
  stripeSubscriptionId: z.boolean().optional(),
  interval: z.boolean().optional(),
  status: z.boolean().optional(),
  planId: z.boolean().optional(),
  planName: z.boolean().optional(),
  currentPeriodStart: z.boolean().optional(),
  currentPeriodEnd: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// APP CONFIG
//------------------------------------------------------

export const AppConfigSelectSchema: z.ZodType<Prisma.AppConfigSelect> = z.object({
  id: z.boolean().optional(),
  maxActiveUser: z.boolean().optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  price: z.boolean().optional(),
  smallDescription: z.boolean().optional(),
  description: z.boolean().optional(),
  images: z.boolean().optional(),
  productFile: z.boolean().optional(),
  category: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  given_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  family_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stripeCustomerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => EnumAccountStatusFilterSchema),z.lazy(() => AccountStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  colorScheme: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  connectedAccountId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  Subscription: z.union([ z.lazy(() => SubscriptionNullableRelationFilterSchema),z.lazy(() => SubscriptionWhereInputSchema) ]).optional().nullable(),
  Product: z.lazy(() => ProductListRelationFilterSchema).optional(),
  notifications: z.lazy(() => NotificationListRelationFilterSchema).optional(),
  listings: z.lazy(() => ListingListRelationFilterSchema).optional(),
  reservations: z.lazy(() => ReservationListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.UserWhereInput>;

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  given_name: z.lazy(() => SortOrderSchema).optional(),
  family_name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userRole: z.lazy(() => SortOrderSchema).optional(),
  accountStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  colorScheme: z.lazy(() => SortOrderSchema).optional(),
  connectedAccountId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stripeConnectedLinked: z.lazy(() => SortOrderSchema).optional(),
  Subscription: z.lazy(() => SubscriptionOrderByWithRelationInputSchema).optional(),
  Product: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
  notifications: z.lazy(() => NotificationOrderByRelationAggregateInputSchema).optional(),
  listings: z.lazy(() => ListingOrderByRelationAggregateInputSchema).optional(),
  reservations: z.lazy(() => ReservationOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserOrderByWithRelationInput>;

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    stripeCustomerId: z.string(),
    connectedAccountId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    connectedAccountId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
  }),
  z.object({
    id: z.string().uuid(),
    stripeCustomerId: z.string(),
    connectedAccountId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    connectedAccountId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    email: z.string().email(),
    stripeCustomerId: z.string(),
    connectedAccountId: z.string(),
  }),
  z.object({
    email: z.string().email(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    email: z.string().email(),
    connectedAccountId: z.string(),
  }),
  z.object({
    email: z.string().email(),
  }),
  z.object({
    stripeCustomerId: z.string(),
    connectedAccountId: z.string(),
  }),
  z.object({
    stripeCustomerId: z.string(),
  }),
  z.object({
    connectedAccountId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  stripeCustomerId: z.string().optional(),
  connectedAccountId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  given_name: z.union([ z.lazy(() => StringFilterSchema),z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }) ]).optional(),
  family_name: z.union([ z.lazy(() => StringFilterSchema),z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }) ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }) ]).optional(),
  userRole: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => EnumAccountStatusFilterSchema),z.lazy(() => AccountStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  colorScheme: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stripeConnectedLinked: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  Subscription: z.union([ z.lazy(() => SubscriptionNullableRelationFilterSchema),z.lazy(() => SubscriptionWhereInputSchema) ]).optional().nullable(),
  Product: z.lazy(() => ProductListRelationFilterSchema).optional(),
  notifications: z.lazy(() => NotificationListRelationFilterSchema).optional(),
  listings: z.lazy(() => ListingListRelationFilterSchema).optional(),
  reservations: z.lazy(() => ReservationListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.UserWhereUniqueInput>;

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  given_name: z.lazy(() => SortOrderSchema).optional(),
  family_name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userRole: z.lazy(() => SortOrderSchema).optional(),
  accountStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  colorScheme: z.lazy(() => SortOrderSchema).optional(),
  connectedAccountId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stripeConnectedLinked: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserOrderByWithAggregationInput>;

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  given_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  family_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  stripeCustomerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => EnumAccountStatusWithAggregatesFilterSchema),z.lazy(() => AccountStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  colorScheme: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  connectedAccountId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict() as z.ZodType<Prisma.UserScalarWhereWithAggregatesInput>;

export const NotificationWhereInputSchema: z.ZodType<Prisma.NotificationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationWhereInputSchema),z.lazy(() => NotificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationWhereInputSchema),z.lazy(() => NotificationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationWhereInput>;

export const NotificationOrderByWithRelationInputSchema: z.ZodType<Prisma.NotificationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationOrderByWithRelationInput>;

export const NotificationWhereUniqueInputSchema: z.ZodType<Prisma.NotificationWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => NotificationWhereInputSchema),z.lazy(() => NotificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationWhereInputSchema),z.lazy(() => NotificationWhereInputSchema).array() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict()) as z.ZodType<Prisma.NotificationWhereUniqueInput>;

export const NotificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.NotificationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => NotificationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => NotificationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => NotificationMinOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationOrderByWithAggregationInput>;

export const NotificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.NotificationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema),z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema),z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationScalarWhereWithAggregatesInput>;

export const ListingWhereInputSchema: z.ZodType<Prisma.ListingWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ListingWhereInputSchema),z.lazy(() => ListingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListingWhereInputSchema),z.lazy(() => ListingWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageSrc: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bathroomCount: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  guestCount: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  locationValue: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  featureOne: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  featureTwo: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  reservations: z.lazy(() => ReservationListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.ListingWhereInput>;

export const ListingOrderByWithRelationInputSchema: z.ZodType<Prisma.ListingOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageSrc: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  time: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bathroomCount: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  guestCount: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  locationValue: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  featureOne: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  featureTwo: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  reservations: z.lazy(() => ReservationOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingOrderByWithRelationInput>;

export const ListingWhereUniqueInputSchema: z.ZodType<Prisma.ListingWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    userId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => ListingWhereInputSchema),z.lazy(() => ListingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListingWhereInputSchema),z.lazy(() => ListingWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageSrc: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bathroomCount: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  guestCount: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  locationValue: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  featureOne: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  featureTwo: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  reservations: z.lazy(() => ReservationListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.ListingWhereUniqueInput>;

export const ListingOrderByWithAggregationInputSchema: z.ZodType<Prisma.ListingOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageSrc: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  time: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bathroomCount: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  guestCount: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  locationValue: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  featureOne: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  featureTwo: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ListingCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ListingAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ListingMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ListingMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ListingSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingOrderByWithAggregationInput>;

export const ListingScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ListingScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ListingScalarWhereWithAggregatesInputSchema),z.lazy(() => ListingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListingScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListingScalarWhereWithAggregatesInputSchema),z.lazy(() => ListingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  imageSrc: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  bathroomCount: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  guestCount: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  locationValue: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  featureOne: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  featureTwo: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ListingScalarWhereWithAggregatesInput>;

export const ReservationWhereInputSchema: z.ZodType<Prisma.ReservationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  listingId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  totalPrice: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  listing: z.union([ z.lazy(() => ListingRelationFilterSchema),z.lazy(() => ListingWhereInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationWhereInput>;

export const ReservationOrderByWithRelationInputSchema: z.ZodType<Prisma.ReservationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  listingId: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalPrice: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  listing: z.lazy(() => ListingOrderByWithRelationInputSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationOrderByWithRelationInput>;

export const ReservationWhereUniqueInputSchema: z.ZodType<Prisma.ReservationWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    userId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  listingId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  totalPrice: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  listing: z.union([ z.lazy(() => ListingRelationFilterSchema),z.lazy(() => ListingWhereInputSchema) ]).optional(),
}).strict()) as z.ZodType<Prisma.ReservationWhereUniqueInput>;

export const ReservationOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReservationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  listingId: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalPrice: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ReservationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ReservationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReservationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReservationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ReservationSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationOrderByWithAggregationInput>;

export const ReservationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReservationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema),z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema),z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  listingId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  totalPrice: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationScalarWhereWithAggregatesInput>;

export const SubscriptionWhereInputSchema: z.ZodType<Prisma.SubscriptionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubscriptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  stripeSubscriptionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  interval: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  planId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  planName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  currentPeriodStart: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  currentPeriodEnd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionWhereInput>;

export const SubscriptionOrderByWithRelationInputSchema: z.ZodType<Prisma.SubscriptionOrderByWithRelationInput> = z.object({
  stripeSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  interval: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  planName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  currentPeriodStart: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodEnd: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionOrderByWithRelationInput>;

export const SubscriptionWhereUniqueInputSchema: z.ZodType<Prisma.SubscriptionWhereUniqueInput> = z.union([
  z.object({
    stripeSubscriptionId: z.string(),
    userId: z.string()
  }),
  z.object({
    stripeSubscriptionId: z.string(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  stripeSubscriptionId: z.string().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubscriptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  interval: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  planId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  planName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  currentPeriodStart: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  currentPeriodEnd: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict()) as z.ZodType<Prisma.SubscriptionWhereUniqueInput>;

export const SubscriptionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SubscriptionOrderByWithAggregationInput> = z.object({
  stripeSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  interval: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  planName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  currentPeriodStart: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodEnd: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SubscriptionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SubscriptionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SubscriptionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SubscriptionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SubscriptionSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionOrderByWithAggregationInput>;

export const SubscriptionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SubscriptionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  stripeSubscriptionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  interval: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  planId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  planName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  currentPeriodStart: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  currentPeriodEnd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionScalarWhereWithAggregatesInput>;

export const AppConfigWhereInputSchema: z.ZodType<Prisma.AppConfigWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AppConfigWhereInputSchema),z.lazy(() => AppConfigWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AppConfigWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AppConfigWhereInputSchema),z.lazy(() => AppConfigWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  maxActiveUser: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigWhereInput>;

export const AppConfigOrderByWithRelationInputSchema: z.ZodType<Prisma.AppConfigOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  maxActiveUser: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.AppConfigOrderByWithRelationInput>;

export const AppConfigWhereUniqueInputSchema: z.ZodType<Prisma.AppConfigWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => AppConfigWhereInputSchema),z.lazy(() => AppConfigWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AppConfigWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AppConfigWhereInputSchema),z.lazy(() => AppConfigWhereInputSchema).array() ]).optional(),
  maxActiveUser: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
}).strict()) as z.ZodType<Prisma.AppConfigWhereUniqueInput>;

export const AppConfigOrderByWithAggregationInputSchema: z.ZodType<Prisma.AppConfigOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  maxActiveUser: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AppConfigCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AppConfigAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AppConfigMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AppConfigMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AppConfigSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.AppConfigOrderByWithAggregationInput>;

export const AppConfigScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AppConfigScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AppConfigScalarWhereWithAggregatesInputSchema),z.lazy(() => AppConfigScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AppConfigScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AppConfigScalarWhereWithAggregatesInputSchema),z.lazy(() => AppConfigScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  maxActiveUser: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigScalarWhereWithAggregatesInput>;

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  smallDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.lazy(() => JsonFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  productFile: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryTypesFilterSchema),z.lazy(() => CategoryTypesSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  User: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ProductWhereInput>;

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  smallDescription: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  productFile: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict() as z.ZodType<Prisma.ProductOrderByWithRelationInput>;

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  smallDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.lazy(() => JsonFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  productFile: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryTypesFilterSchema),z.lazy(() => CategoryTypesSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  User: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict()) as z.ZodType<Prisma.ProductWhereUniqueInput>;

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  smallDescription: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  productFile: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ProductOrderByWithAggregationInput>;

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  smallDescription: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  productFile: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryTypesWithAggregatesFilterSchema),z.lazy(() => CategoryTypesSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput>;

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateInput>;

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateInput>;

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateInput>;

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateInput>;

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional()
}).strict() as z.ZodType<Prisma.UserCreateManyInput>;

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateManyMutationInput>;

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateManyInput>;

export const NotificationCreateInputSchema: z.ZodType<Prisma.NotificationCreateInput> = z.object({
  id: z.string().uuid().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  isRead: z.boolean().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutNotificationsInputSchema)
}).strict() as z.ZodType<Prisma.NotificationCreateInput>;

export const NotificationUncheckedCreateInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  isRead: z.boolean().optional()
}).strict() as z.ZodType<Prisma.NotificationUncheckedCreateInput>;

export const NotificationUpdateInputSchema: z.ZodType<Prisma.NotificationUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutNotificationsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationUpdateInput>;

export const NotificationUncheckedUpdateInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUncheckedUpdateInput>;

export const NotificationCreateManyInputSchema: z.ZodType<Prisma.NotificationCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  isRead: z.boolean().optional()
}).strict() as z.ZodType<Prisma.NotificationCreateManyInput>;

export const NotificationUpdateManyMutationInputSchema: z.ZodType<Prisma.NotificationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUpdateManyMutationInput>;

export const NotificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUncheckedUpdateManyInput>;

export const ListingCreateInputSchema: z.ZodType<Prisma.ListingCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutListingsInputSchema),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutListingInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingCreateInput>;

export const ListingUncheckedCreateInputSchema: z.ZodType<Prisma.ListingUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  userId: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutListingInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUncheckedCreateInput>;

export const ListingUpdateInputSchema: z.ZodType<Prisma.ListingUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutListingsNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutListingNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUpdateInput>;

export const ListingUncheckedUpdateInputSchema: z.ZodType<Prisma.ListingUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutListingNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUncheckedUpdateInput>;

export const ListingCreateManyInputSchema: z.ZodType<Prisma.ListingCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  userId: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable()
}).strict() as z.ZodType<Prisma.ListingCreateManyInput>;

export const ListingUpdateManyMutationInputSchema: z.ZodType<Prisma.ListingUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ListingUpdateManyMutationInput>;

export const ListingUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ListingUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ListingUncheckedUpdateManyInput>;

export const ReservationCreateInputSchema: z.ZodType<Prisma.ReservationCreateInput> = z.object({
  id: z.string().uuid().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutReservationsInputSchema),
  listing: z.lazy(() => ListingCreateNestedOneWithoutReservationsInputSchema)
}).strict() as z.ZodType<Prisma.ReservationCreateInput>;

export const ReservationUncheckedCreateInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  listingId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.ReservationUncheckedCreateInput>;

export const ReservationUpdateInputSchema: z.ZodType<Prisma.ReservationUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReservationsNestedInputSchema).optional(),
  listing: z.lazy(() => ListingUpdateOneRequiredWithoutReservationsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationUpdateInput>;

export const ReservationUncheckedUpdateInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateInput>;

export const ReservationCreateManyInputSchema: z.ZodType<Prisma.ReservationCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  listingId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.ReservationCreateManyInput>;

export const ReservationUpdateManyMutationInputSchema: z.ZodType<Prisma.ReservationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationUpdateManyMutationInput>;

export const ReservationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateManyInput>;

export const SubscriptionCreateInputSchema: z.ZodType<Prisma.SubscriptionCreateInput> = z.object({
  stripeSubscriptionId: z.string(),
  interval: z.string(),
  status: z.string(),
  planId: z.string(),
  planName: z.string().optional().nullable(),
  currentPeriodStart: z.number().int(),
  currentPeriodEnd: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSubscriptionInputSchema)
}).strict() as z.ZodType<Prisma.SubscriptionCreateInput>;

export const SubscriptionUncheckedCreateInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateInput> = z.object({
  stripeSubscriptionId: z.string(),
  interval: z.string(),
  status: z.string(),
  planId: z.string(),
  planName: z.string().optional().nullable(),
  currentPeriodStart: z.number().int(),
  currentPeriodEnd: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string()
}).strict() as z.ZodType<Prisma.SubscriptionUncheckedCreateInput>;

export const SubscriptionUpdateInputSchema: z.ZodType<Prisma.SubscriptionUpdateInput> = z.object({
  stripeSubscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  interval: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentPeriodStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currentPeriodEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSubscriptionNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionUpdateInput>;

export const SubscriptionUncheckedUpdateInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateInput> = z.object({
  stripeSubscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  interval: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentPeriodStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currentPeriodEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUncheckedUpdateInput>;

export const SubscriptionCreateManyInputSchema: z.ZodType<Prisma.SubscriptionCreateManyInput> = z.object({
  stripeSubscriptionId: z.string(),
  interval: z.string(),
  status: z.string(),
  planId: z.string(),
  planName: z.string().optional().nullable(),
  currentPeriodStart: z.number().int(),
  currentPeriodEnd: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string()
}).strict() as z.ZodType<Prisma.SubscriptionCreateManyInput>;

export const SubscriptionUpdateManyMutationInputSchema: z.ZodType<Prisma.SubscriptionUpdateManyMutationInput> = z.object({
  stripeSubscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  interval: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentPeriodStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currentPeriodEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUpdateManyMutationInput>;

export const SubscriptionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateManyInput> = z.object({
  stripeSubscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  interval: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentPeriodStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currentPeriodEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUncheckedUpdateManyInput>;

export const AppConfigCreateInputSchema: z.ZodType<Prisma.AppConfigCreateInput> = z.object({
  id: z.string().uuid().optional(),
  maxActiveUser: z.number().int()
}).strict() as z.ZodType<Prisma.AppConfigCreateInput>;

export const AppConfigUncheckedCreateInputSchema: z.ZodType<Prisma.AppConfigUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  maxActiveUser: z.number().int()
}).strict() as z.ZodType<Prisma.AppConfigUncheckedCreateInput>;

export const AppConfigUpdateInputSchema: z.ZodType<Prisma.AppConfigUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  maxActiveUser: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigUpdateInput>;

export const AppConfigUncheckedUpdateInputSchema: z.ZodType<Prisma.AppConfigUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  maxActiveUser: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigUncheckedUpdateInput>;

export const AppConfigCreateManyInputSchema: z.ZodType<Prisma.AppConfigCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  maxActiveUser: z.number().int()
}).strict() as z.ZodType<Prisma.AppConfigCreateManyInput>;

export const AppConfigUpdateManyMutationInputSchema: z.ZodType<Prisma.AppConfigUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  maxActiveUser: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigUpdateManyMutationInput>;

export const AppConfigUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AppConfigUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  maxActiveUser: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigUncheckedUpdateManyInput>;

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  price: z.number().int(),
  smallDescription: z.string(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  images: z.union([ z.lazy(() => ProductCreateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.string(),
  category: z.lazy(() => CategoryTypesSchema),
  createdAt: z.coerce.date().optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutProductInputSchema).optional()
}).strict() as z.ZodType<Prisma.ProductCreateInput>;

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  price: z.number().int(),
  smallDescription: z.string(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  images: z.union([ z.lazy(() => ProductCreateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.string(),
  category: z.lazy(() => CategoryTypesSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.string().optional().nullable()
}).strict() as z.ZodType<Prisma.ProductUncheckedCreateInput>;

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  smallDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  images: z.union([ z.lazy(() => ProductUpdateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => EnumCategoryTypesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneWithoutProductNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ProductUpdateInput>;

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  smallDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  images: z.union([ z.lazy(() => ProductUpdateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => EnumCategoryTypesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ProductUncheckedUpdateInput>;

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  price: z.number().int(),
  smallDescription: z.string(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  images: z.union([ z.lazy(() => ProductCreateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.string(),
  category: z.lazy(() => CategoryTypesSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.string().optional().nullable()
}).strict() as z.ZodType<Prisma.ProductCreateManyInput>;

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  smallDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  images: z.union([ z.lazy(() => ProductUpdateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => EnumCategoryTypesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUpdateManyMutationInput>;

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  smallDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  images: z.union([ z.lazy(() => ProductUpdateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => EnumCategoryTypesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ProductUncheckedUpdateManyInput>;

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.StringFilter>;

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.StringNullableFilter>;

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.EnumUserRoleFilter>;

export const EnumAccountStatusFilterSchema: z.ZodType<Prisma.EnumAccountStatusFilter> = z.object({
  equals: z.lazy(() => AccountStatusSchema).optional(),
  in: z.lazy(() => AccountStatusSchema).array().optional(),
  notIn: z.lazy(() => AccountStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => NestedEnumAccountStatusFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.EnumAccountStatusFilter>;

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.DateTimeFilter>;

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.BoolFilter>;

export const SubscriptionNullableRelationFilterSchema: z.ZodType<Prisma.SubscriptionNullableRelationFilter> = z.object({
  is: z.lazy(() => SubscriptionWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SubscriptionWhereInputSchema).optional().nullable()
}).strict() as z.ZodType<Prisma.SubscriptionNullableRelationFilter>;

export const ProductListRelationFilterSchema: z.ZodType<Prisma.ProductListRelationFilter> = z.object({
  every: z.lazy(() => ProductWhereInputSchema).optional(),
  some: z.lazy(() => ProductWhereInputSchema).optional(),
  none: z.lazy(() => ProductWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ProductListRelationFilter>;

export const NotificationListRelationFilterSchema: z.ZodType<Prisma.NotificationListRelationFilter> = z.object({
  every: z.lazy(() => NotificationWhereInputSchema).optional(),
  some: z.lazy(() => NotificationWhereInputSchema).optional(),
  none: z.lazy(() => NotificationWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationListRelationFilter>;

export const ListingListRelationFilterSchema: z.ZodType<Prisma.ListingListRelationFilter> = z.object({
  every: z.lazy(() => ListingWhereInputSchema).optional(),
  some: z.lazy(() => ListingWhereInputSchema).optional(),
  none: z.lazy(() => ListingWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingListRelationFilter>;

export const ReservationListRelationFilterSchema: z.ZodType<Prisma.ReservationListRelationFilter> = z.object({
  every: z.lazy(() => ReservationWhereInputSchema).optional(),
  some: z.lazy(() => ReservationWhereInputSchema).optional(),
  none: z.lazy(() => ReservationWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationListRelationFilter>;

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SortOrderInput>;

export const ProductOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ProductOrderByRelationAggregateInput>;

export const NotificationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.NotificationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationOrderByRelationAggregateInput>;

export const ListingOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ListingOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ListingOrderByRelationAggregateInput>;

export const ReservationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ReservationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationOrderByRelationAggregateInput>;

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  given_name: z.lazy(() => SortOrderSchema).optional(),
  family_name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  userRole: z.lazy(() => SortOrderSchema).optional(),
  accountStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  colorScheme: z.lazy(() => SortOrderSchema).optional(),
  connectedAccountId: z.lazy(() => SortOrderSchema).optional(),
  stripeConnectedLinked: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserCountOrderByAggregateInput>;

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  given_name: z.lazy(() => SortOrderSchema).optional(),
  family_name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  userRole: z.lazy(() => SortOrderSchema).optional(),
  accountStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  colorScheme: z.lazy(() => SortOrderSchema).optional(),
  connectedAccountId: z.lazy(() => SortOrderSchema).optional(),
  stripeConnectedLinked: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserMaxOrderByAggregateInput>;

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  given_name: z.lazy(() => SortOrderSchema).optional(),
  family_name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  userRole: z.lazy(() => SortOrderSchema).optional(),
  accountStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  colorScheme: z.lazy(() => SortOrderSchema).optional(),
  connectedAccountId: z.lazy(() => SortOrderSchema).optional(),
  stripeConnectedLinked: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserMinOrderByAggregateInput>;

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict() as z.ZodType<Prisma.StringWithAggregatesFilter>;

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.StringNullableWithAggregatesFilter>;

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict() as z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter>;

export const EnumAccountStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAccountStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AccountStatusSchema).optional(),
  in: z.lazy(() => AccountStatusSchema).array().optional(),
  notIn: z.lazy(() => AccountStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => NestedEnumAccountStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAccountStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAccountStatusFilterSchema).optional()
}).strict() as z.ZodType<Prisma.EnumAccountStatusWithAggregatesFilter>;

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict() as z.ZodType<Prisma.DateTimeWithAggregatesFilter>;

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict() as z.ZodType<Prisma.BoolWithAggregatesFilter>;

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserRelationFilter>;

export const NotificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationCountOrderByAggregateInput>;

export const NotificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationMaxOrderByAggregateInput>;

export const NotificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.NotificationMinOrderByAggregateInput>;

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.IntNullableFilter>;

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.IntFilter>;

export const ListingCountOrderByAggregateInputSchema: z.ZodType<Prisma.ListingCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageSrc: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  bathroomCount: z.lazy(() => SortOrderSchema).optional(),
  guestCount: z.lazy(() => SortOrderSchema).optional(),
  locationValue: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  featureOne: z.lazy(() => SortOrderSchema).optional(),
  featureTwo: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ListingCountOrderByAggregateInput>;

export const ListingAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ListingAvgOrderByAggregateInput> = z.object({
  bathroomCount: z.lazy(() => SortOrderSchema).optional(),
  guestCount: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ListingAvgOrderByAggregateInput>;

export const ListingMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ListingMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageSrc: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  bathroomCount: z.lazy(() => SortOrderSchema).optional(),
  guestCount: z.lazy(() => SortOrderSchema).optional(),
  locationValue: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  featureOne: z.lazy(() => SortOrderSchema).optional(),
  featureTwo: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ListingMaxOrderByAggregateInput>;

export const ListingMinOrderByAggregateInputSchema: z.ZodType<Prisma.ListingMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageSrc: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  bathroomCount: z.lazy(() => SortOrderSchema).optional(),
  guestCount: z.lazy(() => SortOrderSchema).optional(),
  locationValue: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  featureOne: z.lazy(() => SortOrderSchema).optional(),
  featureTwo: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ListingMinOrderByAggregateInput>;

export const ListingSumOrderByAggregateInputSchema: z.ZodType<Prisma.ListingSumOrderByAggregateInput> = z.object({
  bathroomCount: z.lazy(() => SortOrderSchema).optional(),
  guestCount: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ListingSumOrderByAggregateInput>;

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.IntNullableWithAggregatesFilter>;

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict() as z.ZodType<Prisma.IntWithAggregatesFilter>;

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.DateTimeNullableFilter>;

export const ListingRelationFilterSchema: z.ZodType<Prisma.ListingRelationFilter> = z.object({
  is: z.lazy(() => ListingWhereInputSchema).optional(),
  isNot: z.lazy(() => ListingWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingRelationFilter>;

export const ReservationCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  listingId: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  totalPrice: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationCountOrderByAggregateInput>;

export const ReservationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationAvgOrderByAggregateInput> = z.object({
  totalPrice: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationAvgOrderByAggregateInput>;

export const ReservationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  listingId: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  totalPrice: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationMaxOrderByAggregateInput>;

export const ReservationMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  listingId: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  totalPrice: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationMinOrderByAggregateInput>;

export const ReservationSumOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationSumOrderByAggregateInput> = z.object({
  totalPrice: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationSumOrderByAggregateInput>;

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter>;

export const SubscriptionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionCountOrderByAggregateInput> = z.object({
  stripeSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  interval: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  planName: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodStart: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodEnd: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionCountOrderByAggregateInput>;

export const SubscriptionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionAvgOrderByAggregateInput> = z.object({
  currentPeriodStart: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodEnd: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionAvgOrderByAggregateInput>;

export const SubscriptionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionMaxOrderByAggregateInput> = z.object({
  stripeSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  interval: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  planName: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodStart: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodEnd: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionMaxOrderByAggregateInput>;

export const SubscriptionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionMinOrderByAggregateInput> = z.object({
  stripeSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  interval: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  planName: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodStart: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodEnd: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionMinOrderByAggregateInput>;

export const SubscriptionSumOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionSumOrderByAggregateInput> = z.object({
  currentPeriodStart: z.lazy(() => SortOrderSchema).optional(),
  currentPeriodEnd: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionSumOrderByAggregateInput>;

export const AppConfigCountOrderByAggregateInputSchema: z.ZodType<Prisma.AppConfigCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  maxActiveUser: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.AppConfigCountOrderByAggregateInput>;

export const AppConfigAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AppConfigAvgOrderByAggregateInput> = z.object({
  maxActiveUser: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.AppConfigAvgOrderByAggregateInput>;

export const AppConfigMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AppConfigMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  maxActiveUser: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.AppConfigMaxOrderByAggregateInput>;

export const AppConfigMinOrderByAggregateInputSchema: z.ZodType<Prisma.AppConfigMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  maxActiveUser: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.AppConfigMinOrderByAggregateInput>;

export const AppConfigSumOrderByAggregateInputSchema: z.ZodType<Prisma.AppConfigSumOrderByAggregateInput> = z.object({
  maxActiveUser: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.AppConfigSumOrderByAggregateInput>;

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict() as z.ZodType<Prisma.JsonFilter>;

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict() as z.ZodType<Prisma.StringNullableListFilter>;

export const EnumCategoryTypesFilterSchema: z.ZodType<Prisma.EnumCategoryTypesFilter> = z.object({
  equals: z.lazy(() => CategoryTypesSchema).optional(),
  in: z.lazy(() => CategoryTypesSchema).array().optional(),
  notIn: z.lazy(() => CategoryTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => NestedEnumCategoryTypesFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.EnumCategoryTypesFilter>;

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict() as z.ZodType<Prisma.UserNullableRelationFilter>;

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  smallDescription: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  productFile: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ProductCountOrderByAggregateInput>;

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ProductAvgOrderByAggregateInput>;

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  smallDescription: z.lazy(() => SortOrderSchema).optional(),
  productFile: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ProductMaxOrderByAggregateInput>;

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  smallDescription: z.lazy(() => SortOrderSchema).optional(),
  productFile: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ProductMinOrderByAggregateInput>;

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ProductSumOrderByAggregateInput>;

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict() as z.ZodType<Prisma.JsonWithAggregatesFilter>;

export const EnumCategoryTypesWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCategoryTypesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CategoryTypesSchema).optional(),
  in: z.lazy(() => CategoryTypesSchema).array().optional(),
  notIn: z.lazy(() => CategoryTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => NestedEnumCategoryTypesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCategoryTypesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCategoryTypesFilterSchema).optional()
}).strict() as z.ZodType<Prisma.EnumCategoryTypesWithAggregatesFilter>;

export const SubscriptionCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionCreateNestedOneWithoutUserInput>;

export const ProductCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutUserInputSchema),z.lazy(() => ProductCreateWithoutUserInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductCreateNestedManyWithoutUserInput>;

export const NotificationCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.NotificationCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => NotificationCreateWithoutUserInputSchema),z.lazy(() => NotificationCreateWithoutUserInputSchema).array(),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema),z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationCreateNestedManyWithoutUserInput>;

export const ListingCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ListingCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ListingCreateWithoutUserInputSchema),z.lazy(() => ListingCreateWithoutUserInputSchema).array(),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema),z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListingCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ListingCreateNestedManyWithoutUserInput>;

export const ReservationCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReservationCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutUserInputSchema),z.lazy(() => ReservationCreateWithoutUserInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationCreateNestedManyWithoutUserInput>;

export const SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput>;

export const ProductUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutUserInputSchema),z.lazy(() => ProductCreateWithoutUserInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutUserInput>;

export const NotificationUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => NotificationCreateWithoutUserInputSchema),z.lazy(() => NotificationCreateWithoutUserInputSchema).array(),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema),z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput>;

export const ListingUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ListingUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ListingCreateWithoutUserInputSchema),z.lazy(() => ListingCreateWithoutUserInputSchema).array(),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema),z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListingCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ListingUncheckedCreateNestedManyWithoutUserInput>;

export const ReservationUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutUserInputSchema),z.lazy(() => ReservationCreateWithoutUserInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedCreateNestedManyWithoutUserInput>;

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict() as z.ZodType<Prisma.StringFieldUpdateOperationsInput>;

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict() as z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput>;

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRoleSchema).optional()
}).strict() as z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput>;

export const EnumAccountStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAccountStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AccountStatusSchema).optional()
}).strict() as z.ZodType<Prisma.EnumAccountStatusFieldUpdateOperationsInput>;

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict() as z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput>;

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict() as z.ZodType<Prisma.BoolFieldUpdateOperationsInput>;

export const SubscriptionUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.SubscriptionUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => SubscriptionUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SubscriptionUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUpdateOneWithoutUserNestedInput>;

export const ProductUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutUserInputSchema),z.lazy(() => ProductCreateWithoutUserInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUpdateManyWithoutUserNestedInput>;

export const NotificationUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.NotificationUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => NotificationCreateWithoutUserInputSchema),z.lazy(() => NotificationCreateWithoutUserInputSchema).array(),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema),z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => NotificationUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => NotificationUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => NotificationUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => NotificationUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => NotificationUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => NotificationUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => NotificationScalarWhereInputSchema),z.lazy(() => NotificationScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUpdateManyWithoutUserNestedInput>;

export const ListingUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ListingUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ListingCreateWithoutUserInputSchema),z.lazy(() => ListingCreateWithoutUserInputSchema).array(),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema),z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ListingUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ListingUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListingCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ListingUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ListingUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ListingUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ListingUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ListingScalarWhereInputSchema),z.lazy(() => ListingScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ListingUpdateManyWithoutUserNestedInput>;

export const ReservationUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReservationUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutUserInputSchema),z.lazy(() => ReservationCreateWithoutUserInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReservationUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReservationUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReservationUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReservationUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReservationUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReservationUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationUpdateManyWithoutUserNestedInput>;

export const SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => SubscriptionUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SubscriptionUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput>;

export const ProductUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutUserInputSchema),z.lazy(() => ProductCreateWithoutUserInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProductCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutUserNestedInput>;

export const NotificationUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => NotificationCreateWithoutUserInputSchema),z.lazy(() => NotificationCreateWithoutUserInputSchema).array(),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema),z.lazy(() => NotificationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => NotificationUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => NotificationUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => NotificationWhereUniqueInputSchema),z.lazy(() => NotificationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => NotificationUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => NotificationUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => NotificationUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => NotificationUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => NotificationScalarWhereInputSchema),z.lazy(() => NotificationScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput>;

export const ListingUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ListingUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ListingCreateWithoutUserInputSchema),z.lazy(() => ListingCreateWithoutUserInputSchema).array(),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema),z.lazy(() => ListingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ListingUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ListingUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListingCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ListingWhereUniqueInputSchema),z.lazy(() => ListingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ListingUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ListingUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ListingUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ListingUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ListingScalarWhereInputSchema),z.lazy(() => ListingScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ListingUncheckedUpdateManyWithoutUserNestedInput>;

export const ReservationUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutUserInputSchema),z.lazy(() => ReservationCreateWithoutUserInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReservationUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReservationUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReservationUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReservationUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReservationUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReservationUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutUserNestedInput>;

export const UserCreateNestedOneWithoutNotificationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutNotificationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutNotificationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutNotificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutNotificationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutNotificationsInput>;

export const UserUpdateOneRequiredWithoutNotificationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutNotificationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutNotificationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutNotificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutNotificationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutNotificationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutNotificationsInputSchema),z.lazy(() => UserUpdateWithoutNotificationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutNotificationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutNotificationsNestedInput>;

export const UserCreateNestedOneWithoutListingsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutListingsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutListingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutListingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutListingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutListingsInput>;

export const ReservationCreateNestedManyWithoutListingInputSchema: z.ZodType<Prisma.ReservationCreateNestedManyWithoutListingInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutListingInputSchema),z.lazy(() => ReservationCreateWithoutListingInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyListingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationCreateNestedManyWithoutListingInput>;

export const ReservationUncheckedCreateNestedManyWithoutListingInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateNestedManyWithoutListingInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutListingInputSchema),z.lazy(() => ReservationCreateWithoutListingInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyListingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedCreateNestedManyWithoutListingInput>;

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict() as z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput>;

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict() as z.ZodType<Prisma.IntFieldUpdateOperationsInput>;

export const UserUpdateOneRequiredWithoutListingsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutListingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutListingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutListingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutListingsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutListingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutListingsInputSchema),z.lazy(() => UserUpdateWithoutListingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutListingsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutListingsNestedInput>;

export const ReservationUpdateManyWithoutListingNestedInputSchema: z.ZodType<Prisma.ReservationUpdateManyWithoutListingNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutListingInputSchema),z.lazy(() => ReservationCreateWithoutListingInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReservationUpsertWithWhereUniqueWithoutListingInputSchema),z.lazy(() => ReservationUpsertWithWhereUniqueWithoutListingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyListingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReservationUpdateWithWhereUniqueWithoutListingInputSchema),z.lazy(() => ReservationUpdateWithWhereUniqueWithoutListingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReservationUpdateManyWithWhereWithoutListingInputSchema),z.lazy(() => ReservationUpdateManyWithWhereWithoutListingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationUpdateManyWithoutListingNestedInput>;

export const ReservationUncheckedUpdateManyWithoutListingNestedInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutListingNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutListingInputSchema),z.lazy(() => ReservationCreateWithoutListingInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutListingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReservationUpsertWithWhereUniqueWithoutListingInputSchema),z.lazy(() => ReservationUpsertWithWhereUniqueWithoutListingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyListingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReservationUpdateWithWhereUniqueWithoutListingInputSchema),z.lazy(() => ReservationUpdateWithWhereUniqueWithoutListingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReservationUpdateManyWithWhereWithoutListingInputSchema),z.lazy(() => ReservationUpdateManyWithWhereWithoutListingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutListingNestedInput>;

export const UserCreateNestedOneWithoutReservationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReservationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReservationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReservationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReservationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutReservationsInput>;

export const ListingCreateNestedOneWithoutReservationsInputSchema: z.ZodType<Prisma.ListingCreateNestedOneWithoutReservationsInput> = z.object({
  create: z.union([ z.lazy(() => ListingCreateWithoutReservationsInputSchema),z.lazy(() => ListingUncheckedCreateWithoutReservationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ListingCreateOrConnectWithoutReservationsInputSchema).optional(),
  connect: z.lazy(() => ListingWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingCreateNestedOneWithoutReservationsInput>;

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput>;

export const UserUpdateOneRequiredWithoutReservationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutReservationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReservationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReservationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReservationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReservationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReservationsInputSchema),z.lazy(() => UserUpdateWithoutReservationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReservationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutReservationsNestedInput>;

export const ListingUpdateOneRequiredWithoutReservationsNestedInputSchema: z.ZodType<Prisma.ListingUpdateOneRequiredWithoutReservationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ListingCreateWithoutReservationsInputSchema),z.lazy(() => ListingUncheckedCreateWithoutReservationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ListingCreateOrConnectWithoutReservationsInputSchema).optional(),
  upsert: z.lazy(() => ListingUpsertWithoutReservationsInputSchema).optional(),
  connect: z.lazy(() => ListingWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ListingUpdateToOneWithWhereWithoutReservationsInputSchema),z.lazy(() => ListingUpdateWithoutReservationsInputSchema),z.lazy(() => ListingUncheckedUpdateWithoutReservationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ListingUpdateOneRequiredWithoutReservationsNestedInput>;

export const UserCreateNestedOneWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSubscriptionInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubscriptionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutSubscriptionInput>;

export const UserUpdateOneRequiredWithoutSubscriptionNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSubscriptionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubscriptionInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSubscriptionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSubscriptionInputSchema),z.lazy(() => UserUpdateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubscriptionInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutSubscriptionNestedInput>;

export const ProductCreateimagesInputSchema: z.ZodType<Prisma.ProductCreateimagesInput> = z.object({
  set: z.string().array()
}).strict() as z.ZodType<Prisma.ProductCreateimagesInput>;

export const UserCreateNestedOneWithoutProductInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProductInputSchema),z.lazy(() => UserUncheckedCreateWithoutProductInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProductInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutProductInput>;

export const ProductUpdateimagesInputSchema: z.ZodType<Prisma.ProductUpdateimagesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUpdateimagesInput>;

export const EnumCategoryTypesFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCategoryTypesFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CategoryTypesSchema).optional()
}).strict() as z.ZodType<Prisma.EnumCategoryTypesFieldUpdateOperationsInput>;

export const UserUpdateOneWithoutProductNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProductInputSchema),z.lazy(() => UserUncheckedCreateWithoutProductInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProductInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProductInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutProductInputSchema),z.lazy(() => UserUpdateWithoutProductInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProductInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateOneWithoutProductNestedInput>;

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedStringFilter>;

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.NestedStringNullableFilter>;

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedEnumUserRoleFilter>;

export const NestedEnumAccountStatusFilterSchema: z.ZodType<Prisma.NestedEnumAccountStatusFilter> = z.object({
  equals: z.lazy(() => AccountStatusSchema).optional(),
  in: z.lazy(() => AccountStatusSchema).array().optional(),
  notIn: z.lazy(() => AccountStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => NestedEnumAccountStatusFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedEnumAccountStatusFilter>;

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedDateTimeFilter>;

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedBoolFilter>;

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedStringWithAggregatesFilter>;

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedIntFilter>;

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter>;

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.NestedIntNullableFilter>;

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter>;

export const NestedEnumAccountStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAccountStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AccountStatusSchema).optional(),
  in: z.lazy(() => AccountStatusSchema).array().optional(),
  notIn: z.lazy(() => AccountStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => NestedEnumAccountStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAccountStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAccountStatusFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedEnumAccountStatusWithAggregatesFilter>;

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter>;

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedBoolWithAggregatesFilter>;

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter>;

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.NestedFloatNullableFilter>;

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedIntWithAggregatesFilter>;

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedFloatFilter>;

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.NestedDateTimeNullableFilter>;

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter>;

export const NestedEnumCategoryTypesFilterSchema: z.ZodType<Prisma.NestedEnumCategoryTypesFilter> = z.object({
  equals: z.lazy(() => CategoryTypesSchema).optional(),
  in: z.lazy(() => CategoryTypesSchema).array().optional(),
  notIn: z.lazy(() => CategoryTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => NestedEnumCategoryTypesFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedEnumCategoryTypesFilter>;

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict() as z.ZodType<Prisma.NestedJsonFilter>;

export const NestedEnumCategoryTypesWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCategoryTypesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CategoryTypesSchema).optional(),
  in: z.lazy(() => CategoryTypesSchema).array().optional(),
  notIn: z.lazy(() => CategoryTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => NestedEnumCategoryTypesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCategoryTypesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCategoryTypesFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedEnumCategoryTypesWithAggregatesFilter>;

export const SubscriptionCreateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionCreateWithoutUserInput> = z.object({
  stripeSubscriptionId: z.string(),
  interval: z.string(),
  status: z.string(),
  planId: z.string(),
  planName: z.string().optional().nullable(),
  currentPeriodStart: z.number().int(),
  currentPeriodEnd: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict() as z.ZodType<Prisma.SubscriptionCreateWithoutUserInput>;

export const SubscriptionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateWithoutUserInput> = z.object({
  stripeSubscriptionId: z.string(),
  interval: z.string(),
  status: z.string(),
  planId: z.string(),
  planName: z.string().optional().nullable(),
  currentPeriodStart: z.number().int(),
  currentPeriodEnd: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict() as z.ZodType<Prisma.SubscriptionUncheckedCreateWithoutUserInput>;

export const SubscriptionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SubscriptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubscriptionCreateOrConnectWithoutUserInput>;

export const ProductCreateWithoutUserInputSchema: z.ZodType<Prisma.ProductCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  price: z.number().int(),
  smallDescription: z.string(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  images: z.union([ z.lazy(() => ProductCreateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.string(),
  category: z.lazy(() => CategoryTypesSchema),
  createdAt: z.coerce.date().optional()
}).strict() as z.ZodType<Prisma.ProductCreateWithoutUserInput>;

export const ProductUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  price: z.number().int(),
  smallDescription: z.string(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  images: z.union([ z.lazy(() => ProductCreateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.string(),
  category: z.lazy(() => CategoryTypesSchema),
  createdAt: z.coerce.date().optional()
}).strict() as z.ZodType<Prisma.ProductUncheckedCreateWithoutUserInput>;

export const ProductCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutUserInputSchema),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ProductCreateOrConnectWithoutUserInput>;

export const ProductCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ProductCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductCreateManyUserInputSchema),z.lazy(() => ProductCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict() as z.ZodType<Prisma.ProductCreateManyUserInputEnvelope>;

export const NotificationCreateWithoutUserInputSchema: z.ZodType<Prisma.NotificationCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  isRead: z.boolean().optional()
}).strict() as z.ZodType<Prisma.NotificationCreateWithoutUserInput>;

export const NotificationUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  isRead: z.boolean().optional()
}).strict() as z.ZodType<Prisma.NotificationUncheckedCreateWithoutUserInput>;

export const NotificationCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.NotificationCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => NotificationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => NotificationCreateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.NotificationCreateOrConnectWithoutUserInput>;

export const NotificationCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.NotificationCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => NotificationCreateManyUserInputSchema),z.lazy(() => NotificationCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict() as z.ZodType<Prisma.NotificationCreateManyUserInputEnvelope>;

export const ListingCreateWithoutUserInputSchema: z.ZodType<Prisma.ListingCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutListingInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingCreateWithoutUserInput>;

export const ListingUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ListingUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutListingInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUncheckedCreateWithoutUserInput>;

export const ListingCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ListingCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ListingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ListingCreateWithoutUserInputSchema),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ListingCreateOrConnectWithoutUserInput>;

export const ListingCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ListingCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ListingCreateManyUserInputSchema),z.lazy(() => ListingCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict() as z.ZodType<Prisma.ListingCreateManyUserInputEnvelope>;

export const ReservationCreateWithoutUserInputSchema: z.ZodType<Prisma.ReservationCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable(),
  listing: z.lazy(() => ListingCreateNestedOneWithoutReservationsInputSchema)
}).strict() as z.ZodType<Prisma.ReservationCreateWithoutUserInput>;

export const ReservationUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  listingId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.ReservationUncheckedCreateWithoutUserInput>;

export const ReservationCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ReservationCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReservationCreateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationCreateOrConnectWithoutUserInput>;

export const ReservationCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ReservationCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReservationCreateManyUserInputSchema),z.lazy(() => ReservationCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict() as z.ZodType<Prisma.ReservationCreateManyUserInputEnvelope>;

export const SubscriptionUpsertWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => SubscriptionWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubscriptionUpsertWithoutUserInput>;

export const SubscriptionUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SubscriptionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubscriptionUpdateToOneWithWhereWithoutUserInput>;

export const SubscriptionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUpdateWithoutUserInput> = z.object({
  stripeSubscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  interval: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentPeriodStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currentPeriodEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUpdateWithoutUserInput>;

export const SubscriptionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateWithoutUserInput> = z.object({
  stripeSubscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  interval: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentPeriodStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currentPeriodEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;

export const ProductUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutUserInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutUserInputSchema),z.lazy(() => ProductUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutUserInput>;

export const ProductUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutUserInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutUserInput>;

export const ProductUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema),z.lazy(() => ProductUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutUserInput>;

export const ProductScalarWhereInputSchema: z.ZodType<Prisma.ProductScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  smallDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.lazy(() => JsonFilterSchema).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  productFile: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryTypesFilterSchema),z.lazy(() => CategoryTypesSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ProductScalarWhereInput>;

export const NotificationUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.NotificationUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => NotificationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => NotificationUpdateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => NotificationCreateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.NotificationUpsertWithWhereUniqueWithoutUserInput>;

export const NotificationUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.NotificationUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => NotificationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => NotificationUpdateWithoutUserInputSchema),z.lazy(() => NotificationUncheckedUpdateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.NotificationUpdateWithWhereUniqueWithoutUserInput>;

export const NotificationUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.NotificationUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => NotificationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => NotificationUpdateManyMutationInputSchema),z.lazy(() => NotificationUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.NotificationUpdateManyWithWhereWithoutUserInput>;

export const NotificationScalarWhereInputSchema: z.ZodType<Prisma.NotificationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationScalarWhereInputSchema),z.lazy(() => NotificationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationScalarWhereInputSchema),z.lazy(() => NotificationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationScalarWhereInput>;

export const ListingUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ListingUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ListingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ListingUpdateWithoutUserInputSchema),z.lazy(() => ListingUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ListingCreateWithoutUserInputSchema),z.lazy(() => ListingUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ListingUpsertWithWhereUniqueWithoutUserInput>;

export const ListingUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ListingUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ListingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ListingUpdateWithoutUserInputSchema),z.lazy(() => ListingUncheckedUpdateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ListingUpdateWithWhereUniqueWithoutUserInput>;

export const ListingUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ListingUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ListingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ListingUpdateManyMutationInputSchema),z.lazy(() => ListingUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ListingUpdateManyWithWhereWithoutUserInput>;

export const ListingScalarWhereInputSchema: z.ZodType<Prisma.ListingScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ListingScalarWhereInputSchema),z.lazy(() => ListingScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListingScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListingScalarWhereInputSchema),z.lazy(() => ListingScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageSrc: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bathroomCount: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  guestCount: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  locationValue: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  featureOne: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  featureTwo: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ListingScalarWhereInput>;

export const ReservationUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReservationUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReservationUpdateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ReservationCreateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationUpsertWithWhereUniqueWithoutUserInput>;

export const ReservationUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReservationUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReservationUpdateWithoutUserInputSchema),z.lazy(() => ReservationUncheckedUpdateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationUpdateWithWhereUniqueWithoutUserInput>;

export const ReservationUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ReservationUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ReservationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReservationUpdateManyMutationInputSchema),z.lazy(() => ReservationUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationUpdateManyWithWhereWithoutUserInput>;

export const ReservationScalarWhereInputSchema: z.ZodType<Prisma.ReservationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  listingId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  totalPrice: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationScalarWhereInput>;

export const UserCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.UserCreateWithoutNotificationsInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateWithoutNotificationsInput>;

export const UserUncheckedCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutNotificationsInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutNotificationsInput>;

export const UserCreateOrConnectWithoutNotificationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutNotificationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutNotificationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutNotificationsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutNotificationsInput>;

export const UserUpsertWithoutNotificationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutNotificationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutNotificationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutNotificationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutNotificationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutNotificationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpsertWithoutNotificationsInput>;

export const UserUpdateToOneWithWhereWithoutNotificationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutNotificationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutNotificationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutNotificationsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutNotificationsInput>;

export const UserUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutNotificationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateWithoutNotificationsInput>;

export const UserUncheckedUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutNotificationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutNotificationsInput>;

export const UserCreateWithoutListingsInputSchema: z.ZodType<Prisma.UserCreateWithoutListingsInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateWithoutListingsInput>;

export const UserUncheckedCreateWithoutListingsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutListingsInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutListingsInput>;

export const UserCreateOrConnectWithoutListingsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutListingsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutListingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutListingsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutListingsInput>;

export const ReservationCreateWithoutListingInputSchema: z.ZodType<Prisma.ReservationCreateWithoutListingInput> = z.object({
  id: z.string().uuid().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutReservationsInputSchema)
}).strict() as z.ZodType<Prisma.ReservationCreateWithoutListingInput>;

export const ReservationUncheckedCreateWithoutListingInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateWithoutListingInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.ReservationUncheckedCreateWithoutListingInput>;

export const ReservationCreateOrConnectWithoutListingInputSchema: z.ZodType<Prisma.ReservationCreateOrConnectWithoutListingInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReservationCreateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationCreateOrConnectWithoutListingInput>;

export const ReservationCreateManyListingInputEnvelopeSchema: z.ZodType<Prisma.ReservationCreateManyListingInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReservationCreateManyListingInputSchema),z.lazy(() => ReservationCreateManyListingInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict() as z.ZodType<Prisma.ReservationCreateManyListingInputEnvelope>;

export const UserUpsertWithoutListingsInputSchema: z.ZodType<Prisma.UserUpsertWithoutListingsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutListingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutListingsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutListingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutListingsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpsertWithoutListingsInput>;

export const UserUpdateToOneWithWhereWithoutListingsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutListingsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutListingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutListingsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutListingsInput>;

export const UserUpdateWithoutListingsInputSchema: z.ZodType<Prisma.UserUpdateWithoutListingsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateWithoutListingsInput>;

export const UserUncheckedUpdateWithoutListingsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutListingsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutListingsInput>;

export const ReservationUpsertWithWhereUniqueWithoutListingInputSchema: z.ZodType<Prisma.ReservationUpsertWithWhereUniqueWithoutListingInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReservationUpdateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedUpdateWithoutListingInputSchema) ]),
  create: z.union([ z.lazy(() => ReservationCreateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutListingInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationUpsertWithWhereUniqueWithoutListingInput>;

export const ReservationUpdateWithWhereUniqueWithoutListingInputSchema: z.ZodType<Prisma.ReservationUpdateWithWhereUniqueWithoutListingInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReservationUpdateWithoutListingInputSchema),z.lazy(() => ReservationUncheckedUpdateWithoutListingInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationUpdateWithWhereUniqueWithoutListingInput>;

export const ReservationUpdateManyWithWhereWithoutListingInputSchema: z.ZodType<Prisma.ReservationUpdateManyWithWhereWithoutListingInput> = z.object({
  where: z.lazy(() => ReservationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReservationUpdateManyMutationInputSchema),z.lazy(() => ReservationUncheckedUpdateManyWithoutListingInputSchema) ]),
}).strict() as z.ZodType<Prisma.ReservationUpdateManyWithWhereWithoutListingInput>;

export const UserCreateWithoutReservationsInputSchema: z.ZodType<Prisma.UserCreateWithoutReservationsInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateWithoutReservationsInput>;

export const UserUncheckedCreateWithoutReservationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReservationsInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutReservationsInput>;

export const UserCreateOrConnectWithoutReservationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReservationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReservationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReservationsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutReservationsInput>;

export const ListingCreateWithoutReservationsInputSchema: z.ZodType<Prisma.ListingCreateWithoutReservationsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutListingsInputSchema)
}).strict() as z.ZodType<Prisma.ListingCreateWithoutReservationsInput>;

export const ListingUncheckedCreateWithoutReservationsInputSchema: z.ZodType<Prisma.ListingUncheckedCreateWithoutReservationsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  userId: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable()
}).strict() as z.ZodType<Prisma.ListingUncheckedCreateWithoutReservationsInput>;

export const ListingCreateOrConnectWithoutReservationsInputSchema: z.ZodType<Prisma.ListingCreateOrConnectWithoutReservationsInput> = z.object({
  where: z.lazy(() => ListingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ListingCreateWithoutReservationsInputSchema),z.lazy(() => ListingUncheckedCreateWithoutReservationsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ListingCreateOrConnectWithoutReservationsInput>;

export const UserUpsertWithoutReservationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutReservationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReservationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReservationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReservationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReservationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpsertWithoutReservationsInput>;

export const UserUpdateToOneWithWhereWithoutReservationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReservationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReservationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReservationsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReservationsInput>;

export const UserUpdateWithoutReservationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutReservationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateWithoutReservationsInput>;

export const UserUncheckedUpdateWithoutReservationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReservationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutReservationsInput>;

export const ListingUpsertWithoutReservationsInputSchema: z.ZodType<Prisma.ListingUpsertWithoutReservationsInput> = z.object({
  update: z.union([ z.lazy(() => ListingUpdateWithoutReservationsInputSchema),z.lazy(() => ListingUncheckedUpdateWithoutReservationsInputSchema) ]),
  create: z.union([ z.lazy(() => ListingCreateWithoutReservationsInputSchema),z.lazy(() => ListingUncheckedCreateWithoutReservationsInputSchema) ]),
  where: z.lazy(() => ListingWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUpsertWithoutReservationsInput>;

export const ListingUpdateToOneWithWhereWithoutReservationsInputSchema: z.ZodType<Prisma.ListingUpdateToOneWithWhereWithoutReservationsInput> = z.object({
  where: z.lazy(() => ListingWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ListingUpdateWithoutReservationsInputSchema),z.lazy(() => ListingUncheckedUpdateWithoutReservationsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ListingUpdateToOneWithWhereWithoutReservationsInput>;

export const ListingUpdateWithoutReservationsInputSchema: z.ZodType<Prisma.ListingUpdateWithoutReservationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutListingsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUpdateWithoutReservationsInput>;

export const ListingUncheckedUpdateWithoutReservationsInputSchema: z.ZodType<Prisma.ListingUncheckedUpdateWithoutReservationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ListingUncheckedUpdateWithoutReservationsInput>;

export const UserCreateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserCreateWithoutSubscriptionInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateWithoutSubscriptionInput>;

export const UserUncheckedCreateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSubscriptionInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutSubscriptionInput>;

export const UserCreateOrConnectWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSubscriptionInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutSubscriptionInput>;

export const UserUpsertWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUpsertWithoutSubscriptionInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubscriptionInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpsertWithoutSubscriptionInput>;

export const UserUpdateToOneWithWhereWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSubscriptionInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubscriptionInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSubscriptionInput>;

export const UserUpdateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUpdateWithoutSubscriptionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateWithoutSubscriptionInput>;

export const UserUncheckedUpdateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSubscriptionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutSubscriptionInput>;

export const UserCreateWithoutProductInputSchema: z.ZodType<Prisma.UserCreateWithoutProductInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateWithoutProductInput>;

export const UserUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProductInput> = z.object({
  id: z.string().uuid().optional(),
  given_name: z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),
  family_name: z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),
  stripeCustomerId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleSchema).optional(),
  accountStatus: z.lazy(() => AccountStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  colorScheme: z.string().optional(),
  connectedAccountId: z.string().optional().nullable(),
  stripeConnectedLinked: z.boolean().optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutProductInput>;

export const UserCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutProductInputSchema),z.lazy(() => UserUncheckedCreateWithoutProductInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutProductInput>;

export const UserUpsertWithoutProductInputSchema: z.ZodType<Prisma.UserUpsertWithoutProductInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutProductInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutProductInputSchema),z.lazy(() => UserUncheckedCreateWithoutProductInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpsertWithoutProductInput>;

export const UserUpdateToOneWithWhereWithoutProductInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutProductInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProductInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProductInput>;

export const UserUpdateWithoutProductInputSchema: z.ZodType<Prisma.UserUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateWithoutProductInput>;

export const UserUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  given_name: z.union([ z.string().min(3, { message: "First name must be at least 3 characters long." }).max(50, { message: "First name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  family_name: z.union([ z.string().min(3, { message: "Last name must be at least 3 characters long." }).max(50, { message: "Last name must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6, { message: "Password must be at least 6 characters long." }).max(50, { message: "Password must not exceed 50 characters." }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  accountStatus: z.union([ z.lazy(() => AccountStatusSchema),z.lazy(() => EnumAccountStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  colorScheme: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  connectedAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stripeConnectedLinked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  listings: z.lazy(() => ListingUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutProductInput>;

export const ProductCreateManyUserInputSchema: z.ZodType<Prisma.ProductCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  price: z.number().int(),
  smallDescription: z.string(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  images: z.union([ z.lazy(() => ProductCreateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.string(),
  category: z.lazy(() => CategoryTypesSchema),
  createdAt: z.coerce.date().optional()
}).strict() as z.ZodType<Prisma.ProductCreateManyUserInput>;

export const NotificationCreateManyUserInputSchema: z.ZodType<Prisma.NotificationCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  isRead: z.boolean().optional()
}).strict() as z.ZodType<Prisma.NotificationCreateManyUserInput>;

export const ListingCreateManyUserInputSchema: z.ZodType<Prisma.ListingCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  createdAt: z.coerce.date().optional(),
  category: z.string(),
  time: z.string().optional().nullable(),
  bathroomCount: z.number().int().optional().nullable(),
  guestCount: z.number().int().optional().nullable(),
  locationValue: z.string(),
  price: z.number().int(),
  featureOne: z.string().optional().nullable(),
  featureTwo: z.string().optional().nullable()
}).strict() as z.ZodType<Prisma.ListingCreateManyUserInput>;

export const ReservationCreateManyUserInputSchema: z.ZodType<Prisma.ReservationCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  listingId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.ReservationCreateManyUserInput>;

export const ProductUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProductUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  smallDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  images: z.union([ z.lazy(() => ProductUpdateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => EnumCategoryTypesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUpdateWithoutUserInput>;

export const ProductUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  smallDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  images: z.union([ z.lazy(() => ProductUpdateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => EnumCategoryTypesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUncheckedUpdateWithoutUserInput>;

export const ProductUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  smallDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  images: z.union([ z.lazy(() => ProductUpdateimagesInputSchema),z.string().array() ]).optional(),
  productFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryTypesSchema),z.lazy(() => EnumCategoryTypesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutUserInput>;

export const NotificationUpdateWithoutUserInputSchema: z.ZodType<Prisma.NotificationUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUpdateWithoutUserInput>;

export const NotificationUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUncheckedUpdateWithoutUserInput>;

export const NotificationUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutUserInput>;

export const ListingUpdateWithoutUserInputSchema: z.ZodType<Prisma.ListingUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutListingNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUpdateWithoutUserInput>;

export const ListingUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ListingUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutListingNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ListingUncheckedUpdateWithoutUserInput>;

export const ListingUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ListingUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageSrc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bathroomCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  guestCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationValue: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  featureOne: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  featureTwo: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ListingUncheckedUpdateManyWithoutUserInput>;

export const ReservationUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReservationUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  listing: z.lazy(() => ListingUpdateOneRequiredWithoutReservationsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationUpdateWithoutUserInput>;

export const ReservationUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateWithoutUserInput>;

export const ReservationUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutUserInput>;

export const ReservationCreateManyListingInputSchema: z.ZodType<Prisma.ReservationCreateManyListingInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  totalPrice: z.number().int(),
  createdAt: z.coerce.date().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.ReservationCreateManyListingInput>;

export const ReservationUpdateWithoutListingInputSchema: z.ZodType<Prisma.ReservationUpdateWithoutListingInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReservationsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ReservationUpdateWithoutListingInput>;

export const ReservationUncheckedUpdateWithoutListingInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateWithoutListingInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateWithoutListingInput>;

export const ReservationUncheckedUpdateManyWithoutListingInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutListingInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalPrice: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutListingInput>;

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.UserFindFirstArgs>;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.UserFindFirstOrThrowArgs>;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.UserFindManyArgs>;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.UserAggregateArgs>;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.UserGroupByArgs>;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserFindUniqueArgs>;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserFindUniqueOrThrowArgs>;

export const NotificationFindFirstArgsSchema: z.ZodType<Prisma.NotificationFindFirstArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  where: NotificationWhereInputSchema.optional(),
  orderBy: z.union([ NotificationOrderByWithRelationInputSchema.array(),NotificationOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationScalarFieldEnumSchema,NotificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationFindFirstArgs>;

export const NotificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.NotificationFindFirstOrThrowArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  where: NotificationWhereInputSchema.optional(),
  orderBy: z.union([ NotificationOrderByWithRelationInputSchema.array(),NotificationOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationScalarFieldEnumSchema,NotificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationFindFirstOrThrowArgs>;

export const NotificationFindManyArgsSchema: z.ZodType<Prisma.NotificationFindManyArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  where: NotificationWhereInputSchema.optional(),
  orderBy: z.union([ NotificationOrderByWithRelationInputSchema.array(),NotificationOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationScalarFieldEnumSchema,NotificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.NotificationFindManyArgs>;

export const NotificationAggregateArgsSchema: z.ZodType<Prisma.NotificationAggregateArgs> = z.object({
  where: NotificationWhereInputSchema.optional(),
  orderBy: z.union([ NotificationOrderByWithRelationInputSchema.array(),NotificationOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.NotificationAggregateArgs>;

export const NotificationGroupByArgsSchema: z.ZodType<Prisma.NotificationGroupByArgs> = z.object({
  where: NotificationWhereInputSchema.optional(),
  orderBy: z.union([ NotificationOrderByWithAggregationInputSchema.array(),NotificationOrderByWithAggregationInputSchema ]).optional(),
  by: NotificationScalarFieldEnumSchema.array(),
  having: NotificationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.NotificationGroupByArgs>;

export const NotificationFindUniqueArgsSchema: z.ZodType<Prisma.NotificationFindUniqueArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  where: NotificationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.NotificationFindUniqueArgs>;

export const NotificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.NotificationFindUniqueOrThrowArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  where: NotificationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.NotificationFindUniqueOrThrowArgs>;

export const ListingFindFirstArgsSchema: z.ZodType<Prisma.ListingFindFirstArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  where: ListingWhereInputSchema.optional(),
  orderBy: z.union([ ListingOrderByWithRelationInputSchema.array(),ListingOrderByWithRelationInputSchema ]).optional(),
  cursor: ListingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ListingScalarFieldEnumSchema,ListingScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ListingFindFirstArgs>;

export const ListingFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ListingFindFirstOrThrowArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  where: ListingWhereInputSchema.optional(),
  orderBy: z.union([ ListingOrderByWithRelationInputSchema.array(),ListingOrderByWithRelationInputSchema ]).optional(),
  cursor: ListingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ListingScalarFieldEnumSchema,ListingScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ListingFindFirstOrThrowArgs>;

export const ListingFindManyArgsSchema: z.ZodType<Prisma.ListingFindManyArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  where: ListingWhereInputSchema.optional(),
  orderBy: z.union([ ListingOrderByWithRelationInputSchema.array(),ListingOrderByWithRelationInputSchema ]).optional(),
  cursor: ListingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ListingScalarFieldEnumSchema,ListingScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ListingFindManyArgs>;

export const ListingAggregateArgsSchema: z.ZodType<Prisma.ListingAggregateArgs> = z.object({
  where: ListingWhereInputSchema.optional(),
  orderBy: z.union([ ListingOrderByWithRelationInputSchema.array(),ListingOrderByWithRelationInputSchema ]).optional(),
  cursor: ListingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ListingAggregateArgs>;

export const ListingGroupByArgsSchema: z.ZodType<Prisma.ListingGroupByArgs> = z.object({
  where: ListingWhereInputSchema.optional(),
  orderBy: z.union([ ListingOrderByWithAggregationInputSchema.array(),ListingOrderByWithAggregationInputSchema ]).optional(),
  by: ListingScalarFieldEnumSchema.array(),
  having: ListingScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ListingGroupByArgs>;

export const ListingFindUniqueArgsSchema: z.ZodType<Prisma.ListingFindUniqueArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  where: ListingWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListingFindUniqueArgs>;

export const ListingFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ListingFindUniqueOrThrowArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  where: ListingWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListingFindUniqueOrThrowArgs>;

export const ReservationFindFirstArgsSchema: z.ZodType<Prisma.ReservationFindFirstArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReservationScalarFieldEnumSchema,ReservationScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationFindFirstArgs>;

export const ReservationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReservationFindFirstOrThrowArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReservationScalarFieldEnumSchema,ReservationScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationFindFirstOrThrowArgs>;

export const ReservationFindManyArgsSchema: z.ZodType<Prisma.ReservationFindManyArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReservationScalarFieldEnumSchema,ReservationScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ReservationFindManyArgs>;

export const ReservationAggregateArgsSchema: z.ZodType<Prisma.ReservationAggregateArgs> = z.object({
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ReservationAggregateArgs>;

export const ReservationGroupByArgsSchema: z.ZodType<Prisma.ReservationGroupByArgs> = z.object({
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithAggregationInputSchema.array(),ReservationOrderByWithAggregationInputSchema ]).optional(),
  by: ReservationScalarFieldEnumSchema.array(),
  having: ReservationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ReservationGroupByArgs>;

export const ReservationFindUniqueArgsSchema: z.ZodType<Prisma.ReservationFindUniqueArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ReservationFindUniqueArgs>;

export const ReservationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReservationFindUniqueOrThrowArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ReservationFindUniqueOrThrowArgs>;

export const SubscriptionFindFirstArgsSchema: z.ZodType<Prisma.SubscriptionFindFirstArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubscriptionScalarFieldEnumSchema,SubscriptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionFindFirstArgs>;

export const SubscriptionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SubscriptionFindFirstOrThrowArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubscriptionScalarFieldEnumSchema,SubscriptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionFindFirstOrThrowArgs>;

export const SubscriptionFindManyArgsSchema: z.ZodType<Prisma.SubscriptionFindManyArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubscriptionScalarFieldEnumSchema,SubscriptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubscriptionFindManyArgs>;

export const SubscriptionAggregateArgsSchema: z.ZodType<Prisma.SubscriptionAggregateArgs> = z.object({
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.SubscriptionAggregateArgs>;

export const SubscriptionGroupByArgsSchema: z.ZodType<Prisma.SubscriptionGroupByArgs> = z.object({
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithAggregationInputSchema.array(),SubscriptionOrderByWithAggregationInputSchema ]).optional(),
  by: SubscriptionScalarFieldEnumSchema.array(),
  having: SubscriptionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.SubscriptionGroupByArgs>;

export const SubscriptionFindUniqueArgsSchema: z.ZodType<Prisma.SubscriptionFindUniqueArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubscriptionFindUniqueArgs>;

export const SubscriptionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SubscriptionFindUniqueOrThrowArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubscriptionFindUniqueOrThrowArgs>;

export const AppConfigFindFirstArgsSchema: z.ZodType<Prisma.AppConfigFindFirstArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  where: AppConfigWhereInputSchema.optional(),
  orderBy: z.union([ AppConfigOrderByWithRelationInputSchema.array(),AppConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: AppConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AppConfigScalarFieldEnumSchema,AppConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigFindFirstArgs>;

export const AppConfigFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AppConfigFindFirstOrThrowArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  where: AppConfigWhereInputSchema.optional(),
  orderBy: z.union([ AppConfigOrderByWithRelationInputSchema.array(),AppConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: AppConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AppConfigScalarFieldEnumSchema,AppConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigFindFirstOrThrowArgs>;

export const AppConfigFindManyArgsSchema: z.ZodType<Prisma.AppConfigFindManyArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  where: AppConfigWhereInputSchema.optional(),
  orderBy: z.union([ AppConfigOrderByWithRelationInputSchema.array(),AppConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: AppConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AppConfigScalarFieldEnumSchema,AppConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.AppConfigFindManyArgs>;

export const AppConfigAggregateArgsSchema: z.ZodType<Prisma.AppConfigAggregateArgs> = z.object({
  where: AppConfigWhereInputSchema.optional(),
  orderBy: z.union([ AppConfigOrderByWithRelationInputSchema.array(),AppConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: AppConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.AppConfigAggregateArgs>;

export const AppConfigGroupByArgsSchema: z.ZodType<Prisma.AppConfigGroupByArgs> = z.object({
  where: AppConfigWhereInputSchema.optional(),
  orderBy: z.union([ AppConfigOrderByWithAggregationInputSchema.array(),AppConfigOrderByWithAggregationInputSchema ]).optional(),
  by: AppConfigScalarFieldEnumSchema.array(),
  having: AppConfigScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.AppConfigGroupByArgs>;

export const AppConfigFindUniqueArgsSchema: z.ZodType<Prisma.AppConfigFindUniqueArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  where: AppConfigWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.AppConfigFindUniqueArgs>;

export const AppConfigFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AppConfigFindUniqueOrThrowArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  where: AppConfigWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.AppConfigFindUniqueOrThrowArgs>;

export const ProductFindFirstArgsSchema: z.ZodType<Prisma.ProductFindFirstArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductFindFirstArgs>;

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductFindFirstOrThrowArgs>;

export const ProductFindManyArgsSchema: z.ZodType<Prisma.ProductFindManyArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ProductFindManyArgs>;

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ProductAggregateArgs>;

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(),ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(),
  having: ProductScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ProductGroupByArgs>;

export const ProductFindUniqueArgsSchema: z.ZodType<Prisma.ProductFindUniqueArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ProductFindUniqueArgs>;

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductFindUniqueOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ProductFindUniqueOrThrowArgs>;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.UserCreateArgs>;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.UserUpsertArgs>;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.UserCreateManyArgs>;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.UserCreateManyAndReturnArgs>;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserDeleteArgs>;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserUpdateArgs>;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.UserUpdateManyArgs>;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.UserDeleteManyArgs>;

export const NotificationCreateArgsSchema: z.ZodType<Prisma.NotificationCreateArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  data: z.union([ NotificationCreateInputSchema,NotificationUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.NotificationCreateArgs>;

export const NotificationUpsertArgsSchema: z.ZodType<Prisma.NotificationUpsertArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  where: NotificationWhereUniqueInputSchema,
  create: z.union([ NotificationCreateInputSchema,NotificationUncheckedCreateInputSchema ]),
  update: z.union([ NotificationUpdateInputSchema,NotificationUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.NotificationUpsertArgs>;

export const NotificationCreateManyArgsSchema: z.ZodType<Prisma.NotificationCreateManyArgs> = z.object({
  data: z.union([ NotificationCreateManyInputSchema,NotificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.NotificationCreateManyArgs>;

export const NotificationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationCreateManyAndReturnArgs> = z.object({
  data: z.union([ NotificationCreateManyInputSchema,NotificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.NotificationCreateManyAndReturnArgs>;

export const NotificationDeleteArgsSchema: z.ZodType<Prisma.NotificationDeleteArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  where: NotificationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.NotificationDeleteArgs>;

export const NotificationUpdateArgsSchema: z.ZodType<Prisma.NotificationUpdateArgs> = z.object({
  select: NotificationSelectSchema.optional(),
  include: NotificationIncludeSchema.optional(),
  data: z.union([ NotificationUpdateInputSchema,NotificationUncheckedUpdateInputSchema ]),
  where: NotificationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.NotificationUpdateArgs>;

export const NotificationUpdateManyArgsSchema: z.ZodType<Prisma.NotificationUpdateManyArgs> = z.object({
  data: z.union([ NotificationUpdateManyMutationInputSchema,NotificationUncheckedUpdateManyInputSchema ]),
  where: NotificationWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.NotificationUpdateManyArgs>;

export const NotificationDeleteManyArgsSchema: z.ZodType<Prisma.NotificationDeleteManyArgs> = z.object({
  where: NotificationWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.NotificationDeleteManyArgs>;

export const ListingCreateArgsSchema: z.ZodType<Prisma.ListingCreateArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  data: z.union([ ListingCreateInputSchema,ListingUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ListingCreateArgs>;

export const ListingUpsertArgsSchema: z.ZodType<Prisma.ListingUpsertArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  where: ListingWhereUniqueInputSchema,
  create: z.union([ ListingCreateInputSchema,ListingUncheckedCreateInputSchema ]),
  update: z.union([ ListingUpdateInputSchema,ListingUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ListingUpsertArgs>;

export const ListingCreateManyArgsSchema: z.ZodType<Prisma.ListingCreateManyArgs> = z.object({
  data: z.union([ ListingCreateManyInputSchema,ListingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.ListingCreateManyArgs>;

export const ListingCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ListingCreateManyAndReturnArgs> = z.object({
  data: z.union([ ListingCreateManyInputSchema,ListingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.ListingCreateManyAndReturnArgs>;

export const ListingDeleteArgsSchema: z.ZodType<Prisma.ListingDeleteArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  where: ListingWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListingDeleteArgs>;

export const ListingUpdateArgsSchema: z.ZodType<Prisma.ListingUpdateArgs> = z.object({
  select: ListingSelectSchema.optional(),
  include: ListingIncludeSchema.optional(),
  data: z.union([ ListingUpdateInputSchema,ListingUncheckedUpdateInputSchema ]),
  where: ListingWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListingUpdateArgs>;

export const ListingUpdateManyArgsSchema: z.ZodType<Prisma.ListingUpdateManyArgs> = z.object({
  data: z.union([ ListingUpdateManyMutationInputSchema,ListingUncheckedUpdateManyInputSchema ]),
  where: ListingWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ListingUpdateManyArgs>;

export const ListingDeleteManyArgsSchema: z.ZodType<Prisma.ListingDeleteManyArgs> = z.object({
  where: ListingWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ListingDeleteManyArgs>;

export const ReservationCreateArgsSchema: z.ZodType<Prisma.ReservationCreateArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  data: z.union([ ReservationCreateInputSchema,ReservationUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ReservationCreateArgs>;

export const ReservationUpsertArgsSchema: z.ZodType<Prisma.ReservationUpsertArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
  create: z.union([ ReservationCreateInputSchema,ReservationUncheckedCreateInputSchema ]),
  update: z.union([ ReservationUpdateInputSchema,ReservationUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ReservationUpsertArgs>;

export const ReservationCreateManyArgsSchema: z.ZodType<Prisma.ReservationCreateManyArgs> = z.object({
  data: z.union([ ReservationCreateManyInputSchema,ReservationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.ReservationCreateManyArgs>;

export const ReservationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ReservationCreateManyAndReturnArgs> = z.object({
  data: z.union([ ReservationCreateManyInputSchema,ReservationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.ReservationCreateManyAndReturnArgs>;

export const ReservationDeleteArgsSchema: z.ZodType<Prisma.ReservationDeleteArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ReservationDeleteArgs>;

export const ReservationUpdateArgsSchema: z.ZodType<Prisma.ReservationUpdateArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  data: z.union([ ReservationUpdateInputSchema,ReservationUncheckedUpdateInputSchema ]),
  where: ReservationWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ReservationUpdateArgs>;

export const ReservationUpdateManyArgsSchema: z.ZodType<Prisma.ReservationUpdateManyArgs> = z.object({
  data: z.union([ ReservationUpdateManyMutationInputSchema,ReservationUncheckedUpdateManyInputSchema ]),
  where: ReservationWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ReservationUpdateManyArgs>;

export const ReservationDeleteManyArgsSchema: z.ZodType<Prisma.ReservationDeleteManyArgs> = z.object({
  where: ReservationWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ReservationDeleteManyArgs>;

export const SubscriptionCreateArgsSchema: z.ZodType<Prisma.SubscriptionCreateArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  data: z.union([ SubscriptionCreateInputSchema,SubscriptionUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.SubscriptionCreateArgs>;

export const SubscriptionUpsertArgsSchema: z.ZodType<Prisma.SubscriptionUpsertArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
  create: z.union([ SubscriptionCreateInputSchema,SubscriptionUncheckedCreateInputSchema ]),
  update: z.union([ SubscriptionUpdateInputSchema,SubscriptionUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.SubscriptionUpsertArgs>;

export const SubscriptionCreateManyArgsSchema: z.ZodType<Prisma.SubscriptionCreateManyArgs> = z.object({
  data: z.union([ SubscriptionCreateManyInputSchema,SubscriptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.SubscriptionCreateManyArgs>;

export const SubscriptionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SubscriptionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SubscriptionCreateManyInputSchema,SubscriptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.SubscriptionCreateManyAndReturnArgs>;

export const SubscriptionDeleteArgsSchema: z.ZodType<Prisma.SubscriptionDeleteArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubscriptionDeleteArgs>;

export const SubscriptionUpdateArgsSchema: z.ZodType<Prisma.SubscriptionUpdateArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  data: z.union([ SubscriptionUpdateInputSchema,SubscriptionUncheckedUpdateInputSchema ]),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubscriptionUpdateArgs>;

export const SubscriptionUpdateManyArgsSchema: z.ZodType<Prisma.SubscriptionUpdateManyArgs> = z.object({
  data: z.union([ SubscriptionUpdateManyMutationInputSchema,SubscriptionUncheckedUpdateManyInputSchema ]),
  where: SubscriptionWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.SubscriptionUpdateManyArgs>;

export const SubscriptionDeleteManyArgsSchema: z.ZodType<Prisma.SubscriptionDeleteManyArgs> = z.object({
  where: SubscriptionWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.SubscriptionDeleteManyArgs>;

export const AppConfigCreateArgsSchema: z.ZodType<Prisma.AppConfigCreateArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  data: z.union([ AppConfigCreateInputSchema,AppConfigUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.AppConfigCreateArgs>;

export const AppConfigUpsertArgsSchema: z.ZodType<Prisma.AppConfigUpsertArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  where: AppConfigWhereUniqueInputSchema,
  create: z.union([ AppConfigCreateInputSchema,AppConfigUncheckedCreateInputSchema ]),
  update: z.union([ AppConfigUpdateInputSchema,AppConfigUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.AppConfigUpsertArgs>;

export const AppConfigCreateManyArgsSchema: z.ZodType<Prisma.AppConfigCreateManyArgs> = z.object({
  data: z.union([ AppConfigCreateManyInputSchema,AppConfigCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.AppConfigCreateManyArgs>;

export const AppConfigCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AppConfigCreateManyAndReturnArgs> = z.object({
  data: z.union([ AppConfigCreateManyInputSchema,AppConfigCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.AppConfigCreateManyAndReturnArgs>;

export const AppConfigDeleteArgsSchema: z.ZodType<Prisma.AppConfigDeleteArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  where: AppConfigWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.AppConfigDeleteArgs>;

export const AppConfigUpdateArgsSchema: z.ZodType<Prisma.AppConfigUpdateArgs> = z.object({
  select: AppConfigSelectSchema.optional(),
  data: z.union([ AppConfigUpdateInputSchema,AppConfigUncheckedUpdateInputSchema ]),
  where: AppConfigWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.AppConfigUpdateArgs>;

export const AppConfigUpdateManyArgsSchema: z.ZodType<Prisma.AppConfigUpdateManyArgs> = z.object({
  data: z.union([ AppConfigUpdateManyMutationInputSchema,AppConfigUncheckedUpdateManyInputSchema ]),
  where: AppConfigWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.AppConfigUpdateManyArgs>;

export const AppConfigDeleteManyArgsSchema: z.ZodType<Prisma.AppConfigDeleteManyArgs> = z.object({
  where: AppConfigWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.AppConfigDeleteManyArgs>;

export const ProductCreateArgsSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ProductCreateArgs>;

export const ProductUpsertArgsSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
  create: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ProductUpsertArgs>;

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.ProductCreateManyArgs>;

export const ProductCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.ProductCreateManyAndReturnArgs>;

export const ProductDeleteArgsSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ProductDeleteArgs>;

export const ProductUpdateArgsSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ProductUpdateArgs>;

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema,ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ProductUpdateManyArgs>;

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ProductDeleteManyArgs>;