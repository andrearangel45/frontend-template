import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShoppingBag, Loader, AlertCircle } from 'lucide-react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
    imagen_url: '',
    youtube_id: ''
  });

  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await api.get('/productos');
      setProductos(data);
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está encendido?");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getMensajeErrorCreacion = (error) => {
    const status = error?.status;
    const apiMessage = error?.message;

    if (status === 401 || status === 403) {
      return 'Tu sesión no es válida o expiró.';
    }

    if (status === 404) {
      return 'Endpoint de creación no existe.';
    }

    if (status === 400 || status === 422) {
      return apiMessage || 'Datos inválidos.';
    }

    if (apiMessage) return apiMessage;

    return 'No se pudo crear el producto.';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const precioTexto = form.precio.trim();
    const stockTexto = form.stock.trim();
    const categoriaTexto = form.id_categoria.trim();

    const precio = Number.parseFloat(precioTexto);
    const stock = Number.parseInt(stockTexto, 10);
    const id_categoria = Number.parseInt(categoriaTexto, 10);

    if (
      !form.nombre.trim() ||
      !precioTexto ||
      !stockTexto ||
      !categoriaTexto ||
      Number.isNaN(precio) ||
      Number.isNaN(stock) ||
      Number.isNaN(id_categoria)
    ) {
      setFormError('Precio debe ser decimal válido; stock y categoría enteros válidos.');
      return;
    }

    setCreating(true);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        precio,
        stock,
        id_categoria,
        imagen_url: form.imagen_url.trim() || undefined,
        youtube_id: form.youtube_id.trim() || undefined,
      };

      await api.post('/productos/crear', payload);

      setFormSuccess('Producto creado');
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: '',
        imagen_url: '',
        youtube_id: ''
      });

      setShowForm(false);
      setLoading(true);
      await cargarProductos();
    } catch (err) {
      setFormError(getMensajeErrorCreacion(err));
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2">
      <AlertCircle /> {error}
    </div>
  );

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> Inventario
        </h1>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => {
              setShowForm((s) => !s);
              setFormError(null);
              setFormSuccess(null);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
          >
            {showForm ? 'Cerrar' : 'Nuevo'}
          </button>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {productos.length} items
          </span>
        </div>
      </header>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
              <input
                name="precio"
                value={form.precio}
                onChange={handleFormChange}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input
                name="stock"
                value={form.stock}
                onChange={handleFormChange}
                type="number"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ID Categoría</label>
              <input
                name="id_categoria"
                value={form.id_categoria}
                onChange={handleFormChange}
                type="number"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL imagen (opcional)</label>
              <input
                name="imagen_url"
                value={form.imagen_url}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube ID (opcional)</label>
              <input
                name="youtube_id"
                value={form.youtube_id}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Ej: dQw4w9WgXcQ"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {creating ? 'Creando...' : 'Crear Producto'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>

              {formError && <p className="text-red-600 ml-4">{formError}</p>}
              {formSuccess && <p className="text-green-600 ml-4">{formSuccess}</p>}
            </div>

          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden flex flex-col">
            <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50">
            {prod.youtube_id ? (
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${prod.youtube_id}`} title="Youtube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> 
            ) : (
              <img
                src={prod.imagen_url || "https://via.placeholder.com/150"}
                alt={prod.nombre}
                className="max-h-full object-contain"
              />
            )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={prod.nombre}>
                  {prod.nombre}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
                  ${prod.precio}
                </span>
              </div>

              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                {prod.descripcion || "Sin descripción disponible."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-xs font-medium text-slate-400">
                  Stock: <span className={prod.stock < 10 ? "text-red-500 font-bold" : "text-slate-600"}>{prod.stock}</span>
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;