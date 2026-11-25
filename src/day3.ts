// A function in a block
{
  function add(a: number, b: number): number {
    return a + b;
  }

  console.log("add(2, 3):", add(2, 3));
}

// Arrow functions
// An arrow function is a shorter way to write a function.
{
  const addBlock = (a: number, b: number): number => {
    return a + b;
  };

  // Arrow function with implicit return (one expression, no `return` or `{ }`)
  const addShort = (a: number, b: number): number => a + b;
  console.log("addBlock(2, 3):", addBlock(2, 3));
  console.log("addShort(2, 3):", addShort(2, 3));
}

// Return types
{
  // Primitive return types
  const double = (n: number): number => n * 2;
  const greet = (name: string): string => `Hello, ${name}`;
  const isAdult = (age: number): boolean => age >= 18;

  console.log("double(4):", double(4));
  console.log('greet("Aneeq"):', greet("Aneeq"));
  console.log("isAdult(20):", isAdult(20));

  // void: returns nothing
  const logMessage = (msg: string): void => {
    console.log("logMessage:", msg);
  };
  logMessage("This function returns void.");

  // Returning objects: wrap the object literal in ( )
  interface User {
    id: number;
    name: string;
  }

  const createUser = (id: number, name: string): User => ({ id, name });
  const username = createUser(1, "Aneeq");
  console.log("createUser(1, 'Aneeq'):", username);

  // Returning arrays
  const getEvens = (nums: number[]): number[] => nums.filter((n) => n % 2 === 0);
  console.log("getEvens([1, 2, 3, 4]):", getEvens([1, 2, 3, 4]));

  // Returning a union 
  const findUser = (users: User[], id: number): User | undefined =>
    users.find((u) => u.id === id);

  console.log("findUser([aneeq], 1):", findUser([username], 1));
  console.log("findUser([aneeq], 99):", findUser([username], 99));
}

// Parameter options
{
  // Default values
  const greet = (name: string, greeting: string = "Hello"): string =>
    `${greeting}, ${name}`;

  console.log('greet("Aneeq"):', greet("Aneeq"));
  console.log('greet("Aneeq", "Welcome"):', greet("Aneeq", "Welcome"));

  // Optional parameters (`?`) — must come AFTER required parameters
  const fullName = (first: string, last?: string): string =>
    last ? `${first} ${last}` : first;

  console.log('fullName("Aneeq"):', fullName("Aneeq")); 
  console.log('fullName("Aneeq", "Malik"):', fullName("Aneeq", "Malik"));

  // Rest parameters (any number of inputs)
  const sum = (...nums: number[]): number =>
    nums.reduce((total, n) => total + n, 0);

  console.log("sum(1, 2, 3, 4):", sum(1, 2, 3, 4));

  // Object parameter (cleaner when there are many inputs — very common in NestJS)
  interface CreateUserInput {
    name: string;
    age: number;
    isAdmin?: boolean;
  }

  const createUser = ({ name, age, isAdmin = false }: CreateUserInput): string =>
    `${name}, ${age}, admin: ${isAdmin}`;

  console.log("createUser:", createUser({ name: "Aneeq", age: 25 }));
}

// Function types
// You can describe the shape of a function as a reusable type.
{
  type MathOperation = (a: number, b: number) => number;

  // Because the type is already known, you don't need to repeat types on `a` and `b`
  const add: MathOperation = (a, b) => a + b;
  const multiply: MathOperation = (a, b) => a * b;

  console.log("add(3, 4):", add(3, 4));
  console.log("multiply(3, 4):", multiply(3, 4));

  // Passing functions as inputs
  // This is exactly how `map` and `filter` work: you pass them a function.
  const applyTwice = (fn: (n: number) => number, value: number): number =>
    fn(fn(value));

  console.log("applyTwice(n => n * 2, 3):", applyTwice((n) => n * 2, 3));

  // Returning a function
  const makeMultiplier = (factor: number): ((n: number) => number) =>
    (n) => n * factor;

  const triple = makeMultiplier(3);
  console.log("triple(5):", triple(5));
}

// Scope
// Scope means "which parts of the code can use this variable."
// Global / module scope: declared at the top of the file, visible everywhere in this module
const appName = "MyApp";

{
  const showName = (): void => {
    console.log("Module scope (appName):", appName);
  };
  showName();

  // Function scope: declared inside a function, visible only inside it
  const calculate = (): number => {
    const secret = 42;
    return secret;
  };
  console.log("Function scope (calculate()):", calculate());

  // Block scope: `let` and `const` live only inside the nearest `{ }`
  if (true) {
    const inside = "hi";
    console.log("Block scope (inside if):", inside); // works
  }

  // Same applies to `for` loops
  for (let i = 0; i < 3; i++) {
    console.log("Loop block scope (i):", i);
  }

  // Why we avoid `var`: it ignores block scope and leaks out!
  if (true) {
    var leaky = "oops";
  }
  console.log("var leaked out of block:", leaky);

  // Inner scope can see outer scope, not the other way around
  const outer = "I am outside";
  const testScope = (): void => {
    const inner = "I am inside";
    console.log("Inner sees outer:", outer); // OK
    console.log("Inner sees inner:", inner); // OK
  };
  testScope();
  // console.log(inner); // Error: Cannot find name 'inner'

  // Shadowing (avoid: works, but confuses readers — use different names instead)
  const x = 1;
  const testShadowing = (): void => {
    const x = 2;
    console.log("Shadowed x inside function:", x); // 2
  };
  testShadowing();
  console.log("Outer x unchanged:", x); // 1
}

// Closures (simple version)
// A function remembers the variables from where it was created.
// Here count is hidden from outside, but the returned function can still use it.
// This is a way to keep private data.
{
  const makeCounter = (): (() => number) => {
    let count = 0;
    return () => {
      count++;
      return count;
    };
  };

  const counter = makeCounter();
  console.log("counter():", counter()); 
  console.log("counter():", counter()); 
  console.log("counter():", counter());
}