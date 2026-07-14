/**
 * Validates frontend payload shapes against live API binding (api.json).
 * Distinguishes schema 400 vs server 500 (missing entities).
 */
const BASE = process.env.API_URL || "http://45.94.213.105";
const FAKE = "00000000-0000-0000-0000-000000000001";
const DATE = "2026-07-20";
const EXIT = "2026-07-22";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let kind = "ok";
  if (res.status === 400) kind = "schema-400";
  else if (res.status >= 500) kind = "server-500";
  else if (res.status >= 400) kind = `client-${res.status}`;
  return { status: res.status, kind, text: text.slice(0, 280) };
}

function assertNotSchema(name, result) {
  const pass = result.kind !== "schema-400";
  console.log(
    `${pass ? "PASS" : "FAIL"}\t${result.status}\t${result.kind}\t${name}`,
  );
  if (!pass) console.log(`  ${result.text}`);
  return pass;
}

const cases = [
  [
    "CheckCapacity ISO date",
    "POST",
    `/Individual/${FAKE}/CheckCapacity`,
    {
      individualId: FAKE,
      enterTime: DATE,
      exitTime: EXIT,
      maleAmount: 2,
      femaleAmount: 0,
    },
  ],
  [
    "CheckCapacity persian digits (must 400 — frontend converts)",
    "POST",
    `/Individual/${FAKE}/CheckCapacity`,
    {
      individualId: FAKE,
      enterTime: "۱۴۰۴/۰۴/۲۹",
      exitTime: "۱۴۰۴/۰۴/۳۱",
      maleAmount: 1,
      femaleAmount: 0,
    },
  ],
  [
    "ReserveRoom date-time",
    "POST",
    `/Individual/${FAKE}/Reserve`,
    {
      individualId: FAKE,
      dateOfEntrance: `${DATE}T00:00:00`,
      dateOfExit: `${EXIT}T00:00:00`,
      maleAmount: 1,
      femaleAmount: 0,
      travelers: [],
    },
  ],
  [
    "Password currentPassword",
    "PUT",
    `/Individual/${FAKE}/Password`,
    { id: FAKE, currentPassword: "x", newPassword: "y" },
  ],
  [
    "LogOut id",
    "POST",
    `/Individual/${FAKE}/LogOut`,
    { id: FAKE },
  ],
  [
    "AcceptRequest + roomAvailabilityIds",
    "PUT",
    `/Request/${FAKE}/AcceptRequest`,
    { requestId: FAKE, roomAvailabilityIds: [] },
  ],
  [
    "RejectRequest body",
    "PUT",
    `/Request/${FAKE}/RejectRequest`,
    { requestId: FAKE },
  ],
  [
    "Room DELETE + roomId",
    "DELETE",
    `/Room/${FAKE}`,
    { roomId: FAKE },
  ],
  [
    "RoomAvailability dateOfAvailability",
    "POST",
    `/Room/${FAKE}/RoomAvailability`,
    { roomId: FAKE, dateOfAvailability: DATE },
  ],
  [
    "ChangeDate availabilityId+newDate",
    "PUT",
    `/Room/${FAKE}/${FAKE}/ChangeDate`,
    { availabilityId: FAKE, newDate: DATE },
  ],
  [
    "Officials Add lastName only",
    "POST",
    "/Officials",
    { name: "Probe", lastName: "Official", phoneNumber: "09129999999" },
  ],
  [
    "GenderStats year string",
    "POST",
    "/Request/GenderStatsInAYear",
    { year: "1404" },
  ],
  [
    "RoomAvailabilities range GET",
    "GET",
    `/Room/RoomAvailabilities/${DATE}/${EXIT}`,
  ],
  [
    "RoomAvailabilities same-day range (FE substitute for GET+body)",
    "GET",
    `/Room/RoomAvailabilities/${DATE}/${DATE}`,
  ],
  [
    "AddRoomAvailToRequest + amount",
    "PUT",
    `/${FAKE}/RoomAvailabilities/${FAKE}/AddRoomAvailability`,
    { requestId: FAKE, roomAvailabilityId: FAKE, amount: 1 },
  ],
  [
    "Companions with required strings",
    "POST",
    `/Individual/${FAKE}/Companions`,
    {
      individualId: FAKE,
      name: "Ali",
      familyName: "Test",
      nationalCode: "0012345678",
      passportNumber: "",
      dateOfBirth: "1990-01-01",
      phoneNumber: "09121111111",
      emergencyPhoneNumber: "09121111112",
      gender: 0,
    },
  ],
  [
    "ChangePrincipal required strings",
    "PUT",
    `/Individual/${FAKE}/ChangePrincipal`,
    {
      individualId: FAKE,
      name: "Ali",
      familyName: "Test",
      nationalCode: "0012345678",
      dateOfBirth: "1990-01-01",
      gender: 0,
      passportNumber: "P1",
      gmail: "a@b.com",
      phoneNumber: "09121111111",
      emergencyPhoneNumber: "09121111112",
      bloodType: 0,
    },
  ],
];

let fails = 0;
for (const [name, method, path, body] of cases) {
  const r = await req(method, path, body);
  // Intentional negative case: persian digits MUST stay schema-400 without conversion
  if (name.includes("persian digits")) {
    const pass = r.kind === "schema-400";
    console.log(
      `${pass ? "PASS" : "FAIL"}\t${r.status}\t${r.kind}\t${name} (expect schema-400)`,
    );
    if (!pass) fails++;
    continue;
  }
  if (!assertNotSchema(name, r)) fails++;
}

console.log(`\nDone. Schema failures: ${fails}`);
process.exit(fails ? 1 : 0);
