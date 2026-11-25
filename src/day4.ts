// Day 4: Async/Await, Promises & How Node Handles I/O

interface User {
  id: number;
  name: string;
  role: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
}

const usersDb: User[] = [
  { id: 1, name: "Aneeq", role: "Backend Dev" },
  { id: 2, name: "Ali", role: "Frontend Dev" },
  { id: 3, name: "Sara", role: "DevOps" },
];

const postsDb: Post[] = [
  { id: 101, userId: 1, title: "Learning TypeScript" },
  { id: 102, userId: 1, title: "Understanding Node Event Loop" },
  { id: 103, userId: 2, title: "CSS Grid Tips" },
];

// 1. What is a Promise?
// A Promise is an object representing a value that will be available in the future.
// It has 3 states:
//   - pending   : still in progress
//   - fulfilled : succeeded (resolve(value) was called)
//   - rejected  : failed    (reject(error) was called)
// Promise<User> means: "this will eventually give you a User, or reject with an error."
const fetchUser = (id: number, ms: number = 200): Promise<User> => {
  return new Promise((resolve, reject) => {
    // setTimeout simulates slow I/O (like a database query or HTTP API call)
    setTimeout(() => {
      const user = usersDb.find((u) => u.id === id);
      if (user) {
        resolve(user); // transitions Promise from pending -> fulfilled
      } else {
        reject(new Error(`User ${id} not found`)); // pending -> rejected
      }
    }, ms);
  });
};

const fetchPostsByUser = (userId: number, ms: number = 200): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(postsDb.filter((p) => p.userId === userId));
    }, ms);
  });
};

// 2. CRITICAL: How Node handles I/O (Non-blocking Event Loop)
// JavaScript runs on a SINGLE main thread, so Node never blocks while waiting for I/O.
// Instead, it hands slow work (timers, network, disk) to the OS/libuv and moves on.
// When the work finishes, its callback enters a queue and the Event Loop runs it in order:
//   1) Synchronous code (call stack)
//   2) Microtasks (resolved Promise callbacks: .then / await continuations)
//   3) Macrotasks (timers like setTimeout, I/O callbacks)
const demoEventLoop = (): Promise<void> => {
  return new Promise((resolve) => {
    console.log("Node Event Loop (Non-blocking I/O)");

    console.log("1. Sync start");

    setTimeout(() => {
      console.log("4. Timer / I/O callback (macrotask)");
      resolve();
    }, 0);

    Promise.resolve().then(() => {
      console.log("3. Promise.then (microtask)");
    });

    console.log("2. Sync end (main thread is never blocked)");
  });
};

// 3. Consuming a Promise with .then() / .catch()
// .then() runs when the Promise fulfills; .catch() runs if it rejects.
const demoThenCatch = (): Promise<void> => {
  console.log("\n--- 2. Promises with .then() / .catch() ---");

  return fetchUser(1, 150)
    .then((user) => console.log("Fetched:", user))
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Error:", message);
    });
};

// 4. What is async / await?
// - Marking a function `async` means it ALWAYS returns a Promise.
// - `await` pauses ONLY this async function until the Promise settles (Node's event loop stays free).
// - Use `try / catch / finally` to handle rejections cleanly (just like sync error handling).
const demoAsyncAwait = async (): Promise<void> => {
  console.log("\n--- 3. Async/Await + Error Handling ---");

  try {
    const user = await fetchUser(1, 150);
    console.log("Found user:", user.name, "-", user.role);

    // Triggers reject(), jumping straight into the catch block
    await fetchUser(99, 100);
  } catch (err: unknown) {
    // In strict TypeScript, caught errors are `unknown` so we narrow before reading .message
    const message = err instanceof Error ? err.message : String(err);
    console.log("Caught error:", message);
  } finally {
    console.log("Cleanup complete (finally always runs)");
  }
};

// 5. Sequential vs Parallel I/O (Promise.all)
// Awaiting independent requests one-by-one wastes time waiting on each step.
// Promise.all starts them all concurrently and resolves with an array of all results
// (or rejects immediately if ANY single Promise rejects).
const demoSequentialVsParallel = async (): Promise<void> => {
  console.log("\n--- 4. Sequential vs Parallel (Promise.all) ---");

  // Sequential: each request waits for the previous one (~600ms total)
  const seqStart = Date.now();
  const u1 = await fetchUser(1, 200);
  const u2 = await fetchUser(2, 200);
  const u3 = await fetchUser(3, 200);
  console.log(
    `Sequential (${Date.now() - seqStart}ms):`,
    [u1.name, u2.name, u3.name]
  );

  // Parallel: Node fires all 3 I/O ops at the same time (~200ms total)
  const parStart = Date.now();
  const users = await Promise.all([
    fetchUser(1, 200),
    fetchUser(2, 200),
    fetchUser(3, 200),
  ]);
  console.log(
    `Parallel   (${Date.now() - parStart}ms):`,
    users.map((u) => u.name)
  );
};

// 6. Promise.allSettled
// Unlike Promise.all, allSettled waits for EVERY Promise to finish—even if some fail.
// Each item is either { status: "fulfilled", value } or { status: "rejected", reason }.
const demoAllSettled = async (): Promise<void> => {
  console.log("\n--- 5. Promise.allSettled ---");

  const results = await Promise.allSettled([
    fetchUser(1, 100),
    fetchUser(99, 100),
    fetchUser(3, 100),
  ]);

  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log("Success:", result.value.name);
    } else {
      console.log("Failed :", (result.reason as Error).message);
    }
  }
};

// 7. Promise.race (real-world timeout pattern)
// Promise.race settles as soon as the FIRST Promise resolves or rejects.
// Here we race a real operation against a timer, and clear the timer once done.
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timerId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timerId));
};

// Combining independent fetches in parallel inside one typed async function
const fetchUserProfile = async (
  userId: number
): Promise<{ user: User; posts: Post[] }> => {
  const [user, posts] = await Promise.all([
    fetchUser(userId, 150),
    fetchPostsByUser(userId, 150),
  ]);
  return { user, posts };
};

const demoRealWorldPattern = async (): Promise<void> => {
  console.log("\n--- 6. Real-World Pattern (Profile + Timeout) ---");

  const profile = await withTimeout(fetchUserProfile(1), 500);
  console.log(`${profile.user.name}'s posts:`, profile.posts.map((p) => p.title));

  try {
    await withTimeout(fetchUser(2, 400), 100);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("Timeout check:", message);
  }
};

// Main runner: executes each demo in order so console outputs don't interleave
const main = async (): Promise<void> => {
  await demoEventLoop();
  await demoThenCatch();
  await demoAsyncAwait();
  await demoSequentialVsParallel();
  await demoAllSettled();
  await demoRealWorldPattern();
};

main();
