const students = [
  { name: "Anna", age: 17, grade: 2 },
  { name: "Ben", age: 16, grade: 4 },
  { name: "Clara", age: 18, grade: 1 },
  { name: "David", age: 17, grade: 5 },
  { name: "Elena", age: 16, grade: 3 },
  { name: "Felix", age: 19, grade: 2 },
  { name: "Gina", age: 17, grade: 1 },
  { name: "Hugo", age: 18, grade: 4 },
];

console.log("Original Students list:");
console.log(students);
console.log("\n--------------------------------------------------\n");

// **Task 1 – filter:** Find all students who passed (grade ≤ 4). Store the result in `passed`.
const passed = students.filter(student => student.grade <= 4);
console.log("Task 1 - Passed students (grade <= 4):");
console.log(passed);
console.log("\n--------------------------------------------------\n");

// **Task 2 – map:** Create an array of strings in the format `"Anna (17)"` from the original array. Store it in `labels`.
const labels = students.map(student => `${student.name} (${student.age})`);
console.log("Task 2 - Labels (Name (Age)):");
console.log(labels);
console.log("\n--------------------------------------------------\n");

// **Task 3 – filter + map:** From only the passed students, extract just their names into an array `passedNames`.
const passedNames = students
  .filter(student => student.grade <= 4)
  .map(student => student.name);
console.log("Task 3 - Passed student names:");
console.log(passedNames);
console.log("\n--------------------------------------------------\n");

// **Task 4 – reduce:** Calculate the average grade of all students. Store it in `averageGrade`.
const averageGrade = students.reduce((sum, student) => sum + student.grade, 0) / students.length;
console.log(`Task 4 - Average grade: ${averageGrade}`);
console.log("\n--------------------------------------------------\n");

// **Task 5 – chaining (bonus):** In a single chain, find the names of all students aged 17 or older who passed, joined into one comma-separated string.
const result = students
  .filter(student => student.age >= 17 && student.grade <= 4)
  .map(student => student.name)
  .join(", ");
console.log("Task 5 (Bonus) - Passed students aged >= 17 (comma-separated):");
console.log(result);
