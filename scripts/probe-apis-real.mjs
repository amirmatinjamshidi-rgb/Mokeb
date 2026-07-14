const BASE = process.env.API_URL || "http://45.94.213.105";
const DATE = new Date().toISOString().slice(0, 10);

async function req(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function main() {
  const officials = JSON.parse((await req("GET", "/Officials")).text || "[]");
  const faqs = JSON.parse((await req("GET", "/FAQ")).text || "[]");
  const officialId = officials[0]?.id;
  const faqId = faqs[0]?.id;

  console.log("Real IDs:", { officialId, faqId });

  const realTests = [
    ["Officials PUT (real id)", "PUT", `/Officials/${officialId}`, { name: officials[0]?.name, familyName: officials[0]?.lastName, nationalCode: "9988776655", phoneNumber: officials[0]?.phoneNumber, isActive: true, Name: officials[0]?.name, LastName: officials[0]?.lastName }],
    ["Officials DELETE (real id)", "DELETE", `/Officials/${officialId}`, { id: officialId, officialId, OfficialId: officialId }],
    ["FAQ PUT (real id)", "PUT", `/FAQ/${faqId}`, { question: faqs[0]?.question, answer: faqs[0]?.answer }],
    ["Individual Login (bad creds)", "POST", "/Individual/LogIn", { username: "nonexistent_user_xyz", password: "wrongpass" }],
    ["Admin Login (bad creds)", "POST", "/Admin/Login", { username: "nonexistent_admin", password: "wrongpass" }],
    ["Caravan Login (bad creds)", "POST", "/Caravan/Login", { username: "nonexistent_caravan", password: "wrongpass" }],
    ["Request Search Incoming", "GET", `/Request/IncomingOrAccepted/${DATE}/Search/ali`],
    ["Request Search Outgoing", "GET", `/Request/OutgoingOrAccepted/${DATE}/Search/ali`],
    ["Request GenderStats", "POST", "/Request/GenderStatsInAYear", { Year: 1404, year: 1404 }],
    ["Request TypeStats", "POST", "/Request/RequestsTypeStats", { Year: 1404, year: 1404 }],
    ["Room Availabilities single date", "GET", `/Room/RoomAvailabilities/${DATE}`],
  ];

  for (const [name, method, path, body] of realTests) {
    if (path.includes("undefined")) {
      console.log(`SKIP\t${name}`);
      continue;
    }
    const r = await req(method, path, body);
    console.log(`${r.status}\t${method}\t${path}\t${name}`);
    if (r.status >= 400) console.log(`  -> ${r.text.slice(0, 200)}`);
  }
}

main();
