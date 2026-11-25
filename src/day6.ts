// Day 6: Utility Types (Pick, Omit, Partial, Required, Readonly, Record)

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// 1. Pick (keep few keys) & Omit (remove few keys)
// Both derive from User, so changes to User stay in sync automatically.
// Note: Pick catches key typos; Omit does NOT.
{
  console.log("1. Pick & Omit");

  type UserSummary = Pick<User, "id" | "name">;
  type CreateUserInput = Omit<User, "id" | "createdAt">;
  type PublicUser = Omit<User, "password">;

  const summary: UserSummary = { id: 1, name: "Aneeq" };
  // const badSummary: UserSummary = { id: 1, name: "Ali", email: "a@b.com" }; <- Error: extra key
  // type TypoPick = Pick<User, "id" | "nme">; // Error: "nme" is not a key of User
  // type TypoOmit = Omit<User, "pasword">;    // No error! password is NOT removed

  // 2. types don't strip data at runtime — real code must transform it
  let nextId = 1;

  const createUser = (input: CreateUserInput): User => ({
    ...input,
    id: nextId++,
    createdAt: new Date(),
  });

  const toPublicUser = (user: User): PublicUser => {
    const { password: _password, ...rest } = user;
    return rest;
  };

  const toSummary = (user: User): UserSummary => ({
    id: user.id,
    name: user.name,
  });

  const newUser = createUser({
    name: "Aneeq",
    email: "aneeque@gmail.com",
    password: "testpassword",
  });

  const unsafePublic: PublicUser = newUser; // TypeScript allows this, but password is STILL there!
  const safePublic = toPublicUser(newUser);

  console.log("Summary:", summary, "| toSummary:", toSummary(newUser));
  console.log("Unsafe has password at runtime:", "password" in unsafePublic); // true
  console.log("Safe PublicUser:", safePublic);
  console.log("Safe has password at runtime:", "password" in safePublic); // false
}

// 3. Combining utility types & quick tour
{
  console.log("2. Combining & Other Utility Types");

  // Classic update DTO: everything optional except id & createdAt
  type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;
  const patch: UpdateUserInput = { name: "Aneeq" };

  // Readonly prevents reassignment; Record maps keys -> value type
  type ReadonlySummary = Readonly<Pick<User, "id" | "name">>;
  type RoleCounts = Record<"admin" | "user", number>;
  type ScoreMap = Record<string, number>;

  const locked: ReadonlySummary = { id: 1, name: "Aneeq" };

  const roles: RoleCounts = { admin: 2, user: 15 };
  const scores: ScoreMap = { math: 95, science: 88 };

  // How Pick works under the hood (mapped type + generics)
  type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  const customPicked: MyPick<User, "id" | "email"> = {
    id: 1,
    email: "aneeque@gmail.com",
  };

  console.log("UpdateUserInput:", patch);
  console.log("Readonly:", locked, "| Record:", roles, scores);
  console.log("MyPick:", customPicked);
}

// 4. Hands-on Task: Product DTOs & Transformations
{
  console.log("3. Hands-on Task (Product)");

  interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    costPrice: number; // private to the shop
    stock: number;
    createdAt: Date;
  }

  type ProductPreview = Pick<Product, "id" | "name" | "price">;
  type PublicProduct = Omit<Product, "costPrice">;
  type CreateProductInput = Omit<Product, "id" | "createdAt">;
  type UpdateProductInput = Partial<Omit<Product, "id" | "createdAt">>;

  let nextProductId = 1;

  const createProduct = (input: CreateProductInput): Product => ({
    ...input,
    id: nextProductId++,
    createdAt: new Date(),
  });

  const toPublicProduct = (product: Product): PublicProduct => {
    const { costPrice: _costPrice, ...rest } = product;
    return rest;
  };

  const toPreview = (product: Product): ProductPreview => ({
    id: product.id,
    name: product.name,
    price: product.price,
  });

  // Pure update: returns a new Product without mutating the original
  const updateProduct = (
    product: Product,
    changes: UpdateProductInput
  ): Product => ({
    ...product,
    ...changes,
  });

  const products: Product[] = [
    createProduct({
      name: "Mechanical Keyboard",
      price: 120,
      description: "Tactile switches",
      costPrice: 65,
      stock: 15,
    }),
    createProduct({
      name: "Wireless Mouse",
      price: 55,
      description: "Ergonomic 2.4GHz",
      costPrice: 25,
      stock: 30,
    }),
    createProduct({
      name: "USB-C Hub",
      price: 40,
      description: "7-in-1 aluminum adapter",
      costPrice: 18,
      stock: 50,
    }),
  ];

  const previews = products.map(toPreview);
  console.log("Previews:", previews);

  const firstProduct = products[0]!;
  const publicFirst = toPublicProduct(firstProduct);
  console.log("Public product:", publicFirst);
  console.log("costPrice still present?:", "costPrice" in publicFirst); // false

  const updatedFirst = updateProduct(firstProduct, { price: 99, stock: 10 });
  console.log("Updated price:", updatedFirst.price, "| Original price:", firstProduct.price);
}
