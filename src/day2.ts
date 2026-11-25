import { close } from "node:fs";

const age = 10;

// Conditions
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teen");
} else {
  console.log("Child");
}


// Ternary
const label = age >= 18 ? "Adult" : "Minor";
console.log(label)

// Arrays
let numbers = [1, 2, 3, 4, 5, 6];
console.log(numbers);
let names : string[] = [
    "Aneeq", 
    "Ahmed",
    "Malik"
];
console.log(names);
let fruits = ["Apple", "Banana", "Cherry"];
console.log(fruits);

for (const fruit of fruits) {
  console.log(fruit);
}

const doubled = numbers.map(n => n * 2);
console.log(doubled);

const evens = numbers.filter(n => n % 2 === 0);
console.log("evens = " + evens)

// Multi Type Array 
let values : (string | number)[] = [1, "Hello", 2, "World!"]

type Status = "active" | "inactive" | "banned";

interface User {
  id: number;
  name: string;
  age: number;
  status: Status;
}

const users: User[] = [
  { id: 1, name: "User 1",   age: 25, status: "active" },
  { id: 2, name: "User 2",  age: 17, status: "inactive" },
  { id: 3, name: "User 3", age: 31, status: "active" },
  { id: 4, name: "User 4",  age: 22, status: "banned" },
];

const activeUsers = users.filter(u => u.status === "active");
console.log(activeUsers)

const bannedUsers = users.filter(u => u.status === "banned");
console.log(bannedUsers)

const activeNames = users
  .filter(u => u.status === "active")
  .map(u => u.name);

console.log(activeNames)

const summaries = users.map(u => ({
  name: u.name,
  isAdult: u.age >= 18,
}));
console.log(summaries);
// multi-dimensional array 
let mArray : number[][] = [[10, 20, 30], [50, 60, 70]] ; 

console.log(mArray[0][0]);  
console.log(mArray[0][1]);  
console.log(mArray[0][2]);  
console.log();  
console.log(mArray[1][0]);  
console.log(mArray[1][1]);  
console.log(mArray[1][2]);  

// Initializing an Array by using the Array object.  
let arr:string[] = new Array("Aneeque Malik", "Kotlin", "Java");  
for(var i = 0;i<arr.length;i++) {   
   console.log(arr[i]); 
}

// type array 
type Role = "admin" | "user" | "guest";

function access(role: Role): string {
  switch (role) {
    case "admin": return "Full";
    case "user":  return "Limited";
    case "guest": return "Read-only";
  }
}

function accessSwitch(role: Role): string {
  switch (role) {
    case "admin": return "Full";
    case "user":  return "Limited";
    case "guest": return "Read-only";
  }
}

console.log("role: " + access("admin"));
console.log("role: " + access("user"));
console.log("role: " + accessSwitch("guest"));

const updated = users.map(u =>
  u.id === 4 ? { ...u, status: "active" as const } : u
);

console.log(updated);



const Role2 = {
  Admin: "admin",
  User: "user",
  Guest: "guest",
} as const;

type Role2 = typeof Role2[keyof typeof Role2];   // "admin" | "user" | "guest"

function access2(role: Role): string {
  switch (role) {
    case Role2.Admin: return "Full";
    case Role2.User:  return "Limited";
    case Role2.Guest: return "Read-only";
  }
}

console.log(access2(Role2.Admin));

const canVote = age >= 18 && users[0]?.status === "active";
const isOutOfRange = age < 13 || age > 60;
const notBanned = !(users[3]?.status === "banned");

// find: Give me the first item that matches
const firstBig = numbers.find(n => n > 3);
console.log(firstBig);
// some: Does AT LEAST ONE item match?
let some1 = numbers.some(n => n > 4);   
let some2 = numbers.some(n => n > 10);
console.log(some1);
console.log(some2);
// every: Do ALL items match?
let every1 = numbers.every(n => n > 0);
let every2 = numbers.every(n => n > 3);
console.log(every1);
console.log(every2);