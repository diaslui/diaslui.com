import fetch from "node-fetch";

async function run() {
    const res = await fetch("https://codeforces.com/api/user.info?handles=diaslui");
    const data = await res.json();
    console.log(data);
}
run();
