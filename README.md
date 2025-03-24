# GoTravelX - Flight Tracking System (Frontend)

GoTravelX is a **flight tracking system** for vendors, built using **Next.js** and **shadcn/ui**. This frontend application provides real-time flight updates, intuitive UI components, and seamless API integration.

## 🚀 Features

- Flight search and tracking
- Real-time updates using WebSockets
- Modern UI with **shadcn/ui**
- Vendor authentication and dashboard
- Responsive design with Tailwind CSS
- Secure API communication using Axios

## 🏗 Tech Stack

- **Framework:** Next.js
- **UI Library:** shadcn/ui, Tailwind CSS
- **State Management:** React Context API / Zustand (if used)
- **API Handling:** Axios
- **Date Formatting:** date-fns

## 📂 Project Structure

```
📦 go-travelx-frontend
├── 📁 components         # Reusable UI components
├── 📁 pages              # Next.js pages
├── 📁 hooks              # Custom hooks
├── 📁 lib                # Utility functions
├── 📁 styles             # Global styles (Tailwind CSS)
├── 📁 public             # Static assets
├── .env.local            # Environment variables
├── next.config.js        # Next.js configuration
└── README.md             # Project documentation
```

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/yourusername/go-travelx-frontend.git
cd go-travelx-frontend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env.local` file and configure your API URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.gotravelx.com
```

### 4️⃣ Run the Development Server

```sh
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🔧 Available Scripts

- `npm run dev` → Start the development server
- `npm run build` → Build for production
- `npm run start` → Start production server
- `npm run lint` → Check for linting issues

## 📞 Support

For any issues, contact []() or open an issue in the repository.

---

Happy coding! ✈️🚀
