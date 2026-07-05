import bcrypt from "bcrypt";

const password = "kcgtuty"; // 👈 your plain password

const run = async () => {
  const hash = await bcrypt.hash(password, 10);

  console.log("PLAIN PASSWORD:", password);
  console.log("HASHED PASSWORD:", hash);
};

run();