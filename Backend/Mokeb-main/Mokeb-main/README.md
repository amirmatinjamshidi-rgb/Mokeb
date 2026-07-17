# 🏨 Private Hospitality and Reservation System

A specialized system built to support **pilgrims and caravans**, ensuring a seamless and dignified experience through modern technology.

---

## 🎯 Purpose

* **Organize** pilgrim and caravan reservations.
* **Prevent overcrowding** and scheduling conflicts.
* **Simplify coordination** for **Mókeb staff**.
* **Maintain dignity, order, and efficiency** in service.

---

## 🛠️ Technical Overview

| Category | Technology |
| :--- | :--- |
| **Backend** | `.NET Core` |
| **Database** | `SQL Server` |
| **Architecture** | `Clean Architecture` |
| **Data Access** | `EF Core` |
| **Version Control** | `Git & GitHub` |

---

## 🚍 Supported Reservation Types

* ✔️ **Individual pilgrims**
* ✔️ **Group / Caravan reservations**
* ✔️ **Date-based capacity management**

---

## 🧭 Admin Dashboard & Management

* **Optional full admin dashboard**
* **Manage individual pilgrims**
* **Manage caravans** and caravan members.
* **Manage and review reservations**
* **Execute complex queries** for operational insights.
* **Centralized control** for high-load periods.

---

## 🔐 Security

* **JWT-based Authentication:**
  Users authenticate via **JSON Web Tokens (JWT)**, ensuring secure, stateless access to the API.
* **Role & Permission-Based Authorization:**
  Access to endpoints and actions is controlled through **roles and permissions**, allowing fine-grained control for admins, staff, and regular users.
* **Redis Caching for JWT Tokens:**
  Active JWT tokens are cached in **Redis**, improving performance for token validation and supporting scalable, distributed deployments.

---

## 📊 Reports & Documents

* **Dynamic report generation**
* **Import caravan members** via Excel files.
* **Generate PDF tickets** for reservations.
* **Data-ready outputs** for administrative use.

---

## 🏗️ Architectural Design

The project is built using **Clean Architecture** to ensure that the core logic is decoupled from external tools and databases, facilitating **maintainability** and **scalability**.

