// Day 5: Generics in TypeScript

// 1. Generic function: <T> is a type placeholder filled in when called (unlike `any`, type safety is kept)
{
  console.log("1. Generic Function");

  function identity<T>(value: T): T {
    return value;
  }

  const a = identity("Aneeq"); 
  const b = identity(34);
  const c = identity<boolean>(true);

  console.log(a.toUpperCase(), b, c);
}

// 2. Generic interface: works with any type you pass in
{
  console.log("2. Generic Interface (Box<T>)");

  interface Box<T> {
    value: T;
  }

  const nameBox: Box<string> = { value: "Aneeq" };
  const ageBox: Box<number> = { value: 32 };

  console.log(nameBox, ageBox);
}

// 3. Shared models & ApiResponse<T> wrapper
// Named ApiResponse (not Response) to avoid clashing with the built-in Fetch API Response.
// `T = unknown` sets a default type if no type argument is provided.
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

interface User {
  id: number;
  name: string;
  age: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

// Helper functions: TypeScript infers T from `data`
function createSuccess<T>(data: T, message = "Success"): ApiResponse<T> {
  return { success: true, message, data };
}

function createError(message: string, error?: string): ApiResponse<null> {
  return {
    success: false,
    message,
    data: null,
    ...(error !== undefined ? { error } : {}),
  };
}

// 4. Reusing ApiResponse<T> with different data types
{
  console.log("\n--- 3. ApiResponse<T> Wrapper ---");

  const userRes = createSuccess<User>(
    { id: 1, name: "Aneeq", age: 32 },
    "User fetched"
  );
  const productsRes = createSuccess<Product[]>(
    [
      { id: 1, title: "Keyboard", price: 50 },
      { id: 2, title: "Mouse", price: 25 },
    ],
    "Products fetched"
  );
  const countRes = createSuccess(42, "Count fetched");
  const defaultRes: ApiResponse = { success: true, message: "ok", data: "anything" };
  const errorRes = createError("User not found", "NOT_FOUND");

  console.log("User name:", userRes.data.name);
  console.log("First product price:", productsRes.data[0]?.price);
  console.log("Count:", countRes.data);
  console.log("Default <unknown>:", defaultRes);
  console.log("Error:", errorRes);
}

// 5. Generic constraint with `extends`: restrict T to types that have an `id: number`
{
  console.log("\n--- 4. Constraints (extends) ---");

  interface HasId {
    id: number;
  }

  function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
  }

  const users: User[] = [
    { id: 1, name: "Aneeq", age: 32 },
    { id: 2, name: "Sara", age: 28 },
  ];

  console.log("Found user:", findById(users, 2));
}

// 6. Multiple type parameters
{
  console.log("\n--- 5. Multiple Type Parameters ---");

  interface Pair<K, V> {
    key: K;
    value: V;
  }

  const pair: Pair<string, number> = { key: "age", value: 32 };
  console.log("Pair:", pair);
}

// 7. Practice Exercises: PaginatedResponse<T>, getFirst<T>, and Promise<ApiResponse<User>>
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  totalPages: number;
  totalItems: number;
}

const getFirst = <T>(items: T[]): T | undefined => items[0];

const usersDb: User[] = [
  { id: 1, name: "Aneeq", age: 32 },
  { id: 2, name: "Ahmed", age: 28 },
];

const fetchUser = (id: number): Promise<ApiResponse<User | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = usersDb.find((u) => u.id === id);
      if (user) {
        resolve(createSuccess(user, "User fetched"));
      } else {
        resolve(createError(`User ${id} not found`, "USER_NOT_FOUND"));
      }
    }, 150);
  });
};

const runExercises = async (): Promise<void> => {
  console.log("\n--- 6. Practice Exercises ---");

  const pagedUsers: PaginatedResponse<User> = {
    success: true,
    message: "Users page fetched",
    data: usersDb,
    page: 1,
    totalPages: 1,
    totalItems: usersDb.length,
  };
  console.log("Paginated:", pagedUsers);

  console.log("getFirst(users):", getFirst(usersDb));
  console.log("getFirst([]):", getFirst([]));

  console.log("fetchUser(1):", await fetchUser(1));
  console.log("fetchUser(99):", await fetchUser(99));
};

runExercises();
