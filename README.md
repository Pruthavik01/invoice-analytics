# 🧾 Invoice Analytics

**Invoice Analytics** is a full-stack MERN (MongoDB, Express, React, Node.js) application that helps businesses **analyze, visualize, and manage invoice data** with AI-assisted data extraction.

This project includes:
- A **backend API** for invoice and vendor data management.
- A **frontend dashboard** for analytics visualization.
- AI-ready architecture for extracting structured data from invoices.

---

## 🚀 Features

### 🔹 Backend
- Import and normalize raw invoice JSON data.
- Automatically extract:
  - Vendor info (name, email, phone)
  - Invoice totals, items, and dates
- Store and relate invoices with vendors in MongoDB.
- RESTful API for frontend access.
- `.env`-based configuration for secure credentials.

### 🔹 Frontend
- Built with **React + Vite + Tailwind CSS**
- Real-time, interactive analytics dashboard
  - 📊 **OverviewCards:** Key metrics (total spend, invoice count, etc.)
  - 📈 **TrendChart:** Spending trends over time
  - 🏢 **VendorChart:** Top vendors by spend
  - 🧾 **CategoryChart:** Invoice breakdown by category
  - 📋 **InvoicesTable:** Paginated list of all invoices
- Chat-style interface (**ChatWithData**) for querying data conversationally (future AI integration).

---

## 🧠 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, TailwindCSS, Recharts (or Chart.js) |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Environment** | dotenv, concurrently |
| **Version Control** | Git & GitHub |

---

## 🧩 Project Structure

