import { readConfig, setUser } from "./config.js";

function main() {
  const user = "Kevin";
  setUser(user);
  const config = readConfig();

  console.log(config);

}

main();