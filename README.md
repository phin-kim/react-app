# Money Map - Finance Tracker

Money Map is a personal finance tracker built with React. It helps you manage your income, bills, expenses, and savings, visualize your budget, and store your data securely with Firebase.

---

## Features

- **Monthly Budgeting:**  
  Track income, bills, expenses, and savings for each month.

- **Editable Tables:**  
  Add, edit, and remove entries for all financial categories.

- **Data Visualization:**  
  View your financial data with interactive charts.

- **Persistent Storage:**  
  Save your data to Firebase Firestore for secure, cloud-based storage.

- **Responsive UI:**  
  Modern, responsive design with light/dark mode and glassmorphism effects.

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker/my-react-app
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Firebase

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Enable **Firestore Database**.
- Copy your Firebase config and replace the values in `src/firebase.js`.

### 4. Run the App

```sh
npm run dev
```
or
```sh
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
my-react-app/
├── src/
│   ├── FinanceTracker.jsx
│   ├── FinanceTracker.scss
│   ├── tables.jsx
│   ├── charts.jsx
│   ├── firebase.js
│   └── ...
├── public/
├── package.json
└── ...
```

---

## Customization

- **Theme:**  
  Toggle between light and dark mode using the theme button.
- **Glassmorphism:**  
  The UI uses `backdrop-filter` and transparency for a frosted glass effect.
- **Currency:**  
  Select your preferred currency from the dropdown.

---

## Firebase Security

**For development:**  
Set your Firestore rules to:
```plaintext
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
**Remember:**  
Before deploying, update your rules for security!

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Credits

- Built with [React](https://react.dev/) and [Firebase](https://firebase.google.com/).
- UI inspired by modern glassmorphism and material design.

---
