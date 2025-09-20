# Mini Tienda - Integrated with Flask Backend

This project integrates the original React-based mini tienda with a Flask backend for dynamic product management.

## 🚀 Features

### Frontend (React)
- **Product Catalog**: Browse products with search functionality
- **Shopping Cart**: Add/remove items, quantity management
- **Dark/Light Theme**: Toggle between themes
- **Admin Panel**: Full CRUD operations for product management
- **Responsive Design**: Works on desktop and mobile devices

### Backend (Flask)
- **REST API**: Complete CRUD operations for products
- **SQLite Database**: Lightweight, file-based database
- **CORS Enabled**: Cross-origin requests from React frontend
- **Error Handling**: Proper HTTP status codes and error messages

## 📁 Project Structure

```
Proyecto mini tienda - React/
├── backend/
│   ├── app.py              # Flask application
│   ├── db.sqlite3          # SQLite database
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── componentes/
│   │   ├── BarraBusqueda.jsx
│   │   ├── BotonTema.jsx
│   │   ├── CuadriculaProductos.jsx
│   │   ├── CuponDescuento.jsx
│   │   ├── Encabezado.jsx
│   │   ├── ItemCarro.jsx
│   │   └── TarjetaProducto.jsx
│   ├── datos/
│   │   └── productos.js     # Static data (replaced by API)
│   ├── paginas/
│   │   ├── Admin.jsx        # NEW: Admin panel
│   │   ├── Catalogo.jsx
│   │   ├── Exito.jsx
│   │   ├── Pago.jsx
│   │   └── index.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── README_INTEGRATION.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd "Proyecto mini tienda - React/backend"
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the project root:
   ```bash
   cd "Proyecto mini tienda - React"
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | Get all products |
| GET | `/api/<id>` | Get specific product |
| POST | `/api/` | Create new product |
| PUT | `/api/<id>` | Update product |
| DELETE | `/api/<id>` | Delete product |

### Product Schema
```json
{
  "id": 1,
  "nombre": "Product Name",
  "precio": 25000.0
}
```

## 🎯 Usage

### For Customers
1. **Browse Products**: Use the catalog to view available products
2. **Search**: Use the search bar to find specific products
3. **Add to Cart**: Click "Agregar al Carro" on any product
4. **Manage Cart**: View cart, adjust quantities, apply coupons
5. **Checkout**: Complete purchase process

### For Administrators
1. **Access Admin Panel**: Click "Admin" in the navigation
2. **Create Products**: Use the form to add new products
3. **Edit Products**: Click "Editar" on any product to modify
4. **Delete Products**: Click "Eliminar" to remove products
5. **View All Products**: See complete product list with actions

## 🎨 UI Features

- **Responsive Design**: Adapts to different screen sizes
- **Dark/Light Mode**: Toggle themes with the button in header
- **Loading States**: Shows loading indicators during API calls
- **Error Handling**: Displays user-friendly error messages
- **Form Validation**: Client-side validation for admin forms

## 🔧 Technical Details

### Frontend Technologies
- React 18 with Hooks
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation

### Backend Technologies
- Flask 2.3
- Flask-CORS for cross-origin support
- SQLite for data storage
- SQLAlchemy for database operations

### Integration Points
- API calls use `fetch()` with proper error handling
- State management with React hooks
- CORS configured for development environment
- Database schema matches frontend expectations

## 🚀 Deployment

### Backend Deployment
```bash
# Production server (not recommended for production)
export FLASK_ENV=production
python app.py
```

### Frontend Deployment
```bash
npm run build
# Serve the dist/ folder with any static server
```

## 📝 Notes

- The original static product data (`productos.js`) has been replaced with dynamic API calls
- Cart functionality remains in-memory (can be enhanced with backend persistence)
- Admin panel provides full CRUD operations for product management
- Database is created automatically on first run
- CORS is enabled for development; configure appropriately for production

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5000 (Flask) and 5173 (Vite) are available
2. **CORS errors**: Check that Flask-CORS is properly installed and configured
3. **Database errors**: Delete `db.sqlite3` and restart Flask to recreate database
4. **API connection**: Verify both servers are running and accessible

### Debug Mode
- Flask runs in debug mode by default
- React dev server provides hot reloading
- Check browser console and terminal for error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.