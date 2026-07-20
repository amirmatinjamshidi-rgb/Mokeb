# پوشش API فرانت‌اند / Frontend API coverage

**همهٔ مسیرهای Swagger به‌صورت خودکار در فرانت وصل نیستند.**  
این فایل می‌گوید کدام‌ها در `lib/api` پیاده شده‌اند و کدام فقط از Swagger قابل تست‌اند.

| وضعیت           | معنی                                                                         |
| --------------- | ---------------------------------------------------------------------------- |
| **وصل (فرانت)** | تابع در `lib/api` + معمولاً استفاده در UI یا هوک                             |
| **نیمه**        | فقط بخشی از مسیرها (مثلاً فقط GET)                                           |
| **فقط بک‌اند**  | باید از Swagger (آدرس `SWAGGER_URL`) تست شود یا بعداً به `lib/api` اضافه شود |

---

## Admin

| مسیر                           | وضعیت                                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| POST `/Admin/Login`            | وصل — seed پیش‌فرض: `admin` / `admin` (جدول Admins)              |
| POST `/Admin/{adminId}/LogOut` | وصل                                                                |

## Caravan

| مسیر                                               | وضعیت      |
| -------------------------------------------------- | ---------- |
| POST `/Caravan/SignIn`                             | فقط بک‌اند |
| POST `/Caravan/Login`                              | وصل        |
| POST `/Caravan/{caravanId}/LogOut`                 | وصل        |
| بقیهٔ Caravan (GET/PUT/DELETE/Pilgrims/Requests/…) | وصل — پنل Boss |

## Individual

| مسیر                                           | وضعیت                                 |
| ---------------------------------------------- | ------------------------------------- |
| POST `/Individual/SignIn`                      | وصل (تابع) — فرم ثبت‌نام UI جدا ندارد |
| POST `/Individual/LogIn`                       | وصل + صفحه ورود                       |
| POST `.../LogOut`                              | وصل                                   |
| GET `/{id}`، PUT ChangePrincipal، PUT Password | وصل (پروفایل/رمز)                     |
| CheckCapacity، Reserve                         | وصل + رزرو                            |
| Requests، Companions CRUD/Search/File          | وصل + پنل کاربر                       |

## Request

| مسیر | وضعیت | پنل |
| ---- | ----- | --- |
| GET `/IncomingOrAccepted/{date}` | وصل | Dashboard، Manage-Requests، ورود/خروج |
| GET `/OutgoingOrAccepted/{date}` | وصل | همان |
| GET `/Request/IncomingOrAccepted/{date}/Search/{input}` | وصل (debounce) | Manage-Requests، ورود/خروج |
| GET `/Request/OutgoingOrAccepted/{date}/Search/{input}` | وصل (debounce) | همان |
| GET `/Request/RequestedRequests/{entranceDate}` | وصل | Manage-Requests |
| PUT `/Request/{requestId}/AcceptRequest` | وصل | Manage-Requests (+ تخصیص اتاق) |
| PUT `/Request/{requestId}/RejectRequest` | وصل | Manage-Requests |
| PUT `/{requestId}/RoomAvailabilities/{roomAvailabilityId}/AddRoomAvailability` | وصل | بعد از AcceptRequest |
| PUT `/{requestId}/ChangingDateOfEntrance` | وصل | ورود/خروج (+ modal) |
| PUT `/{requestId}/ChangingExitDate` | وصل | ورود/خروج (+ modal) |
| POST `/Request/GenderStatsInAYear` | وصل | Reports pie |
| POST `/Request/RequestsTypeStats` | وصل | Reports bar |
| GET `/Request/{date}/RequestedRequestsAmount` | وصل | Dashboard |
| GET `/Request/{requestId}/DownloadIndividualRequestPdf` | وصل | Manage-Requests، User، Boss، ویزارد رزرو |

## Officials / Room

| گروه | وضعیت |
| ---- | ----- |
| Officials | وصل — About / CRUD |
| Room POST/DELETE | وصل — Settings → ظرفیت |
| RoomAvailability POST | وصل — فعال‌سازی تاریخ ظرفیت |
| ChangeDate PUT | وصل — ویرایش تاریخ ظرفیت |
| ReportStats GET | وصل — خلاصه ظرفیت + کارت‌های داشبورد |
| DistinctRoomAvailabilities GET | وصل — هنگام تایید درخواست |
| RoomAvailabilities by date / range GET | وصل — جدول ظرفیت و Onsite |

**محدودیت بک‌اند:** `POST /Room` اغلب فقط متن `Room Added Successfully` برمی‌گرداند (بدون UUID). بدون شناسه نمی‌توان `RoomAvailability` زد؛ فیلد UUID در فرم و کاتالوگ محلی (`mokeb-room-catalog`) این را جبران می‌کنند.
