const BASE = process.env.API_URL || "http://45.94.213.105";
const DATE = new Date().toISOString().slice(0, 10);
const FAKE_ID = "00000000-0000-0000-0000-000000000001";

async function probe(name, method, path, opts = {}) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
        ...opts.headers,
      },
      body: opts.body
        ? opts.rawBody ?? JSON.stringify(opts.body)
        : opts.rawBody,
    });
    let snippet = "";
    try {
      const text = await res.text();
      snippet = text.slice(0, 120).replace(/\s+/g, " ");
    } catch {
      snippet = "";
    }
    return { name, method, path, status: res.status, ok: res.ok, snippet };
  } catch (err) {
    return {
      name,
      method,
      path,
      status: 0,
      ok: false,
      snippet: String(err.message || err),
    };
  }
}

const tests = [
  // Admin
  ["Admin Login", "POST", "/Admin/Login", { body: { username: "admin", password: "admin1234" } }],
  ["Admin LogOut", "POST", `/Admin/${FAKE_ID}/LogOut`, { body: { principalId: FAKE_ID } }],

  // Caravan
  ["Caravan Login", "POST", "/Caravan/Login", { body: { username: "caravan", password: "test1234" } }],
  ["Caravan SignIn", "POST", "/Caravan/SignIn", { body: { username: "newcaravan", password: "test1234", name: "Test", familyName: "Caravan", nationalCode: "1234567890", gender: 0, phoneNumber: "09120000000" } }],
  ["Caravan LogOut", "POST", `/Caravan/${FAKE_ID}/LogOut`, { body: { principalId: FAKE_ID } }],

  // FAQ
  ["FAQ GET", "GET", "/FAQ"],
  ["FAQ POST", "POST", "/FAQ", { body: { question: "probe-q", answer: "probe-a" } }],
  ["FAQ PUT", "PUT", `/FAQ/${FAKE_ID}`, { body: { question: "probe-q2", answer: "probe-a2" } }],

  // Individual auth
  ["Individual Login", "POST", "/Individual/LogIn", { body: { username: "user", password: "test1234" } }],
  ["Individual SignIn", "POST", "/Individual/SignIn", { body: { username: "newuser", password: "test1234", name: "Ali", familyName: "Test", nationalCode: "0012345678", gender: 0, phoneNumber: "09121111111" } }],
  ["Individual LogOut", "POST", `/Individual/${FAKE_ID}/LogOut`, { body: { principalId: FAKE_ID } }],
  ["Individual GET", "GET", `/Individual/${FAKE_ID}`],
  ["Individual GET all", "GET", "/Individual"],
  ["Individual ChangePrincipal", "PUT", `/Individual/${FAKE_ID}/ChangePrincipal`, { body: { name: "Ali", familyName: "Test", nationalCode: "0012345678", gender: 0, phoneNumber: "09121111111" } }],
  ["Individual Password", "PUT", `/Individual/${FAKE_ID}/Password`, { body: { oldPassword: "old", newPassword: "new1234" } }],
  ["Individual ActivateOrDeactivate", "PUT", `/Individual/${FAKE_ID}/ActivateOrDeactivatePrincipal`, { body: { isActive: true } }],
  ["Individual CheckCapacity", "POST", `/Individual/${FAKE_ID}/CheckCapacity`, { body: { individualId: FAKE_ID, enterTime: DATE, exitTime: DATE, maleAmount: 1, femaleAmount: 0 } }],
  ["Individual Reserve", "POST", `/Individual/${FAKE_ID}/Reserve`, { body: { individualId: FAKE_ID, dateOfEntrance: DATE, dateOfExit: DATE, maleAmount: 1, femaleAmount: 0, travelers: [] } }],
  ["Individual Requests", "GET", `/Individual/${FAKE_ID}/Requests`],
  ["Individual Requests by date", "GET", `/Individual/${FAKE_ID}/Requests/${DATE}`],
  ["Individual Search", "POST", "/Individual/Search", { body: { input: "test" } }],
  ["Individual Companions POST", "POST", `/Individual/${FAKE_ID}/Companions`, { body: { individualId: FAKE_ID, name: "Ali", familyName: "Test", nationalCode: "0012345678", gender: 0, phoneNumber: "09121111111" } }],
  ["Individual Companions GET", "GET", `/Individual/${FAKE_ID}/Companions`],
  ["Individual Companions Search", "GET", `/Individual/${FAKE_ID}/Companions/Search`],
  ["Individual Companions DELETE", "DELETE", `/Individual/${FAKE_ID}/Companions/${FAKE_ID}`, { body: { individualId: FAKE_ID, companionId: FAKE_ID } }],
  ["Individual DELETE", "DELETE", `/Individual/${FAKE_ID}`, { body: { id: FAKE_ID } }],

  // Officials
  ["Officials GET", "GET", "/Officials"],
  ["Officials POST", "POST", "/Officials", { body: { name: "Probe", familyName: "Official", nationalCode: "9988776655", phoneNumber: "09129999999", isActive: true, Name: "Probe", LastName: "Official", NationalCode: "9988776655", PhoneNumber: "09129999999", IsActive: true } }],
  ["Officials PUT", "PUT", `/Officials/${FAKE_ID}`, { body: { name: "Probe2", familyName: "Official2", nationalCode: "9988776655", phoneNumber: "09129999999", isActive: true, Name: "Probe2", LastName: "Official2" } }],
  ["Officials DELETE", "DELETE", `/Officials/${FAKE_ID}`, { body: { id: FAKE_ID, officialId: FAKE_ID, OfficialId: FAKE_ID } }],

  // Request
  ["IncomingOrAccepted", "GET", `/IncomingOrAccepted/${DATE}`],
  ["OutgoingOrAccepted", "GET", `/OutgoingOrAccepted/${DATE}`],
  ["Request Incoming Search", "GET", `/Request/IncomingOrAccepted/${DATE}/Search/test`],
  ["Request Outgoing Search", "GET", `/Request/OutgoingOrAccepted/${DATE}/Search/test`],
  ["Request RequestedRequests", "GET", `/Request/RequestedRequests/${DATE}`],
  ["Request Accept", "PUT", `/Request/${FAKE_ID}/AcceptRequest`],
  ["Request Reject", "PUT", `/Request/${FAKE_ID}/RejectRequest`],
  ["Request GenderStats", "POST", "/Request/GenderStatsInAYear", { body: { year: 1404 } }],
  ["Request TypeStats", "POST", "/Request/RequestsTypeStats", { body: { year: 1404 } }],
  ["Request Amount", "GET", `/Request/${DATE}/RequestedRequestsAmount`],
  ["Request PDF", "GET", `/Request/${FAKE_ID}/DownloadIndividualRequestPdf`, { headers: { Accept: "application/pdf" } }],
  ["AddRoomAvailability to Request", "PUT", `/${FAKE_ID}/RoomAvailabilities/${FAKE_ID}/AddRoomAvailability`, { body: { requestId: FAKE_ID, roomAvailabilityId: FAKE_ID } }],
  ["ChangeDateOfEntrance", "PUT", `/${FAKE_ID}/ChangingDateOfEntrance`, { body: { requestId: FAKE_ID, date: DATE } }],
  ["ChangeExitDate", "PUT", `/${FAKE_ID}/ChangingExitDate`, { body: { requestId: FAKE_ID, date: DATE } }],

  // Room
  ["Room POST", "POST", "/Room", { body: { name: "ProbeRoom", capacity: 10, gender: 0 } }],
  ["Room DELETE", "DELETE", `/Room/${FAKE_ID}`],
  ["Room Availability POST", "POST", `/Room/${FAKE_ID}/RoomAvailability`, { body: { capacity: 10, date: DATE } }],
  ["Room ChangeDate", "PUT", `/Room/${FAKE_ID}/${FAKE_ID}/ChangeDate`, { body: { date: DATE } }],
  ["Room ReportStats", "GET", `/Room/${DATE}/ReportStats`],
  ["Room DistinctAvailabilities", "GET", `/Room/RoomAvailabilities/${FAKE_ID}/DistinctRoomAvailabilities`],
  ["Room Availabilities Range", "GET", `/Room/RoomAvailabilities/${DATE}/${DATE}`],
  ["Room Availabilities Date", "GET", `/Room/RoomAvailabilities/${DATE}`],
];

const results = [];
for (const [name, method, path, opts] of tests) {
  results.push(await probe(name, method, path, opts ?? {}));
}

const errors = results.filter((r) => !r.ok);
const s500 = errors.filter((r) => r.status >= 500);
const s4xx = errors.filter((r) => r.status >= 400 && r.status < 500);
const other = errors.filter((r) => r.status === 0 || (r.status > 0 && r.status < 400));

console.log("=== SUMMARY ===");
console.log(`Total: ${results.length}, OK: ${results.length - errors.length}, Errors: ${errors.length}`);
console.log(`500+: ${s500.length}, 4xx: ${s4xx.length}, Other: ${other.length}`);
console.log("");

console.log("=== 500 SERVER ERRORS ===");
for (const r of s500) {
  console.log(`${r.status}\t${r.method}\t${r.path}\t${r.snippet}`);
}

console.log("");
console.log("=== 4xx CLIENT ERRORS ===");
for (const r of s4xx) {
  console.log(`${r.status}\t${r.method}\t${r.path}\t${r.snippet}`);
}

console.log("");
console.log("=== OTHER FAILURES ===");
for (const r of other) {
  console.log(`${r.status}\t${r.method}\t${r.path}\t${r.snippet}`);
}

console.log("");
console.log("=== ALL OK (2xx) ===");
for (const r of results.filter((x) => x.ok)) {
  console.log(`${r.status}\t${r.method}\t${r.path}`);
}
