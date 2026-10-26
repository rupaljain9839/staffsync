# StaffSync – Modern Human Resource Management Solution

A MERN-stack web app that digitizes core HR processes with three roles: **HR**, **Manager** and **Employee**.

## Features
| Role | Capabilities |
|------|--------------|
| HR | Add / edit / delete / view employees, approve or reject leaves, view all attendance, post announcements |
| Manager | Approve or reject leave requests, create and manage training & development programs |
| Employee | Apply for leave, check in / out, view attendance, maintain personal record, read announcements, view assigned trainings |

## Tech Stack
React (Vite) · React Router · Bootstrap 5 · Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt

## Project Structure
```
staffsync/
├── server/   # Express REST API (models, routes, JWT + role middleware, seed script)
└── client/   # React frontend with role-based dashboards
```

## Getting Started
Prerequisites: Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
npm run install-all                    # installs root, server and client dependencies
cp server/.env.example server/.env     # then edit MONGO_URI / JWT_SECRET if needed
npm run seed                           # creates demo users and a welcome announcement
npm run dev                            # API on :5000, client on :5173
```
Open http://localhost:5173

### Demo Logins
| Role | Email | Password |
|------|-------|----------|
| HR | hr@staffsync.com | hr123456 |
| Manager | manager@staffsync.com | manager123 |
| Employee | employee@staffsync.com | employee123 |

Employees added by HR get the default password `Welcome@123`.

## REST API (all except login need `Authorization: Bearer <token>`)
| Endpoint | Access |
|---|---|
| POST `/api/auth/login`, GET `/api/auth/me` | Public / any |
| GET `/api/employees` | HR, Manager |
| POST, PUT `/:id`, DELETE `/:id` on `/api/employees` | HR |
| GET, PUT `/api/employees/me` | Any (own record) |
| POST `/api/leaves`, GET `/api/leaves/mine` | Any |
| GET `/api/leaves`, PUT `/api/leaves/:id/status` | HR, Manager |
| POST `/api/attendance/checkin`, `/checkout`, GET `/mine` | Any |
| GET `/api/attendance` | HR |
| GET `/api/announcements` | Any; POST/DELETE HR only |
| GET `/api/training` | Any (employees see only their programs); POST/PUT/DELETE Manager, HR |

## MongoDB Collections
`users`, `employees`, `leaverequests`, `attendances`, `announcements`, `trainingprograms`

## License
MIT
