// Type Annotation in TypeScript
var name : string = "Aneeq Ahmed Malik";
var age : number = 32;
var married : boolean = true;

// let 
// scope : Block-scoped
// Reassignable: Yes
// Redeclarable: No

let employeeName : string = "Aneeq";
let employeeAge : number = 32


// const 
// scope : Block-scoped
// Reassignable: No
// Redeclarable: No

const number = 120

const employeeDetails = {
    employeeName : "Aneeq",
    employeeAge : 32,
    employeeID : 1
}

console.log(employeeDetails.employeeName);

let first:number = 123; 
let second: number = 0x37CF;  
let third:number=0o377 ; 
let fourth: number = 0b111001;

console.log(first);  // 123 
console.log(second); // 14287
console.log(third);  // 255
console.log(fourth); // 57